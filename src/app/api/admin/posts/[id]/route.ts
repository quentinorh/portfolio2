import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postUpdateSchema, idSchema } from "@/lib/validations";
import { logger, createErrorResponse } from "@/lib/logger";
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit";
import { ZodError } from "zod";

// Helper pour vérifier l'auth et le rate limit
async function checkAuthAndRateLimit() {
  const session = await auth();
  if (!session) {
    return { error: createErrorResponse("Non autorisé", 401) };
  }

  const rateLimitResult = rateLimit(
    `admin:${session.user?.id}`,
    RATE_LIMITS.adminApi
  );
  if (!rateLimitResult.success) {
    return { error: createRateLimitResponse(rateLimitResult.resetIn) };
  }

  return { session };
}

// GET - Récupérer un post par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await checkAuthAndRateLimit();
  if (error) return error;

  try {
    const { id: rawId } = await params;
    
    // Validation de l'ID
    const id = idSchema.parse(rawId);

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return createErrorResponse("Post non trouvé", 404);
    }

    const attachments = await prisma.activeStorageAttachment.findMany({
      where: {
        record_type: "Post",
        record_id: id,
        name: "photos",
      },
      include: { blob: true },
      orderBy: { id: "asc" },
    });

    const photos = attachments.map((a) => ({
      id: String(a.id),
      attachmentId: String(a.id),
      blobId: String(a.blob_id),
      key: a.blob?.key ?? null,
      filename: a.blob?.filename ?? null,
    }));

    return Response.json({
      ...post,
      id: String(post.id),
      photos,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return createErrorResponse("ID invalide", 400);
    }
    logger.error("Erreur GET post", err, { action: "get_post" });
    return createErrorResponse("Erreur serveur", 500);
  }
}

// PUT - Mettre à jour un post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await checkAuthAndRateLimit();
  if (error) return error;

  try {
    const { id: rawId } = await params;
    
    // Validation de l'ID
    const id = idSchema.parse(rawId);

    const body = await request.json();
    
    // Validation des données
    const validatedData = postUpdateSchema.parse(body);

    // Vérifier que le post existe
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return createErrorResponse("Post non trouvé", 404);
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(validatedData.title !== undefined && { title: validatedData.title }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.source !== undefined && { source: validatedData.source }),
        ...(validatedData.script !== undefined && { script: validatedData.script }),
        ...(validatedData.date !== undefined && { 
          date: validatedData.date ? new Date(validatedData.date) : null 
        }),
        ...(validatedData.draft !== undefined && { draft: validatedData.draft }),
        ...(validatedData.featured !== undefined && { featured: validatedData.featured }),
        ...(validatedData.slug !== undefined && { slug: validatedData.slug }),
        ...(validatedData.alt_text !== undefined && { alt_text: validatedData.alt_text }),
        ...(validatedData.order_number !== undefined && { order_number: validatedData.order_number }),
        updated_at: new Date(),
      },
    });

    logger.info("Post mis à jour", { 
      action: "update_post", 
      postId: String(post.id),
      userId: session.user?.id,
    });

    return Response.json({
      ...post,
      id: String(post.id),
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return createErrorResponse(
        "Données invalides",
        400,
        err.issues.map((e) => e.message).join(", ")
      );
    }
    logger.error("Erreur PUT post", err, { action: "update_post" });
    return createErrorResponse("Erreur serveur", 500);
  }
}

// DELETE - Supprimer un post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await checkAuthAndRateLimit();
  if (error) return error;

  try {
    const { id: rawId } = await params;
    
    // Validation de l'ID
    const id = idSchema.parse(rawId);

    // Vérifier que le post existe
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return createErrorResponse("Post non trouvé", 404);
    }

    await prisma.post.delete({
      where: { id },
    });

    logger.info("Post supprimé", { 
      action: "delete_post", 
      postId: String(id),
      userId: session.user?.id,
    });

    return Response.json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return createErrorResponse("ID invalide", 400);
    }
    logger.error("Erreur DELETE post", err, { action: "delete_post" });
    return createErrorResponse("Erreur serveur", 500);
  }
}
