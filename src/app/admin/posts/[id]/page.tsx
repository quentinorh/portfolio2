"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PostForm from "../../components/PostForm";

interface Post {
  id: string;
  title: string | null;
  description: string | null;
  source: string | null;
  script: string | null;
  date: string | null;
  draft: boolean;
  featured: boolean;
  slug: string | null;
  alt_text: string | null;
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Rediriger vers login si pas de session
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/posts/${id}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Post non trouvé");
      const data = await res.json();
      setPost(data);
    } catch (e) {
      setError("Erreur lors du chargement du post");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPost();
    }
  }, [status, fetchPost]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur mise à jour");
      }

      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  // Afficher le chargement pendant la vérification
  if (status === "loading" || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Post non trouvé"}</p>
          <Link href="/admin" className="text-[#219CB8] hover:underline">
            Retour aux posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-[#219CB8] transition-colors"
        >
          ← Retour aux posts
        </Link>
        <h1 className="text-2xl font-medium text-[#2D2D2D] mt-4">
          Modifier le post
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <PostForm post={post} onSubmit={handleSubmit} saving={saving} />
    </div>
  );
}
