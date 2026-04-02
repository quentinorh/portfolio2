"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PostWithPhoto {
  id: string;
  title: string | null;
  photoUrl: string | null;
}

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

function computeGrid(count: number): { cols: number; rows: number } {
  if (count <= 1) return { cols: 1, rows: 1 };
  if (count <= 2) return { cols: 2, rows: 1 };
  if (count <= 4) return { cols: 2, rows: 2 };
  if (count <= 6) return { cols: 3, rows: 2 };
  if (count <= 9) return { cols: 3, rows: 3 };
  if (count <= 12) return { cols: 4, rows: 3 };
  if (count <= 16) return { cols: 4, rows: 4 };
  if (count <= 20) return { cols: 5, rows: 4 };
  const cols = Math.ceil(Math.sqrt(count * (OG_WIDTH / OG_HEIGHT)));
  const rows = Math.ceil(count / cols);
  return { cols, rows };
}

export default function OgGeneratorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<PostWithPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gap, setGap] = useState(0);
  const [bgColor, setBgColor] = useState("#1a1a1a");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchPosts() {
      try {
        const res = await fetch("/api/admin/og-generator");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (!res.ok) throw new Error("Erreur chargement");
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        setError("Erreur lors du chargement des posts");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const postsWithPhotos = posts.filter((p) => p.photoUrl);
  const { cols, rows } = computeGrid(postsWithPhotos.length);

  const scale = typeof window !== "undefined"
    ? Math.min(1, (window.innerWidth - 80) / OG_WIDTH)
    : 0.75;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-[#2D2D2D]">
          Générateur d&apos;image OG
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Grille 1200×630px à partir des photos de vos projets publiés.
          Faites un screenshot de la zone ci-dessous.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">
            Fermer
          </button>
        </div>
      )}

      <div className="mb-6 flex items-center gap-6 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Espacement
          <input
            type="range"
            min={0}
            max={12}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-xs text-gray-400 w-8">{gap}px</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Fond
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <span className="text-xs text-gray-400">{bgColor}</span>
        </label>
        <span className="text-xs text-gray-400">
          {postsWithPhotos.length} photos • {cols}×{rows} grille
        </span>
      </div>

      <div
        className="inline-block border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        <div
          ref={containerRef}
          style={{
            width: OG_WIDTH,
            height: OG_HEIGHT,
            backgroundColor: bgColor,
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: `${gap}px`,
            padding: `${gap}px`,
          }}
        >
          {postsWithPhotos.map((post) => (
            <div
              key={post.id}
              className="relative overflow-hidden"
              style={{ width: cellWidth, height: cellHeight }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.photoUrl!}
                alt={post.title || ""}
                className="absolute inset-0 w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          ))}
        </div>
      </div>

      {postsWithPhotos.length > 0 && (
        <div
          className="mt-4"
          style={{ width: OG_WIDTH * scale, marginBottom: OG_HEIGHT * (1 - scale) }}
        >
          <p className="text-xs text-gray-400">
            Dimensions exactes : {OG_WIDTH}×{OG_HEIGHT}px — Utilisez
            l&apos;outil de capture de votre OS (ou une extension navigateur)
            pour capturer précisément cette zone.
          </p>
        </div>
      )}

      {postsWithPhotos.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">
            Aucun post publié avec photo trouvé
          </p>
        </div>
      )}
    </div>
  );
}
