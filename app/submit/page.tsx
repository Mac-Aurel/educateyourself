import Link from "next/link";
import { SubmitConflictForm } from "@/components/submit/SubmitConflictForm";

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        ← Back to all conflicts
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Submit a conflict
      </h1>
      <p className="mt-2 mb-8 text-zinc-500">
        Know about a crisis that isn't covered here? Share it with the community.
        Add a title, a summary of what's happening, and at least one reliable source.
      </p>

      <SubmitConflictForm />
    </main>
  );
}
