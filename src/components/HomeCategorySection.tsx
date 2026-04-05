import Link from "next/link";
import ProjectCard from "./ProjectCard";

type Post = {
  id: string;
  title: string | null;
  slug: string | null;
  featured: boolean;
  photoKey: string | null;
  tagNames: string[];
};

type HomeCategorySectionProps = {
  tag: string;
  posts: Post[];
  icon: React.ReactNode;
};

export default function HomeCategorySection({
  tag,
  posts,
  icon,
}: HomeCategorySectionProps) {
  const displayed = posts.slice(0, 3);

  if (displayed.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
          {icon}
        </div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-stone-500">
          {tag}
        </h2>
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-sm text-stone-400">
          {posts.length} projet{posts.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((post) => (
          <ProjectCard
            key={post.id}
            id={post.id}
            title={post.title}
            slug={post.slug}
            photoKey={post.photoKey}
            tags={post.tagNames}
          />
        ))}
      </div>

      {/* "Voir tous" link */}
      {posts.length > 3 && (
        <div className="mt-4 flex justify-end">
          <Link
            href={`/projets?tag=${encodeURIComponent(tag)}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-accent transition-colors group"
          >
            Voir les {posts.length} projets
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
