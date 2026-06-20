import Link from "next/link";
import { SubmitConflictForm } from "@/components/submit/SubmitConflictForm";

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 sm:px-10">
      <Link href="/" className="text-xs uppercase tracking-[0.3em]">
        Raise ur voice
      </Link>
    </nav>
  );
}

export default function SubmitPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-center text-lg font-light uppercase tracking-[0.2em]">
          Submit a conflict
        </h1>
        <p className="mt-4 mb-12 text-center text-xs leading-relaxed text-neutral-400">
          Know about a crisis that is not covered here? Share it with the community.
          Add a title, a summary of what is happening, and at least one reliable source.
        </p>

        <SubmitConflictForm />
      </main>
    </>
  );
}
