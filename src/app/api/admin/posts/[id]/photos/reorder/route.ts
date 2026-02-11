import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { idSchema } from "@/lib/validations";
import { logger, createErrorResponse } from "@/lib/logger";
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit";
import { ZodError } from "zod";

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

// PUT - Réorganiser les photos (ordre = tableau de blobIds)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await checkAuthAndRateLimit();
  if (error) return error;

  try {
    const { id: rawId } = await params;
    const postId = idSchema.parse(rawId);

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return createErrorResponse("Post non trouvé", 404);
    }

    const body = await request.json();
    const blobIds = body.blobIds as string[] | undefined;

    if (!Array.isArray(blobIds) || blobIds.length === 0) {
      return createErrorResponse("blobIds requis (tableau non vide)", 400);
    }

    const blobIdsBigInt = blobIds.map((s) => BigInt(String(s)));

    if (new Set(blobIdsBigInt).size !== blobIdsBigInt.length) {
      return createErrorResponse("Doublons dans blobIds", 400);
    }

    const attachments = await prisma.activeStorageAttachment.findMany({
      where: {
        record_type: "Post",
        record_id: postId,
        name: "photos",
      },
    });

    const attachmentBlobIds = new Set(attachments.map((a) => a.blob_id));
    const allValid = blobIdsBigInt.every((bid) => attachmentBlobIds.has(bid));
    if (!allValid || blobIdsBigInt.length !== attachments.length) {
      return createErrorResponse("blobIds invalides ou non liés à ce post", 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.activeStorageAttachment.deleteMany({
        where: {
          record_type: "Post",
          record_id: postId,
          name: "photos",
        },
      });

      for (const blobId of blobIdsBigInt) {
        await tx.activeStorageAttachment.create({
          data: {
            name: "photos",
            record_type: "Post",
            record_id: postId,
            blob_id: blobId,
          },
        });
      }
    });

    logger.info("Photos réorganisées", {
      action: "reorder_photos",
      postId: String(postId),
      userId: session.user?.id,
    });

    return Response.json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return createErrorResponse("Données invalides", 400);
    }
    logger.error("Erreur réorganisation photos", err, {
      action: "reorder_photos",
    });
    return createErrorResponse("Erreur lors de la réorganisation", 500);
  }
}
