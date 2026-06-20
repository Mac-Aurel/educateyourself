import Link from "next/link";
import { getAllConflicts } from "@/lib/supabase/queries/conflicts";
import { ConflictGrid } from "@/components/cards/ConflictGrid";
import { SearchBar } from "@/components/search/SearchBar";

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 sm:px-10">
      <Link href="/" className="text-xs uppercase tracking-[0.3em]">
        Raise ur voice
      </Link>
      <Link
        href="/submit"
        className="text-xs uppercase tracking-[0.2em] underline underline-offset-4 transition-opacity hover:opacity-60"
      >
        Submit
      </Link>
    </nav>
  );
}

function Hero() {
  return (
    <div className="flex flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
      <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light uppercase tracking-[0.3em] leading-tight">
        Raise ur voice
      </h1>
      <p className="mt-4 max-w-md text-xs uppercase tracking-[0.2em] text-neutral-500 leading-relaxed">
        Global conflicts and human rights crises. Read. Discuss. Act.
      </p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-10 text-center text-[10px] uppercase tracking-[0.35em] text-neutral-400">
      {children}
    </h2>
  );
}

export default async function HomePage() {
  const conflicts = await getAllConflicts();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="mx-auto max-w-xl px-6 pb-16">
          <SearchBar conflicts={conflicts} />
        </div>
        <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10">
          <SectionTitle>Active crises</SectionTitle>
          <ConflictGrid conflicts={conflicts} />
        </section>
      </main>
      <footer className="border-t border-neutral-200 py-10 text-center text-[10px] uppercase tracking-[0.3em] text-neutral-400">
        Raise ur voice
      </footer>
    </>
  );
}
