import Link from "next/link";
import { GoogleTranslate } from "@/components/translate/GoogleTranslate";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-10 sm:py-5">
      <Link href="/" className="text-xs font-medium uppercase tracking-[0.25em]">
        Raise ur voice
      </Link>
      <div className="flex items-center gap-5">
        <Link
          href="/submit"
          className="text-xs uppercase tracking-[0.15em] underline underline-offset-4 transition-opacity hover:opacity-60"
        >
          Submit
        </Link>
        <GoogleTranslate />
      </div>
    </nav>
  );
}
