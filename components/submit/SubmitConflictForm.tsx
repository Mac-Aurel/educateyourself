"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Source = { name: string; url: string };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-neutral-400">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300"
    />
  );
}

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
      <FieldLabel>Sources *</FieldLabel>
      <div className="flex flex-col gap-4">
        {sources.map((source, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              placeholder="Source name"
              value={source.name}
              onChange={(e) => onChange(index, "name", e.target.value)}
              className="flex-1 border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300"
            />
            <input
              type="url"
              placeholder="https://..."
              value={source.url}
              onChange={(e) => onChange(index, "url", e.target.value)}
              className="flex-[2] border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300"
            />
            {sources.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-neutral-300 transition-colors hover:text-black"
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
        className="mt-3 text-xs uppercase tracking-[0.1em] text-neutral-400 transition-opacity hover:opacity-60"
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
      <FieldLabel>Key facts (optional)</FieldLabel>
      <div className="flex flex-col gap-3">
        {facts.map((fact, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. 2 million people displaced"
              value={fact}
              onChange={(e) => onChange(index, e.target.value)}
              className="flex-1 border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-neutral-300 transition-colors hover:text-black"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 text-xs uppercase tracking-[0.1em] text-neutral-400 transition-opacity hover:opacity-60"
      >
        + Add a fact
      </button>
    </div>
  );
}

export function SubmitConflictForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState(searchParams.get("title") ?? "");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [summary, setSummary] = useState("");
  const [keyFacts, setKeyFacts] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [actions, setActions] = useState<Source[]>([]);
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

  function handleActionChange(index: number, field: "name" | "url", value: string) {
    setActions((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  }

  function addAction() {
    setActions((prev) => [...prev, { name: "", url: "" }]);
  }

  function removeAction(index: number) {
    setActions((prev) => prev.filter((_, i) => i !== index));
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
      setError("Enter a country name first, then click generate.");
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

      if (data.message) setGenerateMessage(data.message);
      if (data.summary) setSummary(data.summary);
      if (data.keyFacts?.length > 0) setKeyFacts(data.keyFacts);
      if (data.sources?.length > 0) setSources(data.sources);
      if (data.actions?.length > 0) setActions(data.actions.map((a: { label: string; url: string }) => ({ name: a.label, url: a.url })));
      if (data.region && !region) setRegion(data.region);
    } catch {
      setError("Could not generate content. You can still write your own.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setImagePreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setImagePreview(null);
        return;
      }

      setImageUrl(data.url);
    } catch {
      setError("Image upload failed. You can try again or paste a URL instead.");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    setImageUrl("");
    setImagePreview(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const validSources = sources.filter((s) => s.name.trim() && s.url.trim());
    const validFacts = keyFacts.filter((f) => f.trim().length > 0);
    const validActions = actions
      .filter((a) => a.name.trim() && a.url.trim())
      .map((a) => ({ label: a.name.trim(), url: a.url.trim() }));

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
          actions: validActions,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <FieldLabel>Title *</FieldLabel>
        <TextInput value={title} onChange={setTitle} placeholder="e.g. Conflict in South Kivu" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel>Country *</FieldLabel>
          <TextInput value={country} onChange={setCountry} placeholder="e.g. Sudan" />
        </div>
        <div>
          <FieldLabel>Region *</FieldLabel>
          <TextInput value={region} onChange={setRegion} placeholder="e.g. East Africa" />
        </div>
      </div>

      <div className="border border-neutral-200 p-6">
        <p className="mb-4 text-xs leading-relaxed text-neutral-500">
          Enter a country and title above, then click the button to search Wikipedia, ReliefWeb,
          UNHCR, and Google News for relevant information. You can edit everything after.
        </p>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="border border-black px-5 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-black hover:text-white disabled:opacity-30"
        >
          {generating ? "Searching..." : "Search and auto-fill"}
        </button>
        {generateMessage && (
          <p className="mt-3 text-xs text-neutral-400">{generateMessage}</p>
        )}
      </div>

      <div>
        <FieldLabel>Summary *</FieldLabel>
        <p className="mb-2 text-xs text-neutral-400">
          Describe what is happening, who is affected, and why it matters. Minimum 50 characters.
        </p>
        <textarea
          placeholder="Tell people what's going on..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={8}
          className="w-full resize-none border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300"
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
        <FieldLabel>How to act (optional)</FieldLabel>
        <p className="mb-2 text-xs text-neutral-400">
          Links to donate, sign petitions, or support organizations helping on the ground.
        </p>
        <div className="flex flex-col gap-3">
          {actions.map((action, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. Donate to MSF"
                value={action.name}
                onChange={(e) => handleActionChange(index, "name", e.target.value)}
                className="flex-1 border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300"
              />
              <input
                type="url"
                placeholder="https://..."
                value={action.url}
                onChange={(e) => handleActionChange(index, "url", e.target.value)}
                className="flex-[2] border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300"
              />
              <button
                type="button"
                onClick={() => removeAction(index)}
                className="text-neutral-300 transition-colors hover:text-black"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addAction}
          className="mt-3 text-xs uppercase tracking-[0.1em] text-neutral-400 transition-opacity hover:opacity-60"
        >
          + Add an action link
        </button>
      </div>

      <div>
        <FieldLabel>Image (optional)</FieldLabel>
        {imagePreview || imageUrl ? (
          <div className="relative mt-2">
            <img
              src={imagePreview ?? imageUrl}
              alt="Preview"
              className="aspect-video w-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-80"
            >
              Remove
            </button>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <span className="text-xs uppercase tracking-[0.15em]">Uploading...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-4">
            <label className="flex cursor-pointer flex-col items-center border border-dashed border-neutral-300 py-8 transition-colors hover:border-black">
              <span className="text-xs uppercase tracking-[0.15em] text-neutral-400">
                Choose an image from your device
              </span>
              <span className="mt-1 text-[10px] text-neutral-300">JPEG, PNG or WebP, max 5MB</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs uppercase tracking-[0.1em] text-neutral-300">or</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>
            <TextInput value={imageUrl} onChange={setImageUrl} placeholder="Paste an image URL" type="url" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="self-end bg-black px-8 py-3 text-xs uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80 disabled:opacity-30"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
