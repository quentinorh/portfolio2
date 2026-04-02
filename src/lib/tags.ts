import { prisma } from "@/lib/prisma";

/**
 * Synchronise les tags d'un post : supprime les anciens, ajoute les nouveaux,
 * crée les tags inexistants, et met à jour les compteurs.
 */
export async function syncPostTags(postId: bigint, tagNames: string[]) {
  const normalized = tagNames
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
  const unique = [...new Set(normalized)];

  const existingTaggings = await prisma.tagging.findMany({
    where: { taggable_type: "Post", taggable_id: postId },
    include: { tag: true },
  });

  const currentTagNames = existingTaggings
    .map((t) => t.tag?.name?.toLowerCase())
    .filter((n): n is string => !!n);

  const toAdd = unique.filter((name) => !currentTagNames.includes(name));
  const toRemove = existingTaggings.filter(
    (t) => !unique.includes(t.tag?.name?.toLowerCase() ?? "")
  );

  // Supprimer les tags retirés
  if (toRemove.length > 0) {
    const removeIds = toRemove.map((t) => t.id);
    const removeTagIds = toRemove
      .map((t) => t.tag_id)
      .filter((id): id is bigint => id !== null);

    await prisma.tagging.deleteMany({
      where: { id: { in: removeIds } },
    });

    // Décrémenter les compteurs
    for (const tagId of removeTagIds) {
      await prisma.tag.update({
        where: { id: tagId },
        data: { taggings_count: { decrement: 1 } },
      });
    }
  }

  // Ajouter les nouveaux tags
  for (const name of toAdd) {
    let tag = await prisma.tag.findUnique({ where: { name } });

    if (!tag) {
      tag = await prisma.tag.create({
        data: { name, taggings_count: 0 },
      });
    }

    await prisma.tagging.create({
      data: {
        tag_id: tag.id,
        taggable_type: "Post",
        taggable_id: postId,
        context: "tags",
      },
    });

    await prisma.tag.update({
      where: { id: tag.id },
      data: { taggings_count: { increment: 1 } },
    });
  }
}
