import { SamplePill } from "@/components/marketing/Frame";

const rows = [
  {
    date: "Sep 26",
    name: "Stripe payout",
    amount: "$4,280.00",
    category: "Sales income",
    delay: "delay-a",
  },
  {
    date: "Sep 26",
    name: "Adobe",
    amount: "$59.99",
    category: "Software",
    delay: "delay-b",
  },
];

function Money({ children, tone = "ink" }: { children: string; tone?: "ink" | "danger" }) {
  return (
    <span
      className={`font-mono text-[15px] font-medium tabular-nums ${
        tone === "danger" ? "text-danger" : "text-ink"
      }`}
    >
      {children}
    </span>
  );
}

export default function ProductVisual() {
  return (
    <figure className="min-w-0" aria-label="Illustrative Cash Desk screen. Not a real company.">
      <div className="rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-muted">Morning cash brief</p>
            <p className="text-[16px] font-semibold tracking-[-0.02em] text-ink">
              Tuesday · Sample Company
            </p>
          </div>
          <SamplePill />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <div className="rounded-xl bg-paper px-3.5 py-3">
            <p className="text-[13px] text-muted">Cash on hand</p>
            <p className="mt-1 font-mono text-[1.35rem] font-medium tabular-nums tracking-[-0.03em] text-ink">
              $128,440.18
            </p>
          </div>
          <div className="rounded-xl bg-paper px-3.5 py-3">
            <p className="text-[13px] text-muted">13-week coverage</p>
            <p className="mt-1 font-mono text-[1.35rem] font-medium tabular-nums tracking-[-0.03em] text-ink">
              11.4 weeks
            </p>
            <svg viewBox="0 0 120 28" className="mt-2 h-7 w-full" aria-hidden="true">
              <polyline
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                points="0,20 16,18 32,19 48,14 64,15 80,10 96,12 120,6"
              />
            </svg>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[13px] font-semibold text-ink">Overdue invoices</p>
          <ul className="mt-2 divide-y divide-line">
            <li className="flex items-baseline justify-between gap-3 py-2">
              <span className="min-w-0 text-[14px] text-ink">
                Sample Customer A
                <span className="mt-0.5 block text-[13px] text-danger">21 days overdue</span>
              </span>
              <Money tone="danger">$9,200.00</Money>
            </li>
            <li className="flex items-baseline justify-between gap-3 py-2">
              <span className="min-w-0 text-[14px] text-ink">
                Sample Customer B
                <span className="mt-0.5 block text-[13px] text-danger">9 days overdue</span>
              </span>
              <Money tone="danger">$4,180.00</Money>
            </li>
          </ul>
        </div>

        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-3 text-[13px]">
          <span className="text-muted">12 categorized overnight</span>
          <span className="font-semibold text-amber">2 need your review</span>
        </p>
      </div>

      <div className="ledger-live mt-3 rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-semibold text-ink">Ledger</p>
          <p className="text-[12px] text-muted">Illustrative</p>
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          Lines move from Uncategorized to a category. One stays for a person.
        </p>
        <ul className="mt-3 divide-y divide-line">
          {rows.map((row) => (
            <li key={row.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 py-3">
              <span className="font-mono text-[13px] tabular-nums text-muted">{row.date}</span>
              <span className="min-w-0 text-[14px] text-ink">{row.name}</span>
              <Money>{row.amount}</Money>
              <span className="col-span-3 grid sm:col-span-1 sm:col-start-2">
                <span
                  aria-hidden="true"
                  className={`row-uncat col-start-1 row-start-1 text-[13px] font-medium text-muted ${row.delay}`}
                >
                  Uncategorized
                </span>
                <span className={`row-cat col-start-1 row-start-1 text-[13px] font-semibold text-accent-ink ${row.delay}`}>
                  {row.category}
                </span>
              </span>
            </li>
          ))}
          <li className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 py-3">
            <span className="font-mono text-[13px] tabular-nums text-muted">Sep 25</span>
            <span className="min-w-0 text-[14px] text-ink">ACH · SQ *</span>
            <Money>$186.40</Money>
            <span className="col-span-3 text-[13px] font-semibold text-amber sm:col-span-1 sm:col-start-2">
              Needs review
            </span>
          </li>
        </ul>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-muted">
        Illustrative figures for a fictional company. Not a customer, and not your books.
      </figcaption>
    </figure>
  );
}
