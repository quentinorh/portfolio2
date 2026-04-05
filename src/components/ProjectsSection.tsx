"use client";

import { useState, useCallback } from "react";
import ProjectCard from "./ProjectCard";

type Post = {
  id: string;
  title: string | null;
  slug: string | null;
  photoKey: string | null;
  tagNames: string[];
};

type ProjectsSectionProps = {
  posts: Post[];
  tags: string[];
  tagCounts: Record<string, number>;
  initialTag?: string;
};

type ViewType = "all" | "tag";

export default function ProjectsSection({
  posts,
  tags,
  tagCounts,
  initialTag,
}: ProjectsSectionProps) {
  const [currentView, setCurrentView] = useState<ViewType>(initialTag ? "tag" : "all");
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag || null);

  const handleAllClick = useCallback(() => {
    setCurrentView("all");
    setSelectedTag(null);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setCurrentView("tag");
    setSelectedTag(tag);
  }, []);

  const displayedPosts = selectedTag
    ? posts.filter((p) => p.tagNames.includes(selectedTag))
    : posts;

  const sectionTitle =
    currentView === "tag" && selectedTag ? `${selectedTag}` : "Tous les projets";

  return (
    <>
      {/* Header with count */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-stone-500">
          {sectionTitle}
        </h2>
        <div className="h-px flex-1 bg-stone-200 ml-6 mr-6" />
        <span className="text-sm text-stone-400 text-right">
          {displayedPosts.length} projet{displayedPosts.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAllClick}
            className={`inline-flex items-center pl-2 pr-3 pt-[0.5rem] pb-[0.3rem] rounded-full text-sm font-medium transition-all duration-200 ${
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

          {tags.length > 0 && (
            <>
              <div className="h-5 w-px bg-stone-200 shrink-0" aria-hidden />
              {tags.map((tag) => {
                const isSelected = selectedTag === tag;

                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`lowercase inline-flex items-center pl-2 pr-3 pt-[0.5rem] pb-[0.3rem] rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-accent text-white"
                        : "bg-white text-stone-500 border border-stone-200 hover:border-accent/40 hover:text-accent hover:bg-accent-light"
                    }`}
                  >
                    <svg className="relative -top-[2px] w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    {tag}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
      
      {/* Projects Grid */}
      {displayedPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-500 mb-4">
            Aucun projet trouvé{selectedTag ? ` avec le tag "${selectedTag}"` : ""}
          </p>
          <button
            onClick={handleAllClick}
            className="inline-flex items-center gap-2 px-3 pt-[0.5rem] pb-[0.3rem] rounded-full bg-stone-100 text-stone-700 text-sm font-medium hover:bg-stone-200 transition-colors"
          >
            Voir tous les projets
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
            />
          ))}
        </div>
      )}
    </>
  );
}
