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

function getGridClass(count: number): string {
  if (count % 4 === 0) return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";
  if (count % 3 === 0) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 md:grid-cols-3";
}

export default function HomeCategorySection({
  tag,
  posts,
  icon,
}: HomeCategorySectionProps) {
  if (posts.length === 0) return null;

  return (
    <div>
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
      <div className={`grid gap-6 ${getGridClass(posts.length)}`}>
        {posts.map((post) => (
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
    </div>
  );
}
