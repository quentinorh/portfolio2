import { getPosts } from "@/lib/posts";
import Link from "next/link";
import Header from "@/components/Header";
import HeroContent from "@/components/HeroContent";
import HomeCategorySection from "@/components/HomeCategorySection";

export const revalidate = 60;

const HOMEPAGE_TAGS = [
  {
    name: "Développement",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    name: "Fabrication",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1.066.652 2.421.152 2.573-1.066zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Photographie",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
] as const;

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getPosts>> = [];

  try {
    posts = await getPosts();
  } catch (e) {
    console.error("DB error (DATABASE_URL configurée ?):", e);
  }

  const clientPosts = posts.map((p) => ({
    id: String(p.id),
    title: p.title,
    slug: p.slug,
    photoKey: p.photoKey,
    tagNames: p.tagNames,
  }));

  const postsByTag = HOMEPAGE_TAGS.map(({ name, icon }) => ({
    tag: name,
    icon,
    posts: clientPosts.filter((p) =>
      p.tagNames.some((t) => t.toLowerCase() === name.toLowerCase())
    ),
  }));

  const hasAnyPosts = postsByTag.some((s) => s.posts.length > 0);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <HeroContent />
        </div>
      </section>

      {/* Category sections */}
      <section className="pb-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {!hasAnyPosts ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-stone-500">Aucun projet pour l&apos;instant.</p>
              <p className="text-sm text-stone-400 mt-2">
                Configure <code className="px-2 py-0.5 rounded bg-stone-100 text-stone-600">DATABASE_URL</code> pour afficher les projets.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {postsByTag.map(({ tag, icon, posts: tagPosts }) => (
                <HomeCategorySection
                  key={tag}
                  tag={tag}
                  posts={tagPosts}
                  icon={icon}
                />
              ))}

              {/* CTA vers tous les projets */}
              <div className="flex justify-center pt-4">
                <Link
                  href="/projets"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-stone-700 text-sm font-medium border border-stone-200 hover:border-accent/40 hover:text-accent hover:bg-accent-light transition-all duration-200 group"
                >
                  Voir tous les projets
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
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
