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
  /** Vue par défaut : "selection" (accueil) ou "all" (page Projets) */
  defaultView?: "selection" | "all";
};

type ViewType = "selection" | "all" | "tag";

export default function ProjectsSection({
  posts,
  tags,
  tagCounts,
  hasFeaturedPosts,
  featuredCount,
  defaultView,
}: ProjectsSectionProps) {
  // État du filtre côté client
  const getInitialView = (): ViewType => {
    if (defaultView === "all") return "all";
    return hasFeaturedPosts ? "selection" : "all";
  };
  const [currentView, setCurrentView] = useState<ViewType>(getInitialView);
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-stone-500">
          {sectionTitle}
        </h2>
        <div className="h-px flex-1 bg-stone-200 ml-6 mr-6" />
        <span className="text-sm text-stone-400">
          {displayedPosts.length} projet{displayedPosts.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Filter - boutons Sélection/Tous et tags sur une ligne avec séparateur */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {/* Sélection / Tous */}
          {hasFeaturedPosts && (
            <>
              <button
                onClick={handleSelectionClick}
                className={`inline-flex items-center gap-2 px-4 pt-[0.5rem] pb-[0.3rem] rounded-full text-sm font-medium transition-all duration-200 ${
                  currentView === "selection"
                    ? "bg-accent text-white shadow-sm"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-accent/40 hover:text-accent hover:bg-accent-light"
                }`}
              >
                <svg className="relative -top-[1px] w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Sélection
              </button>

              <button
                onClick={handleAllClick}
                className={`inline-flex items-center gap-2 px-4 pt-[0.5rem] pb-[0.3rem] rounded-full text-sm font-medium transition-all duration-200 ${
                  currentView === "all"
                    ? "bg-accent text-white shadow-sm"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-accent/40 hover:text-accent hover:bg-accent-light"
                }`}
              >
                <svg className="relative -top-[1px] w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Tous
              </button>
            </>
          )}

          {/* Si pas de featured posts, afficher juste "Tous" comme actif */}
          {!hasFeaturedPosts && (
            <button
              onClick={handleAllClick}
              className={`inline-flex items-center gap-2 px-4 pt-[0.5rem] pb-[0.3rem] rounded-full text-sm font-medium transition-all duration-200 ${
                currentView === "all" && !selectedTag
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <svg className="relative -top-0.5 w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Tous
            </button>
          )}

          {/* Séparateur vertical entre Sélection/Tous et les tags */}
          {tags.length > 0 && (
            <>
              <div className="h-5 w-px bg-stone-200 shrink-0" aria-hidden />
              {tags.map((tag) => {
                const isSelected = selectedTag === tag;

                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`inline-flex items-center gap-1.5 px-4 pt-[0.5rem] pb-[0.3rem] rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-accent text-white"
                        : "bg-white text-stone-500 border border-stone-200 hover:border-accent/40 hover:text-accent hover:bg-accent-light"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
      
      {/* Projects Grid with transition */}
      {displayedPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-500 mb-4">
            Aucun projet trouvé{selectedTag ? ` avec le tag "${selectedTag}"` : ""}
          </p>
          <button
            onClick={handleSelectionClick}
            className="inline-flex items-center gap-2 px-4 pt-[0.5rem] pb-[0.3rem] rounded-full bg-stone-100 text-stone-700 text-sm font-medium hover:bg-stone-200 transition-colors"
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
              featured={post.featured && currentView !== "selection"}
            />
          ))}
        </div>
      )}
    </>
  );
}
