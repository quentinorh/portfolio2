import { prisma } from "@/lib/prisma";

/**
 * Récupère tous les posts avec leurs images et tags en minimisant les requêtes DB
 * Optimisation : 3 requêtes au lieu de N*2+1 (économie significative)
 */
export async function getPosts() {
  // 1. Récupérer tous les posts publiés
  const rawPosts = await prisma.post.findMany({
    where: { draft: false },
    orderBy: [
      { order_number: { sort: "asc", nulls: "last" } },
      { id: "asc" },
    ],
  });

  if (rawPosts.length === 0) return [];

  const postIds = rawPosts.map((p) => p.id);

  // 2. Récupérer TOUTES les images et tags en 2 requêtes (au lieu de 2*N)
  const [allAttachments, allTaggings] = await Promise.all([
    prisma.activeStorageAttachment.findMany({
      where: {
        record_type: "Post",
        record_id: { in: postIds },
        name: "photos",
      },
      include: { blob: true },
      orderBy: { id: "asc" },
    }),
    prisma.tagging.findMany({
      where: {
        taggable_type: "Post",
        taggable_id: { in: postIds },
      },
      include: { tag: true },
    }),
  ]);

  // 3. Créer des maps pour accès rapide O(1)
  const photosByPostId = new Map<bigint, string>();
  for (const att of allAttachments) {
    // Garder seulement la première image par post
    if (!photosByPostId.has(att.record_id)) {
      photosByPostId.set(att.record_id, att.blob?.key ?? "");
    }
  }

  const tagsByPostId = new Map<bigint, string[]>();
  for (const tagging of allTaggings) {
    const tagName = tagging.tag?.name;
    if (tagName) {
      const existing = tagsByPostId.get(tagging.taggable_id!) || [];
      existing.push(tagName);
      tagsByPostId.set(tagging.taggable_id!, existing);
    }
  }

  // 4. Assembler les données
  return rawPosts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    draft: post.draft,
    featured: post.featured,
    photoKey: photosByPostId.get(post.id) || null,
    tagNames: tagsByPostId.get(post.id) || [],
  }));
}

export async function getAllTags() {
  const tags = await prisma.tag.findMany({
    where: {
      taggings_count: { gt: 0 },
    },
    orderBy: { taggings_count: "desc" },
  });
  return tags.map((t) => t.name).filter(Boolean) as string[];
}
