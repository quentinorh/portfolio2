import { getPosts, getAllTags } from "@/lib/posts";
import Header from "@/components/Header";
import ProjectsSection from "@/components/ProjectsSection";

// Revalider la page toutes les 60 secondes pour refléter les changements de la DB
export const revalidate = 60;

export const metadata = {
  title: "Projets - Quentin Orhant",
  description: "Découvrez les projets de Quentin Orhant, maker et développeur freelance.",
};

export default async function ProjetsPage() {
  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  let allTags: string[] = [];

  try {
    [posts, allTags] = await Promise.all([getPosts(), getAllTags()]);
  } catch (e) {
    console.error("DB error (DATABASE_URL configurée ?):", e);
  }

  const featuredPosts = posts.filter((p) => p.featured);
  const hasFeaturedPosts = featuredPosts.length > 0;

  const tagCounts: Record<string, number> = {};
  for (const tag of allTags) {
    tagCounts[tag] = posts.filter((p) => p.tagNames.includes(tag)).length;
  }

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

      {/* Projets uniquement */}
      <section className="pt-24 pb-24 px-6 lg:px-8">
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
              defaultView="all"
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-600">Quentin Orhant</span>
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
