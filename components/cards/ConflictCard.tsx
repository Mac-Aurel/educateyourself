import Link from "next/link";
import Image from "next/image";
import { formatNumber } from "@/lib/utils/formatNumber";
import type { ConflictSummary } from "@/types/conflict";

type ConflictCardProps = {
  conflict: ConflictSummary;
};

function CardImage({ imageUrl, title }: { imageUrl: string | null; title: string }) {
  if (!imageUrl) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-neutral-100">
        <span className="text-xs uppercase tracking-[0.15em] text-neutral-300">No image</span>
      </div>
    );
  }
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}

export function ConflictCard({ conflict }: ConflictCardProps) {
  return (
    <Link
      href={`/conflicts/${conflict.slug}`}
      className="group flex flex-col"
    >
      <CardImage imageUrl={conflict.imageUrl} title={conflict.title} />
      <div className="mt-4 flex flex-col gap-1">
        <h2 className="text-sm font-medium uppercase tracking-[0.1em] sm:text-xs sm:tracking-[0.15em]">
          {conflict.title}
        </h2>
        <p className="text-xs uppercase tracking-[0.08em] text-neutral-500 sm:text-[11px] sm:tracking-[0.1em]">
          {conflict.country} · {conflict.region}
          {conflict.startedAt ? ` · Since ${conflict.startedAt}` : ""}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-500 sm:text-xs">
          {conflict.summary}
        </p>
        <div className="mt-3 flex gap-6 text-xs uppercase tracking-[0.08em] text-neutral-400 sm:text-[11px] sm:tracking-[0.1em]">
          <span>{formatNumber(conflict.fatalities)} killed</span>
          <span>{formatNumber(conflict.displaced)} displaced</span>
        </div>
      </div>
    </Link>
  );
}
