"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ConflictSummary } from "@/types/conflict";

type SearchBarProps = {
  conflicts: ConflictSummary[];
};

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function filterConflicts(conflicts: ConflictSummary[], query: string): ConflictSummary[] {
  const lower = query.toLowerCase();
  return conflicts.filter(
    (c) =>
      c.title.toLowerCase().includes(lower) ||
      c.country.toLowerCase().includes(lower) ||
      c.region.toLowerCase().includes(lower)
  );
}

export function SearchBar({ conflicts }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 150);

  const results = debouncedQuery.length >= 2 ? filterConflicts(conflicts, debouncedQuery) : [];
  const showDropdown = open && debouncedQuery.length >= 2;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(slug: string) {
    setQuery("");
    setOpen(false);
    router.push(`/conflicts/${slug}`);
  }

  function handleCreateNew() {
    setOpen(false);
    router.push(`/submit?title=${encodeURIComponent(query)}`);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="SEARCH"
        className="w-full border-b border-black bg-transparent py-3 text-sm uppercase tracking-[0.15em] outline-none placeholder:text-neutral-400 sm:text-xs sm:tracking-[0.2em]"
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 border border-t-0 border-neutral-200 bg-white shadow-sm">
          {results.length > 0 ? (
            <ul>
              {results.map((conflict) => (
                <li key={conflict.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(conflict.slug)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                  >
                    <div>
                      <span className="text-sm font-medium uppercase tracking-[0.1em] sm:text-xs">{conflict.title}</span>
                      <span className="ml-3 text-xs text-neutral-400 sm:text-[11px]">
                        {conflict.country}
                      </span>
                    </div>
                    <span className="text-xs uppercase tracking-[0.08em] text-neutral-400">
                      {conflict.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-neutral-400 sm:text-xs">
                No results found
              </p>
              <button
                type="button"
                onClick={handleCreateNew}
                className="mt-3 text-sm uppercase tracking-[0.1em] underline underline-offset-4 transition-opacity hover:opacity-60 sm:text-xs sm:tracking-[0.15em]"
              >
                Submit &quot;{query}&quot; as a new conflict
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
