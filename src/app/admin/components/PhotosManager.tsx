"use client";

import { useState, useRef } from "react";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export interface Photo {
  id: string;
  attachmentId: string;
  blobId: string;
  key: string | null;
  filename: string | null;
}

interface PhotosManagerProps {
  postId: string;
  photos: Photo[];
  onRefresh: () => void;
  altText?: string;
}

export default function PhotosManager({
  postId,
  photos,
  onRefresh,
  altText,
}: PhotosManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image (JPEG, PNG, etc.)");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/posts/${postId}/photos`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur upload");

      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!confirm("Supprimer cette photo ?")) return;
    setDeletingId(attachmentId);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/posts/${postId}/photos/${attachmentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur suppression");
      }
      onRefresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (
      reordering ||
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const newOrder = [...photos];
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    const blobIds = newOrder.map((p) => p.blobId);
    setReordering(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/posts/${postId}/photos/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blobIds }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur réorganisation");
      }
      onRefresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la réorganisation"
      );
    } finally {
      setReordering(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
        Photos
      </label>

      {error && (
        <div className="mb-3 p-2 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-start">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="photos" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-3"
              >
                {photos.map((photo, index) => {
                  const url = getCloudinaryUrl(photo.key, "thumbnail");
                  if (!url) return null;

                  return (
                    <Draggable
                      key={photo.attachmentId}
                      draggableId={photo.attachmentId}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative group flex-shrink-0"
                        >
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={altText || photo.filename || `Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(photo.attachmentId);
                            }}
                            disabled={deletingId === photo.attachmentId}
                            className="absolute -top-1 -right-1 z-10 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                            title="Supprimer"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                          <div
                            className="absolute bottom-0 left-0 right-0 py-1 flex justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing rounded-b-lg"
                            title="Glisser pour réorganiser"
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 8h16M4 16h16"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#219CB8] hover:bg-gray-50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAdd}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <span className="text-xs text-gray-500">Envoi...</span>
          ) : (
            <>
              <svg
                className="w-8 h-8 text-gray-400 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-xs text-gray-500">Ajouter</span>
            </>
          )}
        </label>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Glissez les miniatures pour réorganiser l&apos;ordre des photos.
      </p>
    </div>
  );
}
