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
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-300">No image</span>
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
        <h2 className="text-xs uppercase tracking-[0.15em]">
          {conflict.title}
        </h2>
        <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-400">
          {conflict.country} · {conflict.region}
          {conflict.startedAt ? ` · Since ${conflict.startedAt}` : ""}
        </p>
        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-neutral-500">
          {conflict.summary}
        </p>
        <div className="mt-3 flex gap-6 text-[10px] uppercase tracking-[0.1em] text-neutral-400">
          <span>{formatNumber(conflict.fatalities)} killed</span>
          <span>{formatNumber(conflict.displaced)} displaced</span>
        </div>
      </div>
    </Link>
  );
}
