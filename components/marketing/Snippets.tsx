import type { ReactNode } from "react";
import { SamplePill } from "@/components/marketing/Frame";

function Shell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-5 rounded-xl border border-line bg-paper p-3.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[12px] font-semibold text-muted">{title}</p>
        <SamplePill />
      </div>
      {children}
    </div>
  );
}

export function SnippetCategorize() {
  return (
    <Shell title="Review queue">
      <div className="flex items-center justify-between gap-3 text-[14px]">
        <span className="text-ink">Adobe · Sep 26</span>
        <span className="font-mono tabular-nums text-ink">$59.99</span>
      </div>
      <p className="mt-2 text-[13px] font-semibold text-accent-ink">Proposed: Software</p>
    </Shell>
  );
}

export function SnippetAr() {
  return (
    <Shell title="Draft follow-up">
      <p className="text-[14px] font-medium text-ink">Sample Customer A · 21 days</p>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">
        “Invoice 1044 for $9,200.00 is still open. Sending a reminder today.”
      </p>
      <p className="mt-2 text-[13px] font-semibold text-amber">Waiting for your approval</p>
    </Shell>
  );
}

export function SnippetAp() {
  return (
    <Shell title="Due this week">
      <div className="flex items-center justify-between gap-3 text-[14px]">
        <span className="text-ink">Rent</span>
        <span className="font-mono tabular-nums text-ink">$4,800.00</span>
      </div>
      <p className="mt-2 text-[13px] text-muted">Friday · not paid automatically</p>
    </Shell>
  );
}

export function SnippetBrief() {
  return (
    <Shell title="13-week view">
      <svg viewBox="0 0 220 48" className="h-12 w-full" aria-hidden="true">
        {[18, 22, 16, 28, 24, 20, 26, 19, 23, 17, 21, 15, 18].map((h, i) => (
          <rect
            key={i}
            x={i * 17}
            y={44 - h}
            width="10"
            height={h}
            rx="2"
            fill={i === 12 ? "#0B7F58" : "#D5D8DE"}
          />
        ))}
      </svg>
      <p className="mt-2 text-[13px] text-muted">Built from open invoices and bills. Not a guarantee.</p>
    </Shell>
  );
}

export function SnippetClose() {
  const items = [
    ["Bank feed categorized", true],
    ["Operating account reconciled", true],
    ["Two lines still need review", false],
  ] as const;
  return (
    <Shell title="September close">
      <ul className="space-y-2">
        {items.map(([label, done]) => (
          <li key={label} className="flex items-start gap-2 text-[14px]">
            <span
              aria-hidden="true"
              className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${
                done ? "border-accent-ink bg-accent-ink text-white" : "border-line bg-surface"
              }`}
            >
              {done ? (
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                  <path d="M2.5 6.2 4.8 8.5 9.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              ) : null}
            </span>
            <span className={done ? "text-ink" : "text-amber"}>{label}</span>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

export function SnippetAsk() {
  return (
    <Shell title="Ask your books">
      <p className="text-[14px] font-medium text-ink">What did we pay for software last month?</p>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">
        Four charges, $486.12, all in Software. Sample answer, not a live file.
      </p>
    </Shell>
  );
}
