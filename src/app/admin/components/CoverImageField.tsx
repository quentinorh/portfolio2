"use client";

import { useState } from "react";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export interface CoverImage {
  id: string;
  attachmentId: string;
  blobId: string;
  key: string | null;
  filename: string | null;
}

interface CoverImageFieldProps {
  postId: string;
  cover: CoverImage | null;
  onRefresh: () => void;
  altText?: string;
}

export default function CoverImageField({
  postId,
  cover,
  onRefresh,
  altText,
}: CoverImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const res = await fetch(`/api/admin/posts/${postId}/cover`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur upload");

      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = async () => {
    if (!cover || !confirm("Retirer l’image de couverture ?")) return;
    setRemoving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/posts/${postId}/cover`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur suppression");
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setRemoving(false);
    }
  };

  const previewUrl = cover?.key
    ? getCloudinaryUrl(cover.key, "card")
    : null;

  return (
    <div>
      <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
        Image de couverture
      </label>

      {error && (
        <div className="mb-3 p-2 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-start">
        {previewUrl && (
          <div className="relative group shrink-0">
            <div className="w-40 aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={altText || cover?.filename || "Couverture"}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="absolute -top-1 -right-1 z-10 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              title="Retirer la couverture"
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
          </div>
        )}

        <label className="w-40 aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#219CB8] hover:bg-gray-50 transition-colors shrink-0">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <span className="text-xs text-gray-500 px-2 text-center">
              Envoi...
            </span>
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs text-gray-500 px-2 text-center">
                {cover ? "Remplacer" : "Ajouter une couverture"}
              </span>
            </>
          )}
        </label>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Utilisée pour les cartes du portfolio et les listes. Si aucune image
        n’est définie ici, la première photo de la galerie est affichée.
      </p>
    </div>
  );
}
