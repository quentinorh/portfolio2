"use client";

import { useState, useCallback } from "react";
import ProjectCard from "./ProjectCard";

type Post = {
  id: string;
  title: string | null;
  slug: string | null;
  featured: boolean;
  photoKey: string | null;
  tagNames: string[];
};

type ProjectsSectionProps = {
  posts: Post[];
  tags: string[];
  tagCounts: Record<string, number>;
  hasFeaturedPosts: boolean;
  featuredCount: number;
};

type ViewType = "selection" | "all" | "tag";

export default function ProjectsSection({
  posts,
  tags,
  tagCounts,
  hasFeaturedPosts,
  featuredCount,
}: ProjectsSectionProps) {
  // État du filtre côté client
  const [currentView, setCurrentView] = useState<ViewType>(
    hasFeaturedPosts ? "selection" : "all"
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Handlers pour les clics (sans rechargement de page)
  const handleSelectionClick = useCallback(() => {
    setCurrentView("selection");
    setSelectedTag(null);
  }, []);

  const handleAllClick = useCallback(() => {
    setCurrentView("all");
    setSelectedTag(null);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setCurrentView("tag");
    setSelectedTag(tag);
  }, []);

  // Filtrer les posts selon l'état actuel
  const displayedPosts = (() => {
    if (selectedTag) {
      return posts.filter((p) => p.tagNames.includes(selectedTag));
    }
    if (currentView === "selection" && hasFeaturedPosts) {
      return posts.filter((p) => p.featured);
    }
    return posts;
  })();

  // Titre de la section
  const sectionTitle = (() => {
    if (currentView === "tag" && selectedTag) {
      return `Projets : ${selectedTag}`;
    }
    if (currentView === "selection") {
      return "Sélection";
    }
    return "Tous les projets";
  })();

  return (
    <>
      {/* Header with count */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-stone-500">
          {sectionTitle}
        </h2>
        <div className="h-px flex-1 bg-stone-200 ml-6 mr-6" />
        <span className="text-sm text-stone-400">
          {displayedPosts.length} projet{displayedPosts.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Filter - maintenant avec des boutons au lieu de liens */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Ligne 1 : Sélection / Tous */}
        <div className="flex flex-wrap items-center gap-2">
          {hasFeaturedPosts && (
            <>
              <button
                onClick={handleSelectionClick}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentView === "selection"
                    ? "bg-accent text-white shadow-sm"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-accent/40 hover:text-accent hover:bg-accent-light"
                }`}
              >
                Sélection
              </button>

              <button
                onClick={handleAllClick}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentView === "all"
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                Tous
              </button>
            </>
          )}

          {/* Si pas de featured posts, afficher juste "Tous" comme actif */}
          {!hasFeaturedPosts && (
            <button
              onClick={handleAllClick}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                currentView === "all" && !selectedTag
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              Tous
            </button>
          )}
        </div>

        {/* Ligne 2 : boutons de tag */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTag === tag;

              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-accent text-white"
                      : "bg-white text-stone-500 border border-stone-200 hover:border-accent/40 hover:text-accent hover:bg-accent-light"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Projects Grid with transition */}
      {displayedPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-500 mb-4">
            Aucun projet trouvé{selectedTag ? ` avec le tag "${selectedTag}"` : ""}
          </p>
          <button
            onClick={handleSelectionClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-700 text-sm font-medium hover:bg-stone-200 transition-colors"
          >
            Voir la sélection
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedPosts.map((post) => (
            <ProjectCard
              key={post.id}
              id={post.id}
              title={post.title}
              slug={post.slug}
              photoKey={post.photoKey}
              tags={post.tagNames}
              featured={post.featured && currentView === "all"}
            />
          ))}
        </div>
      )}
    </>
  );
}
