"use client";

import { useState } from "react";

interface Post {
  id?: string;
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

interface PostFormProps {
  post?: Post;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}

export default function PostForm({ post, onSubmit, saving }: PostFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    description: post?.description || "",
    source: post?.source || "",
    script: post?.script || "",
    date: post?.date ? post.date.split("T")[0] : "",
    alt_text: post?.alt_text || "",
    draft: post?.draft ?? true,
    featured: post?.featured ?? false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // Générer un slug à partir du titre
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
      .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères spéciaux par des tirets
      .replace(/^-|-$/g, ""); // Enlever les tirets au début et à la fin
    setFormData((prev) => ({ ...prev, slug }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Titre */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[#2D2D2D] mb-2"
          >
            Titre
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219CB8] focus:border-transparent"
            placeholder="Titre du post"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-[#2D2D2D] mb-2"
          >
            Slug (URL)
          </label>
          <div className="flex gap-2">
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219CB8] focus:border-transparent"
              placeholder="mon-projet"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Générer
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            URL: /posts/{formData.slug || "..."}
          </p>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#2D2D2D] mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219CB8] focus:border-transparent resize-y"
            placeholder="Description du projet..."
          />
        </div>

        {/* Source (iframe/embed) */}
        <div>
          <label
            htmlFor="source"
            className="block text-sm font-medium text-[#2D2D2D] mb-2"
          >
            Source (iframe/embed HTML)
          </label>
          <textarea
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219CB8] focus:border-transparent resize-y font-mono text-sm"
            placeholder='<iframe src="..."></iframe>'
          />
        </div>

        {/* Script */}
        <div>
          <label
            htmlFor="script"
            className="block text-sm font-medium text-[#2D2D2D] mb-2"
          >
            Script (JavaScript/HTML)
          </label>
          <textarea
            id="script"
            name="script"
            value={formData.script}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219CB8] focus:border-transparent resize-y font-mono text-sm"
            placeholder="<script>...</script>"
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-[#2D2D2D] mb-2"
          >
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219CB8] focus:border-transparent"
          />
        </div>

        {/* Alt text */}
        <div>
          <label
            htmlFor="alt_text"
            className="block text-sm font-medium text-[#2D2D2D] mb-2"
          >
            Texte alternatif (images)
          </label>
          <input
            id="alt_text"
            name="alt_text"
            type="text"
            value={formData.alt_text}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219CB8] focus:border-transparent"
            placeholder="Description des images pour l'accessibilité"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <input
              id="draft"
              name="draft"
              type="checkbox"
              checked={formData.draft}
              onChange={handleChange}
              className="w-4 h-4 text-[#219CB8] border-gray-300 rounded focus:ring-[#219CB8]"
            />
            <label htmlFor="draft" className="text-sm text-[#2D2D2D]">
              Brouillon (non visible sur le site)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
            />
            <label htmlFor="featured" className="text-sm text-[#2D2D2D]">
              <span className="font-medium">Mettre en avant</span>
              <span className="text-gray-500 ml-1">
                (afficher dans "Projets sélectionnés")
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#219CB8] text-white font-medium rounded-md hover:bg-[#1a7a91] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Enregistrement..." : post ? "Mettre à jour" : "Créer"}
        </button>
      </div>
    </form>
  );
}
