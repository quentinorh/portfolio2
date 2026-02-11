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

// DELETE - Supprimer une photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  const { session, error } = await checkAuthAndRateLimit();
  if (error) return error;

  try {
    const { id: rawId, attachmentId: rawAttachmentId } = await params;
    const postId = idSchema.parse(rawId);
    const attachmentId = idSchema.parse(rawAttachmentId);

    const attachment = await prisma.activeStorageAttachment.findFirst({
      where: {
        id: attachmentId,
        record_type: "Post",
        record_id: postId,
        name: "photos",
      },
      include: { blob: true },
    });

    if (!attachment) {
      return createErrorResponse("Photo non trouvée", 404);
    }

    await prisma.activeStorageAttachment.delete({
      where: { id: attachmentId },
    });

    logger.info("Photo supprimée du post", {
      action: "delete_photo",
      postId: String(postId),
      attachmentId: String(attachmentId),
      userId: session.user?.id,
    });

    return Response.json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return createErrorResponse("ID invalide", 400);
    }
    logger.error("Erreur suppression photo", err, { action: "delete_photo" });
    return createErrorResponse("Erreur lors de la suppression", 500);
  }
}
