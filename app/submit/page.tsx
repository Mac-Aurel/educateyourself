import { Suspense } from "react";
import { SubmitConflictForm } from "@/components/submit/SubmitConflictForm";
import { AuthGate } from "@/components/submit/AuthGate";
import { Navbar } from "@/components/layout/Navbar";

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
