import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHero } from "@/components/marketing/Frame";
import FaqList from "@/components/marketing/FaqList";
import { faqs, setupIncludes } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { btnPrimary, btnSecondary } from "@/lib/ui";

export const metadata: Metadata = pageMeta({
  title: "Pricing",
  description:
    "Clarix Cash Desk setup starts at $2,500. See what setup includes. Monthly plans are not published yet.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Setup from $2,500."
        lede="One published number: setup starts at $2,500. Monthly plans are not on this page until they are final. We will tell you the monthly figure on the demo before you commit."
      />
      <Container className="grid gap-6 py-14 lg:grid-cols-2">
        <article className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <p className="text-[13px] font-semibold text-accent-ink">Setup</p>
          <p className="mt-3 font-mono text-[2.4rem] font-medium tabular-nums tracking-[-0.04em] text-ink">
            $2,500
          </p>
          <p className="mt-1 text-[15px] text-muted">Starting price. Not a monthly fee.</p>
          <ul className="mt-6 space-y-3">
            {setupIncludes.map((item) => (
              <li key={item} className="text-[15px] leading-relaxed text-ink">
                {item}
              </li>
            ))}
          </ul>
          <Link href="/demo" className={`${btnPrimary} mt-8`}>
            Book a demo
          </Link>
        </article>

        {/* TODO(owner): replace this card with real monthly tiers, prices, and what each tier includes. */}
        <article className="rounded-2xl border border-dashed border-accent/40 bg-paper p-6 sm:p-8">
          <p className="text-[13px] font-semibold text-accent-ink">Placeholder</p>
          <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">Monthly plans</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-muted">
            Coming soon. There is no monthly price to publish yet. Leave your details and we will follow up when the plans are set, or talk it through on a demo.
          </p>
          <Link href="/demo?topic=monthly" className={`${btnSecondary} mt-8`}>
            Ask about monthly plans
          </Link>
        </article>
      </Container>

      {/* TODO(owner): multi-entity and accountant offer, if it should be priced separately. */}
      <section className="border-t border-line">
        <Container className="py-12">
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-ink">
            More than one company, or you keep books for clients
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
            Talk to us. Multi-entity and accountant pricing is not published yet.
          </p>
        </Container>
      </section>

      <section className="border-t border-line bg-surface">
        <Container className="py-14">
          <h2 className="text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">Pricing questions</h2>
          <div className="mt-6">
            <FaqList items={faqs.filter((item) => item.q.includes("cost") || item.q.includes("CPA") || item.q.includes("approval"))} />
          </div>
        </Container>
      </section>
    </>
  );
}
