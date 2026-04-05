import { prisma } from "@/lib/prisma";

/**
 * Synchronise les tags d'un post avec la liste de noms fournie.
 * Utilise toujours le nom exact du tag existant en base (préserve la casse).
 * Ignore les noms qui ne correspondent à aucun tag existant.
 */
export async function syncPostTags(postId: bigint, tagNames: string[]) {
  const allDbTags = await prisma.tag.findMany();

  // Résoudre chaque nom envoyé vers le tag exact en base (case-insensitive)
  const resolvedTags = tagNames
    .map((name) => allDbTags.find((t) => t.name?.toLowerCase() === name.trim().toLowerCase()))
    .filter((t) => t != null);

  const targetTagIds = new Set(resolvedTags.map((t) => t.id));

  const existingTaggings = await prisma.tagging.findMany({
    where: { taggable_type: "Post", taggable_id: postId },
    include: { tag: true },
  });

  const currentTagIds = new Set(
    existingTaggings.map((t) => t.tag_id).filter((id): id is bigint => id !== null)
  );

  const toAdd = resolvedTags.filter((t) => !currentTagIds.has(t.id));
  const toRemove = existingTaggings.filter(
    (t) => t.tag_id !== null && !targetTagIds.has(t.tag_id)
  );

  if (toRemove.length > 0) {
    await prisma.tagging.deleteMany({
      where: { id: { in: toRemove.map((t) => t.id) } },
    });

    const removedTagIds = [...new Set(
      toRemove.map((t) => t.tag_id).filter((id): id is bigint => id !== null)
    )];
    for (const tagId of removedTagIds) {
      await prisma.tag.update({
        where: { id: tagId },
        data: { taggings_count: { decrement: 1 } },
      });
    }
  }

  for (const tag of toAdd) {
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
