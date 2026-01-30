import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";
import HeroContent from "@/components/HeroContent";

type Post = {
  id: bigint;
  title: string | null;
  slug: string | null;
  draft: boolean | null;
  featured: boolean | null;
  photoKey: string | null;
  tagNames: string[];
};

/**
 * Récupère tous les posts avec leurs images et tags en minimisant les requêtes DB
 * Optimisation : 3 requêtes au lieu de N*2+1 (économie significative)
 */
async function getPosts() {
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

async function getAllTags() {
  const tags = await prisma.tag.findMany({
    where: {
      taggings_count: { gt: 0 },
    },
    orderBy: { taggings_count: "desc" },
  });
  return tags.map((t) => t.name).filter(Boolean) as string[];
}

export default async function HomePage() {
  let posts: Post[] = [];
  let allTags: string[] = [];

  try {
    [posts, allTags] = await Promise.all([getPosts(), getAllTags()]);
  } catch (e) {
    console.error("DB error (DATABASE_URL configurée ?):", e);
  }

  const featuredPosts = posts.filter((p) => p.featured);
  const hasFeaturedPosts = featuredPosts.length > 0;

  // Calculer le nombre de posts par tag
  const tagCounts: Record<string, number> = {};
  for (const tag of allTags) {
    tagCounts[tag] = posts.filter((p) => p.tagNames.includes(tag)).length;
  }

  // Convertir bigint en string pour le composant client
  const clientPosts = posts.map((p) => ({
    id: String(p.id),
    title: p.title,
    slug: p.slug,
    featured: !!p.featured,
    photoKey: p.photoKey,
    tagNames: p.tagNames,
  }));

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <HeroContent />
        </div>
      </section>

      {/* Projects Section */}
      <section className="pb-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-stone-500">
                Aucun projet pour l'instant.
              </p>
              <p className="text-sm text-stone-400 mt-2">
                Configure <code className="px-2 py-0.5 rounded bg-stone-100 text-stone-600">DATABASE_URL</code> pour afficher les projets.
              </p>
            </div>
          ) : (
            <ProjectsSection
              posts={clientPosts}
              tags={allTags}
              tagCounts={tagCounts}
              hasFeaturedPosts={hasFeaturedPosts}
              featuredCount={featuredPosts.length}
            />

)}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logoQ.png"
                alt="Quentin Orhant"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-sm text-stone-600">
                {new Date().getFullYear()} Quentin Orhant
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="mailto:quentin.orhant@mailo.fr"
                className="text-sm text-stone-500 hover:text-accent transition-colors"
              >
                quentin.orhant@mailo.fr
              </a>
             
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
