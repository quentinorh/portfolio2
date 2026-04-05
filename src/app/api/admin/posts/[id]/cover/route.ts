import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { idSchema } from "@/lib/validations";
import { logger, createErrorResponse } from "@/lib/logger";
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit";
import { ZodError } from "zod";
import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_FOLDER =
  process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "production";

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

// POST — remplace l’image de couverture (une seule par post)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await checkAuthAndRateLimit();
  if (error) return error;

  if (!process.env.CLOUDINARY_URL) {
    return createErrorResponse(
      "Cloudinary non configuré (CLOUDINARY_URL requis pour l'upload)",
      500
    );
  }

  try {
    const { id: rawId } = await params;
    const id = idSchema.parse(rawId);

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return createErrorResponse("Post non trouvé", 404);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof Blob)) {
      return createErrorResponse("Fichier requis", 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type || "image/jpeg"};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: CLOUDINARY_FOLDER,
      resource_type: "image",
    });

    const blob = await prisma.activeStorageBlob.create({
      data: {
        key: uploadResult.public_id,
        filename: file.name || "image",
        content_type: file.type || "image/jpeg",
        metadata: null,
        service_name: "cloudinary",
        byte_size: BigInt(uploadResult.bytes ?? buffer.length),
        checksum: null,
      },
    });

    const [, attachment] = await prisma.$transaction([
      prisma.activeStorageAttachment.deleteMany({
        where: {
          record_type: "Post",
          record_id: id,
          name: "cover",
        },
      }),
      prisma.activeStorageAttachment.create({
        data: {
          name: "cover",
          record_type: "Post",
          record_id: id,
          blob_id: blob.id,
        },
      }),
    ]);

    logger.info("Couverture du post mise à jour", {
      action: "upload_cover",
      postId: String(id),
      userId: session.user?.id,
    });

    return Response.json({
      success: true,
      key: blob.key,
      blobId: String(blob.id),
      attachmentId: String(attachment.id),
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return createErrorResponse("ID invalide", 400);
    }
    logger.error("Erreur upload couverture", err, { action: "upload_cover" });
    return createErrorResponse("Erreur lors de l'upload", 500);
  }
}

// DELETE — retire l’image de couverture (la carte utilisera la 1ère photo galerie)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await checkAuthAndRateLimit();
  if (error) return error;

  try {
    const { id: rawId } = await params;
    const id = idSchema.parse(rawId);

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return createErrorResponse("Post non trouvé", 404);
    }

    const deleted = await prisma.activeStorageAttachment.deleteMany({
      where: {
        record_type: "Post",
        record_id: id,
        name: "cover",
      },
    });

    logger.info("Couverture du post supprimée", {
      action: "delete_cover",
      postId: String(id),
      count: deleted.count,
      userId: session.user?.id,
    });

    return Response.json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return createErrorResponse("ID invalide", 400);
    }
    logger.error("Erreur suppression couverture", err, {
      action: "delete_cover",
    });
    return createErrorResponse("Erreur lors de la suppression", 500);
  }
}
