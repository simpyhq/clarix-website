import type { Metadata } from "next";
import { Container, PageHero } from "@/components/marketing/Frame";
import DemoForm from "@/components/marketing/DemoForm";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Book a demo",
  description:
    "Book a demo of Clarix Cash Desk. Tell us about your company and whether you use QuickBooks Online. We reply within one business day.",
  path: "/demo",
});

export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Demo"
        title="See Cash Desk on a short call."
        lede="Tell us who you are and whether QuickBooks Online is where the books live. We reply within one business day."
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:py-16">
        <div>
          <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-ink">What we will cover</h2>
          <ul className="mt-4 space-y-3 text-[16px] leading-relaxed text-muted">
            <li>How your books are closed today.</li>
            <li>Whether QuickBooks Online is the file of record.</li>
            <li>What setup includes, starting at $2,500.</li>
            <li>The monthly price we would propose. It is not published yet.</li>
          </ul>
          {/* TODO(owner: booking link) Embed the scheduling calendar here when a URL exists. CSP frame-src is currently 'none'; allow the scheduler’s domain before embedding. */}
          {/* TODO(owner): confirm the one-business-day reply window. */}
          <div className="mt-8 rounded-2xl border border-dashed border-accent/40 bg-surface px-5 py-5">
            <p className="text-[13px] font-semibold text-accent-ink">Placeholder</p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              A calendar booking link is not connected yet. Use the form and we will write back.
            </p>
          </div>
        </div>
        <DemoForm />
      </Container>
    </>
  );
}
