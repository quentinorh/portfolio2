import { prisma } from "@/lib/prisma";

/**
 * Synchronise les tags d'un post : supprime les anciens, ajoute les nouveaux,
 * crée les tags inexistants, et met à jour les compteurs.
 * Préserve la casse originale des noms de tags.
 */
export async function syncPostTags(postId: bigint, tagNames: string[]) {
  const trimmed = tagNames.map((t) => t.trim()).filter((t) => t.length > 0);
  const unique = [...new Map(trimmed.map((t) => [t.toLowerCase(), t])).values()];

  const existingTaggings = await prisma.tagging.findMany({
    where: { taggable_type: "Post", taggable_id: postId },
    include: { tag: true },
  });

  const currentTagNames = existingTaggings
    .map((t) => t.tag?.name)
    .filter((n): n is string => !!n);

  const toAdd = unique.filter(
    (name) => !currentTagNames.some((c) => c.toLowerCase() === name.toLowerCase())
  );
  const toRemove = existingTaggings.filter(
    (t) => !unique.some((name) => name.toLowerCase() === (t.tag?.name?.toLowerCase() ?? ""))
  );

  if (toRemove.length > 0) {
    const removeIds = toRemove.map((t) => t.id);
    const removeTagIds = toRemove
      .map((t) => t.tag_id)
      .filter((id): id is bigint => id !== null);

    await prisma.tagging.deleteMany({
      where: { id: { in: removeIds } },
    });

    for (const tagId of removeTagIds) {
      await prisma.tag.update({
        where: { id: tagId },
        data: { taggings_count: { decrement: 1 } },
      });
    }
  }

  for (const name of toAdd) {
    const allTags = await prisma.tag.findMany();
    let tag = allTags.find((t) => t.name?.toLowerCase() === name.toLowerCase()) ?? null;

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
