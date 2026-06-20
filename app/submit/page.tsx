import { Suspense } from "react";
import Link from "next/link";
import { SubmitConflictForm } from "@/components/submit/SubmitConflictForm";
import { AuthGate } from "@/components/submit/AuthGate";

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-10 sm:py-5">
      <Link href="/" className="text-xs font-medium uppercase tracking-[0.25em]">
        Raise ur voice
      </Link>
    </nav>
  );
}

export default function SubmitPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-5 py-12 sm:px-6 sm:py-16">
        <h1 className="text-center text-xl font-light uppercase tracking-[0.15em] sm:text-lg sm:tracking-[0.2em]">
          Submit a conflict
        </h1>
        <p className="mt-4 mb-10 text-center text-sm leading-relaxed text-neutral-400 sm:mb-12 sm:text-xs">
          Know about a crisis that is not covered here? Share it with the community.
          Add a title, a summary of what is happening, and at least one reliable source.
        </p>

        <Suspense>
          <AuthGate>
            <SubmitConflictForm />
          </AuthGate>
        </Suspense>
      </main>
    </>
  );
}
