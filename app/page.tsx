import { getAllConflicts } from "@/lib/supabase/queries/conflicts";
import { ConflictGrid } from "@/components/cards/ConflictGrid";
import { SearchBar } from "@/components/search/SearchBar";
import { Navbar } from "@/components/layout/Navbar";

function Hero() {
  return (
    <div className="flex flex-col items-center px-6 pt-14 pb-12 text-center sm:pt-24 sm:pb-16">
      <h1 className="notranslate text-3xl font-light uppercase tracking-[0.2em] leading-tight sm:text-5xl sm:tracking-[0.3em]" translate="no">
        Raise ur voice
      </h1>
      <p className="notranslate mt-4 max-w-md text-sm uppercase tracking-[0.15em] text-neutral-500 leading-relaxed sm:text-xs sm:tracking-[0.2em]" translate="no">
        Global conflicts and human rights crises. Read. Discuss. Act.
      </p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-8 text-center text-xs uppercase tracking-[0.25em] text-neutral-400 sm:mb-10">
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
        <div className="mx-auto max-w-xl px-5 pb-12 sm:px-6 sm:pb-16">
          <SearchBar conflicts={conflicts} />
        </div>
        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-10 sm:pb-24">
          <SectionTitle>Active crises</SectionTitle>
          <ConflictGrid conflicts={conflicts} />
        </section>
      </main>
      <footer className="notranslate border-t border-neutral-200 py-8 text-center text-xs uppercase tracking-[0.2em] text-neutral-400 sm:py-10" translate="no">
        Raise ur voice
      </footer>
    </>
  );
}
