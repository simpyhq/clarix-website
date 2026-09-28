import { faqs } from "@/lib/content";

export default function FaqList({ items = faqs }: { items?: readonly { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-1 sm:px-6">
          <summary className="cursor-pointer list-none py-4 text-[16px] font-semibold tracking-[-0.01em] text-ink [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-4">
              {item.q}
              <span aria-hidden="true" className="mt-1 text-muted group-open:rotate-45">
                +
              </span>
            </span>
          </summary>
          <p className="pb-5 text-[16px] leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
