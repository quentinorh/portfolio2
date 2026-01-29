import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Pour les images Cloudinary (comme en Rails)
const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

function buildImageUrl(key: string) {
  if (!CLOUDINARY_CLOUD) return null;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${key}`;
}

export default async function HomePage() {
  let posts: Array<{
    id: bigint;
    title: string | null;
    slug: string | null;
    draft: boolean | null;
    photoKey: string | null;
    tagNames: string[];
  }> = [];

  try {
    const rawPosts = await prisma.post.findMany({
      where: { draft: false },
      orderBy: { order_number: "asc" },
    });

    for (const post of rawPosts) {
      const [attachments, taggings] = await Promise.all([
        prisma.activeStorageAttachment.findMany({
          where: {
            record_type: "Post",
            record_id: post.id,
            name: "photos",
          },
          include: { blob: true },
          take: 1,
        }),
        prisma.tagging.findMany({
          where: {
            taggable_type: "Post",
            taggable_id: post.id,
          },
          include: { tag: true },
        }),
      ]);

      const photoKey = attachments[0]?.blob?.key ?? null;
      const tagNames = taggings.map((t) => t.tag?.name).filter(Boolean) as string[];

      posts.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        draft: post.draft,
        photoKey,
        tagNames,
      });
    }
  } catch (e) {
    console.error("DB error (DATABASE_URL configurée ?):", e);
  }

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

      <main className="px-6 pb-24 pt-8 md:px-12 md:pt-12 lg:px-24">
        <div className="mx-auto max-w-[1920px]">
          {posts.length === 0 ? (
            <p className="text-center text-zinc-500">
              Aucun projet pour l’instant. Configure <code className="rounded bg-zinc-200 px-1">DATABASE_URL</code> et
              restaure le dump Heroku (voir <code className="rounded bg-zinc-200 px-1">MIGRATION.md</code>).
            </p>
          ) : (
            <div
              className="grid gap-8 md:gap-10 lg:gap-12"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {posts.map((post) => {
                const imgUrl = post.photoKey ? buildImageUrl(post.photoKey) : null;
                const slug = post.slug || String(post.id);

                return (
                  <Link
                    key={String(post.id)}
                    href={`/posts/${slug}`}
                    className="group block overflow-hidden rounded-sm bg-[#F9F9F7] transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={post.title || "Projet"}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#2D2D2D]/5">
                          <span className="text-sm text-[#2D2D2D]/30">Image à venir</span>
                        </div>
                      )}
                      <div
                        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2D2D2D]/95 via-[#2D2D2D]/70 to-[#2D2D2D]/20 p-5 md:p-6"
                        style={{ height: "9rem" }}
                      >
                        <h3 className="mb-2 text-base font-medium leading-tight tracking-tight text-white md:text-lg">
                          {post.title || "Sans titre"}
                        </h3>
                        {post.tagNames.length > 0 && (
                          <p className="text-xs italic text-white/70 md:text-sm">
                            {post.tagNames.join(" • ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
