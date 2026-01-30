"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Post {
  id: string;
  title: string | null;
  slug: string | null;
  draft: boolean;
  order_number: number | null;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export default function AdminPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Notes personnelles (persistées en base de données)
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes ?? "");
      }
    } catch (e) {
      console.error("Erreur chargement notes", e);
    }
  }, []);

  const saveNotes = useCallback(async (value: string) => {
    setSavingNotes(true);
    try {
      await fetch("/api/admin/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: value }),
      });
    } catch (e) {
      console.error("Erreur sauvegarde notes", e);
    } finally {
      setSavingNotes(false);
    }
  }, []);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    // Debounce: sauvegarde 1 seconde après la dernière frappe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(value);
    }, 1000);
  };

  // Rediriger vers login si pas de session
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/posts");
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
  }, [router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts();
      fetchNotes();
    }
  }, [status, fetchPosts, fetchNotes]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(posts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPosts(items);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/posts/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: items.map((p) => p.id) }),
      });

      if (!res.ok) throw new Error("Erreur sauvegarde");
    } catch (e) {
      setError("Erreur lors de la sauvegarde de l'ordre");
      console.error(e);
      // Recharger l'ordre original en cas d'erreur
      fetchPosts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string | null) => {
    if (!confirm(`Supprimer "${title || "Sans titre"}" ?`)) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      setPosts(posts.filter((p) => p.id !== id));
    } catch (e) {
      setError("Erreur lors de la suppression");
      console.error(e);
    }
  };

  // Afficher le chargement pendant la vérification de session
  if (status === "loading" || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Ne rien afficher si pas authentifié (redirection en cours)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-[#2D2D2D]">Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Glissez-déposez pour réordonner • {posts.length} post
            {posts.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-[#219CB8] text-white rounded-md hover:bg-[#1a7a91] transition-colors"
        >
          + Nouveau post
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <label
            htmlFor="admin-notes"
            className="text-sm font-medium text-gray-600"
          >
            Notes personnelles
          </label>
          {savingNotes && (
            <span className="text-xs text-gray-400">Sauvegarde...</span>
          )}
        </div>
        <textarea
          id="admin-notes"
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Ex. : Titres des projets à ajouter, idées de posts..."
          rows={4}
          className="w-full px-3 py-2 text-sm text-[#2D2D2D] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219CB8]/30 focus:border-[#219CB8] resize-y min-h-[80px]"
        />
      </div>

      {error && (
        <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 underline"
          >
            Fermer
          </button>
        </div>
      )}

      {saving && (
        <div className="mb-4 p-2 text-sm text-blue-600 bg-blue-50 rounded-md text-center">
          Sauvegarde en cours...
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">Aucun post pour le moment</p>
          <Link
            href="/admin/posts/new"
            className="text-[#219CB8] hover:underline"
          >
            Créer votre premier post
          </Link>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="posts">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {posts.map((post, index) => (
                  <Draggable
                    key={post.id}
                    draggableId={post.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white rounded-lg border ${
                          snapshot.isDragging
                            ? "border-[#219CB8] shadow-lg"
                            : "border-gray-200"
                        } p-4 flex items-center gap-4 transition-shadow`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 8h16M4 16h16"
                            />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-[#2D2D2D] truncate">
                              {post.title || "Sans titre"}
                            </h3>
                            {post.draft ? (
                              <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                                Brouillon
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                En ligne
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-500 truncate">
                              /{post.slug || post.id}
                            </p>
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap">
                                {post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-1.5 py-0.5 text-xs bg-[#219CB8]/10 text-[#219CB8] rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
