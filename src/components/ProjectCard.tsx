import Link from "next/link";
import Image from "next/image";
import { getCloudinaryUrl } from "@/lib/cloudinary";

type ProjectCardProps = {
  id: string;
  title: string | null;
  slug: string | null;
  photoKey: string | null;
  tags: string[];
  featured?: boolean;
};

export default function ProjectCard({
  id,
  title,
  slug,
  photoKey,
  tags,
  featured,
}: ProjectCardProps) {
  const href = `/posts/${slug || id}`;
  const imageUrl = getCloudinaryUrl(photoKey, "card");

  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200 transition-all duration-300 hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1"
    >

      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-stone-100 relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || "Projet"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="w-12 h-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-medium uppercase text-stone-900 group-hover:text-accent transition-colors">
          {title || "Sans titre"}
        </h3>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="tag inline-flex text-xs font-medium text-stone-600"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="tag inline-flex text-xs font-medium text-stone-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
