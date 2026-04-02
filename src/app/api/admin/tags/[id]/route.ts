import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger, createErrorResponse } from "@/lib/logger";
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return createErrorResponse("Non autorisé", 401);
  }

  const rateLimitResult = rateLimit(
    `admin:${session.user?.id}`,
    RATE_LIMITS.adminApi
  );
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult.resetIn);
  }

  try {
    const { id: rawId } = await params;

    if (!/^\d+$/.test(rawId)) {
      return createErrorResponse("ID invalide", 400);
    }

    const id = BigInt(rawId);

    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      return createErrorResponse("Tag non trouvé", 404);
    }

    // Supprimer tous les taggings associés
    await prisma.tagging.deleteMany({
      where: { tag_id: id },
    });

    await prisma.tag.delete({ where: { id } });

    logger.info("Tag supprimé", {
      action: "delete_tag",
      tagId: String(id),
      tagName: tag.name,
      userId: session.user?.id,
    });

    return Response.json({ success: true });
  } catch {
    return createErrorResponse("Erreur serveur", 500);
  }
}
