"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Source = { name: string; url: string };

function SourceFields({
  sources,
  onAdd,
  onRemove,
  onChange,
}: {
  sources: Source[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: "name" | "url", value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Sources *
      </label>
      <div className="flex flex-col gap-3">
        {sources.map((source, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Source name"
              value={source.name}
              onChange={(e) => onChange(index, "name", e.target.value)}
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              type="url"
              placeholder="https://..."
              value={source.url}
              onChange={(e) => onChange(index, "url", e.target.value)}
              className="flex-[2] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
            />
            {sources.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        + Add another source
      </button>
    </div>
  );
}

function KeyFactsFields({
  facts,
  onAdd,
  onRemove,
  onChange,
}: {
  facts: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Key facts (optional)
      </label>
      <div className="flex flex-col gap-2">
        {facts.map((fact, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 2 million people displaced"
              value={fact}
              onChange={(e) => onChange(index, e.target.value)}
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        + Add a fact
      </button>
    </div>
  );
}

export function SubmitConflictForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [summary, setSummary] = useState("");
  const [keyFacts, setKeyFacts] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [sources, setSources] = useState<Source[]>([{ name: "", url: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);

  function handleSourceChange(index: number, field: "name" | "url", value: string) {
    setSources((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addSource() {
    setSources((prev) => [...prev, { name: "", url: "" }]);
  }

  function removeSource(index: number) {
    setSources((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFactChange(index: number, value: string) {
    setKeyFacts((prev) => prev.map((f, i) => (i === index ? value : f)));
  }

  function addFact() {
    setKeyFacts((prev) => [...prev, ""]);
  }

  function removeFact(index: number) {
    setKeyFacts((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleGenerate() {
    if (!country.trim()) {
      setError("Enter a country name first, then click Generate.");
      return;
    }

    setGenerating(true);
    setError(null);
    setGenerateMessage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: country.trim(), title: title.trim() }),
      });

      const data = await response.json();

      if (data.message) {
        setGenerateMessage(data.message);
      }

      if (data.summary) setSummary(data.summary);
      if (data.keyFacts?.length > 0) setKeyFacts(data.keyFacts);
      if (data.sources?.length > 0) setSources(data.sources);
      if (data.region && !region) setRegion(data.region);
    } catch {
      setError("Could not generate content. You can still write your own.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const validSources = sources.filter((s) => s.name.trim() && s.url.trim());
    const validFacts = keyFacts.filter((f) => f.trim().length > 0);

    try {
      const response = await fetch("/api/conflicts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          country,
          region,
          summary,
          keyFacts: validFacts,
          sources: validSources,
          imageUrl: imageUrl || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      router.push(`/conflicts/${data.slug}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title *
        </label>
        <input
          type="text"
          placeholder="e.g. Conflict in South Kivu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Country *
          </label>
          <input
            type="text"
            placeholder="e.g. Democratic Republic of the Congo"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Region *
          </label>
          <input
            type="text"
            placeholder="e.g. Central Africa"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          Enter a country and title above, then click the button to search Wikipedia, ReliefWeb,
          UNHCR, and Google News for relevant information. You can edit everything after.
        </p>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          {generating ? "Searching across sources..." : "Search and auto-fill"}
        </button>
        {generateMessage && (
          <p className="mt-2 text-xs text-zinc-400">{generateMessage}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Summary *
        </label>
        <p className="mb-2 text-xs text-zinc-400">
          Describe what is happening, who is affected, and why it matters. Minimum 50 characters.
        </p>
        <textarea
          placeholder="Tell people what's going on..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={8}
          className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <KeyFactsFields
        facts={keyFacts}
        onAdd={addFact}
        onRemove={removeFact}
        onChange={handleFactChange}
      />

      <SourceFields
        sources={sources}
        onAdd={addSource}
        onRemove={removeSource}
        onChange={handleSourceChange}
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Image URL (optional)
        </label>
        <input
          type="url"
          placeholder="https://images.unsplash.com/..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="self-end rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {submitting ? "Submitting..." : "Submit conflict"}
      </button>
    </form>
  );
}
