import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";
import { getCloudinaryUrlRaw } from "@/lib/cloudinary";
import Header from "@/components/Header";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const isNumeric = /^\d+$/.test(slug);
  const post = await prisma.post.findFirst({
    where: isNumeric
      ? { id: BigInt(slug), draft: false }
      : { slug, draft: false },
  });

  if (!post) notFound();

  const [attachments, taggings] = await Promise.all([
    prisma.activeStorageAttachment.findMany({
      where: {
        record_type: "Post",
        record_id: post.id,
        name: "photos",
      },
      include: { blob: true },
      orderBy: { id: "asc" },
    }),
    prisma.tagging.findMany({
      where: {
        taggable_type: "Post",
        taggable_id: post.id,
      },
      include: { tag: true },
    }),
  ]);

  const photoKeys = attachments.map((a) => a.blob?.key).filter(Boolean) as string[];
  const tagNames = taggings.map((t) => t.tag?.name).filter(Boolean) as string[];

  // Extraire les URLs du champ source (séparées par espaces ou retours à la ligne)
  const sourceUrls =
    post.source
      ?.split(/\s+/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith("http://") || s.startsWith("https://")) ?? [];

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Main Content - Two Column Layout */}
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/projets"
              className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-accent transition-colors group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux projets
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Gallery */}
            <div className="order-2 lg:order-1">
              {photoKeys.length > 0 && (
                <div className="space-y-4 lg:sticky lg:top-24">
                  {photoKeys.map((key, i) => {
                    const imageUrl = getCloudinaryUrlRaw(key);
                    if (!imageUrl) return null;

                    return (
                      <div
                        key={key}
                        className="group relative overflow-hidden rounded-xl bg-stone-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={post.alt_text || `${post.title} - ${i + 1}`}
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column - Content */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                {/* Title & Tags */}
                <div className="mb-8">
                  <h1 className="uppercase text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 mb-4 tracking-tight leading-tight">
                    {post.title || "Sans titre"}
                  </h1>
                  {tagNames.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tagNames.map((tag) => (
                        <span
                          key={tag}
                          className="tag inline-flex px-3 py-1 text-xs font-medium rounded-full bg-accent-light text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                {post.description && (
                  <div className="mb-8">
                    <div
                      className="prose prose-stone prose-lg max-w-none text-stone-600 leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.description) }}
                    />
                  </div>
                )}

                {/* Sources */}
                {sourceUrls.length > 0 && (
                  <div className="mb-8 border-t border-stone-200">
                    <h2 className="pt-8 font-medium uppercase tracking-wider text-stone-500 mb-3 text-sm">
                      Sources
                    </h2>
                    <ul className="space-y-2 text-stone-600">
                      {sourceUrls.map((url) => (
                        <li key={url}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline break-all text-sm"
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* Footer */}
      <footer className="border-t border-stone-200 bg-stone-50 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-600">
                Quentin Orhant
              </span>
            </div>
            <a
              href="mailto:quentin.orhant@mailo.fr"
              className="text-sm text-stone-500 hover:text-accent transition-colors"
            >
              quentin.orhant@mailo.fr
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
