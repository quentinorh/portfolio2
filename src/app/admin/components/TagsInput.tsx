"use client";

import { useState, useEffect, useRef } from "react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsInput({ value, onChange }: TagsInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/tags")
      .then((res) => res.json())
      .then((data: { name: string }[]) => {
        setAllTags(data.map((t) => t.name).filter(Boolean));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (input.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const query = input.toLowerCase();
    const filtered = allTags.filter(
      (tag) =>
        tag.toLowerCase().includes(query) &&
        !value.includes(tag.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 8));
    setHighlightedIndex(-1);
  }, [input, allTags, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (normalized && !value.includes(normalized)) {
      onChange([...value, normalized]);
    }
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        addTag(suggestions[highlightedIndex]);
      } else if (input.trim()) {
        addTag(input);
      }
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef}>
      <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
        Tags
      </label>
      <div
        className="flex flex-wrap gap-1.5 px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#219CB8] focus-within:border-transparent bg-white min-h-[42px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-[#219CB8]/10 text-[#219CB8]"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="hover:text-[#1a7a91] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
          placeholder={value.length === 0 ? "Ajouter un tag..." : ""}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="relative">
          <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((tag, index) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => addTag(tag)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    index === highlightedIndex
                      ? "bg-[#219CB8]/10 text-[#219CB8]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Appuyez sur Entrée ou virgule pour ajouter un tag.
      </p>
    </div>
  );
}
