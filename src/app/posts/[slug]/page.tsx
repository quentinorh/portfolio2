import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

function buildImageUrl(key: string) {
  if (!CLOUDINARY_CLOUD) return null;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${key}`;
}

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

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#2D2D2D] antialiased">
      <header className="border-b border-[#2D2D2D]/10 px-6 py-5 md:px-12">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between">
          <Link href="/" className="text-lg font-medium uppercase tracking-wide md:text-xl">
            Quentin Orhant
          </Link>
          <nav className="flex gap-6 text-xs md:text-sm">
            <Link href="/" className="hover:text-[#219CB8]">Projets</Link>
            <Link href="/#about" className="hover:text-[#219CB8]">À propos</Link>
            <Link href="/contact" className="hover:text-[#219CB8]">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        <Link href="/" className="mb-8 inline-block text-sm text-[#219CB8] hover:underline">
          ← Retour aux projets
        </Link>

        <h1 className="mb-4 text-2xl font-medium md:text-3xl">{post.title || "Sans titre"}</h1>
        {tagNames.length > 0 && (
          <p className="mb-8 text-sm italic text-[#2D2D2D]/70">{tagNames.join(" • ")}</p>
        )}

        {post.description && (
          <div
            className="prose prose-neutral mb-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.description }}
          />
        )}

        <div className="space-y-6">
          {photoKeys.map((key, i) => {
            const url = buildImageUrl(key);
            if (!url) return null;
            return (
              <img
                key={key}
                src={url}
                alt={post.alt_text || `${post.title} - ${i + 1}`}
                className="w-full rounded-sm object-cover"
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
