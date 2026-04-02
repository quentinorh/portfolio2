import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger, createErrorResponse } from "@/lib/logger";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export async function GET() {
  const session = await auth();
  if (!session) {
    return createErrorResponse("Non autorisé", 401);
  }

  try {
    const posts = await prisma.post.findMany({
      where: { draft: false },
      orderBy: [
        { order_number: { sort: "asc", nulls: "last" } },
        { id: "asc" },
      ],
      take: 100,
    });

    if (posts.length === 0) return Response.json([]);

    const postIds = posts.map((p) => p.id);

    const attachments = await prisma.activeStorageAttachment.findMany({
      where: {
        record_type: "Post",
        record_id: { in: postIds },
        name: "photos",
      },
      include: { blob: true },
      orderBy: { id: "asc" },
    });

    const firstPhotoByPostId = new Map<bigint, string>();
    for (const att of attachments) {
      if (!firstPhotoByPostId.has(att.record_id) && att.blob?.key) {
        firstPhotoByPostId.set(att.record_id, att.blob.key);
      }
    }

    const result = posts.map((post) => {
      const photoKey = firstPhotoByPostId.get(post.id) || null;
      return {
        id: String(post.id),
        title: post.title,
        photoUrl: photoKey ? getCloudinaryUrl(photoKey, "card") : null,
      };
    });

    return Response.json(result);
  } catch (err) {
    logger.error("Erreur GET og-generator", err, { action: "og_generator" });
    return createErrorResponse("Erreur serveur", 500);
  }
}
