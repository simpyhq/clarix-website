import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHero } from "@/components/marketing/Frame";
import {
  SnippetAp,
  SnippetAr,
  SnippetAsk,
  SnippetBrief,
  SnippetCategorize,
  SnippetClose,
} from "@/components/marketing/Snippets";
import { capabilities } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { btnPrimary } from "@/lib/ui";

export const metadata: Metadata = pageMeta({
  title: "Cash Desk",
  description:
    "What Clarix Cash Desk does with QuickBooks Online: categorization, reconciliation, invoice follow-ups, bills, a cash brief, month-end, and questions about your books.",
  path: "/cash-desk",
});

const snippets = {
  categorize: SnippetCategorize,
  ar: SnippetAr,
  ap: SnippetAp,
  brief: SnippetBrief,
  close: SnippetClose,
  ask: SnippetAsk,
} as const;

export default function CashDeskPage() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="An AI finance desk that stays inside QuickBooks Online."
        lede="Cash Desk categorizes, watches invoices and bills, and writes the morning brief. It does not replace your accountant, and it does not change the file until a person says so."
      />
      <Container className="divide-y divide-line py-4">
        {capabilities.map((item) => {
          const Snippet = snippets[item.id];
          return (
            <article key={item.id} className="grid gap-6 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
              <div>
                <h2 className="text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">{item.title}</h2>
                <p className="mt-4 text-[17px] leading-relaxed text-muted">{item.detail}</p>
              </div>
              <Snippet />
            </article>
          );
        })}
      </Container>
      {/* TODO(owner): describe the 13-week method precisely once it is settled. The page currently says it is built from what is already in QuickBooks. */}
      <section className="border-t border-line bg-surface">
        <Container className="py-16">
          <h2 className="text-[1.7rem] font-semibold tracking-[-0.03em] text-ink">What it will not do</h2>
          <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-muted">
            <li>It will not email a customer or pay a vendor without approval.</li>
            <li>It will not file a tax return or give tax advice.</li>
            <li>It will not ask for your QuickBooks password or your bank password.</li>
          </ul>
          <Link href="/demo" className={`${btnPrimary} mt-8`}>
            Book a demo
          </Link>
        </Container>
      </section>
    </>
  );
}
