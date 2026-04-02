"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Tag {
  id: string;
  name: string;
  count: number;
}

export default function AdminTagsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/tags");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Erreur chargement");
      const data = await res.json();
      setTags(data);
    } catch {
      setError("Erreur lors du chargement des tags");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTags();
    }
  }, [status, fetchTags]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur création");
      }

      setNewTag("");
      fetchTags();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    const message =
      tag.count > 0
        ? `Supprimer "${tag.name}" ? Ce tag est utilisé par ${tag.count} post${tag.count > 1 ? "s" : ""}. Il sera retiré de tous les posts.`
        : `Supprimer "${tag.name}" ?`;

    if (!confirm(message)) return;

    setDeletingId(tag.id);
    setError("");

    try {
      const res = await fetch(`/api/admin/tags/${tag.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur suppression");
      }

      fetchTags();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur lors de la suppression"
      );
    } finally {
      setDeletingId(null);
    }
  };

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-[#2D2D2D]">Tags</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez les tags disponibles pour classer vos posts.
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

      {/* Formulaire d'ajout */}
      <form onSubmit={handleCreate} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nouveau tag..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219CB8] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={saving || !newTag.trim()}
            className="px-5 py-2 bg-[#219CB8] text-white font-medium rounded-md hover:bg-[#1a7a91] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      </form>

      {/* Liste des tags */}
      {tags.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">Aucun tag pour le moment</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-[#2D2D2D]">{tag.name}</span>
                <span className="text-xs text-gray-400">
                  {tag.count} post{tag.count !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={() => handleDelete(tag)}
                disabled={deletingId === tag.id}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              >
                {deletingId === tag.id ? "..." : "Supprimer"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
