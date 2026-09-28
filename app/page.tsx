import Link from "next/link";
import {
  Bell,
  BookOpenCheck,
  LineChart,
  ListChecks,
  MessageSquareText,
  Receipt,
} from "lucide-react";
import { Container, SamplePill, SectionHeading } from "@/components/marketing/Frame";
import ProductVisual from "@/components/marketing/ProductVisual";
import FaqList from "@/components/marketing/FaqList";
import {
  SnippetAp,
  SnippetAr,
  SnippetAsk,
  SnippetBrief,
  SnippetCategorize,
  SnippetClose,
} from "@/components/marketing/Snippets";
import { capabilities, faqs, homeDescription, problems, setupIncludes, steps } from "@/lib/content";
import { siteUrl } from "@/lib/seo";
import { btnOnDark, btnPrimary, btnSecondary } from "@/lib/ui";

const snippetFor = {
  categorize: SnippetCategorize,
  ar: SnippetAr,
  ap: SnippetAp,
  brief: SnippetBrief,
  close: SnippetClose,
  ask: SnippetAsk,
} as const;

const iconFor = {
  categorize: BookOpenCheck,
  ar: Receipt,
  ap: Bell,
  brief: LineChart,
  close: ListChecks,
  ask: MessageSquareText,
} as const;

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Clarix Cash Desk",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: homeDescription,
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "2500",
    priceCurrency: "USD",
    description: "Setup starting at $2,500. Monthly fees are not published.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="border-b border-line">
        <Container className="grid items-center gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:py-20">
          <div className="max-w-xl">
            <p className="text-[13px] font-semibold text-accent-ink">Clarix Cash Desk</p>
            <h1 className="mt-3 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-6xl">
              Your books, handled.
              <span className="mt-1 block">Your cash, clear.</span>
            </h1>
            <p className="mt-5 text-[18px] leading-relaxed text-muted">
              Clarix Cash Desk is an AI finance desk for small businesses on QuickBooks Online. It categorizes transactions, follows up on invoices, and sends a plain-English cash brief. A person approves changes before they are written to your books.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/demo" className={btnPrimary}>
                Book a demo
              </Link>
              <Link href="#sample" className={btnSecondary}>
                See a sample cash brief
              </Link>
            </div>
            <p className="mt-5 text-[14px] leading-relaxed text-muted">
              Connects to QuickBooks Online. About a 20-minute call.
              {/* TODO(owner): confirm the demo is 20 minutes. */}
              {/* TODO(owner: add once app is listed) Official Intuit QuickBooks badge goes here, and only after the app is listed. */}
            </p>
          </div>
          <ProductVisual />
        </Container>
      </section>

      {/* TODO(owner): replace this strip with real customer logos (with permission) and 2–3 metrics from actual engagements. Do not invent numbers. */}
      <section className="border-b border-line bg-surface" aria-label="Proof placeholder">
        <Container className="py-12 sm:py-14">
          <SectionHeading
            eyebrow="Proof"
            title="Numbers and logos, when they are real."
            lede="Nothing in this strip is a claim. Customer logos and measured results will be added only with permission."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Customer logo", "Customer logo", "Measured result"].map((label, index) => (
              <div
                key={`${label}-${index}`}
                className="rounded-2xl border border-dashed border-[#C5CAD3] bg-paper px-4 py-5"
              >
                <p className="text-[13px] font-semibold text-accent-ink">Placeholder</p>
                <p className="mt-1 text-[15px] font-medium text-ink">{label}</p>
                <p className="mt-1 text-[14px] text-muted">Not published yet.</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <SectionHeading
            eyebrow="The work"
            title="Three places the books usually slip."
            lede="Cash Desk is built for owner-operators, finance leads, and the bookkeepers who support them."
          />
          {/* TODO(owner): confirm whether a revenue band (for example $1M–$25M) should be stated. */}
          <ol className="mt-10 grid gap-4 lg:grid-cols-3">
            {problems.map((item, index) => (
              <li key={item.pain} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <p className="font-mono text-[13px] tabular-nums text-muted">0{index + 1}</p>
                <h3 className="mt-3 text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">{item.pain}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.detail}</p>
                <p className="mt-4 border-t border-line pt-4 text-[15px] leading-relaxed text-ink">{item.outcome}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-line bg-surface">
        <Container className="py-16 sm:py-24">
          <SectionHeading
            eyebrow="What Cash Desk does"
            title="Six jobs, one desk."
            lede="Each one proposes. A person still approves anything that changes the file or goes to a customer."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-6">
            {capabilities.map((item, index) => {
              const Icon = iconFor[item.id];
              const Snippet = snippetFor[item.id];
              const span =
                index === 0 || index === 3 ? "md:col-span-4" : index >= 4 ? "md:col-span-3" : "md:col-span-2";
              return (
                <article
                  key={item.id}
                  className={`flex flex-col rounded-2xl border border-line bg-paper p-5 sm:p-6 ${span}`}
                >
                  <Icon aria-hidden="true" className="text-accent-ink" size={20} />
                  <h3 className="mt-4 text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.summary}</p>
                  <Snippet />
                </article>
              );
            })}
          </div>
          <p className="mt-6">
            <Link href="/cash-desk" className="text-[15px] font-semibold text-accent-ink underline decoration-accent-ink/30 underline-offset-4">
              Read the product detail
            </Link>
          </p>
        </Container>
      </section>

      <section id="how" className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <SectionHeading
            eyebrow="How it works"
            title="Connect, configure, approve, tune."
            lede="QuickBooks stays the system of record. Cash Desk works beside it."
          />
          {/* TODO(owner): publish a truthful setup timeline when you are ready to promise one. */}
          {/* TODO(owner): confirm the monthly tuning cadence. */}
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.n} className="rounded-2xl border border-line bg-surface p-5">
                <p className="font-mono text-[13px] tabular-nums text-accent-ink">{step.n}</p>
                <h3 className="mt-3 text-[1.15rem] font-semibold tracking-[-0.02em] text-ink">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="sample" className="border-b border-line bg-surface">
        <Container className="grid gap-10 py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:py-24">
          <SectionHeading
            eyebrow="Sample output"
            title="The morning note, in plain English."
            lede="This is a mock message so you can see the shape. Every figure below is invented."
          />
          <article className="rounded-2xl border border-line bg-paper p-5 shadow-card sm:p-7">
            <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
              <div>
                <p className="text-[13px] text-muted">From Cash Desk · to you</p>
                <h3 className="mt-1 text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">
                  Tuesday morning — cash brief
                </h3>
              </div>
              <SamplePill />
            </div>
            <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink">
              <p>Good morning.</p>
              <p>
                Cash on hand is <span className="font-mono tabular-nums">$128,440.18</span>.
              </p>
              <p>
                Three invoices are past due, totaling <span className="font-mono tabular-nums">$18,420.00</span>.
                The largest is Sample Customer A, <span className="font-mono tabular-nums">$9,200.00</span>, 21 days.
              </p>
              <p>
                Bills due in the next 7 days: <span className="font-mono tabular-nums">$6,150.00</span>. Rent is the largest, and nothing has been paid automatically.
              </p>
              <p>
                Overnight, 12 transactions were categorized. 2 are waiting for review: an ACH from “SQ *”, and check 4412 with no payee.
              </p>
              <p>Nothing was written to QuickBooks. Approve, edit, or skip each item.</p>
            </div>
            <p className="mt-5 text-[13px] text-muted">Sample Company · illustrative only · not a customer</p>
          </article>
        </Container>
      </section>

      <section className="bg-ink text-white">
        <Container className="grid gap-8 py-16 sm:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div>
            <p className="text-[13px] font-semibold text-[#8EE0C0]">Security</p>
            <h2 className="mt-3 text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[2.5rem]">
              Your password never comes to us.
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#D5DAE3]">
              QuickBooks Online connects through Intuit’s sign-in. Clarix stores a connection token, not your password. A person approves changes before they are written to the books. You can disconnect from inside QuickBooks.
            </p>
            <Link href="/security" className={`${btnOnDark} mt-8`}>
              Read how the connection works
            </Link>
          </div>
          <ul className="grid gap-3">
            {[
              "Intuit sign-in. No QuickBooks or bank password stored.",
              "A person approves writes to your file.",
              "Disconnect from QuickBooks at any time.",
            ].map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-[15px] leading-relaxed text-[#E6E8EC]">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* TODO(owner): one named customer story with permission — business type, before and after, quote, and photo. */}
      <section className="border-b border-line" aria-label="Customer story placeholder">
        <Container className="py-16 sm:py-24">
          <SectionHeading
            eyebrow="Customers"
            title="A real story will go here."
            lede="We will not publish a quote, a name, or a result until a customer has agreed to it."
          />
          <div className="mt-8 rounded-2xl border border-dashed border-[#C5CAD3] bg-surface px-5 py-6 sm:px-7">
            <p className="text-[13px] font-semibold text-accent-ink">Placeholder</p>
            <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-muted">
              Named customer, business type, what changed, a quote, and a photo. Empty on purpose.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-surface">
        <Container className="grid gap-8 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Pricing"
              title="Setup from $2,500."
              lede="Monthly plans are not published yet. We will price the monthly work on the demo, before you commit."
            />
            {/* TODO(owner): replace “monthly plans coming soon” with real tiers when they are final. */}
            <Link href="/pricing" className={`${btnSecondary} mt-8`}>
              See what setup includes
            </Link>
          </div>
          <ul className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            {setupIncludes.map((item) => (
              <li key={item} className="border-b border-line py-3 text-[15px] leading-relaxed text-ink last:border-b-0">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* TODO(owner): multi-entity and accountant pricing, if that channel should have its own offer. */}
      <section className="border-b border-line">
        <Container className="py-12 sm:py-16">
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-ink">
            Bookkeepers and multi-entity companies
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
            If you keep books for clients, or you have more than one company file, say so on the demo form. Pricing for that work is not published yet.
          </p>
        </Container>
      </section>

      <section id="faq" className="border-b border-line">
        <Container className="py-16 sm:py-24">
          <SectionHeading eyebrow="FAQ" title="Straight answers." />
          {/* TODO(owner): update the cost answer when monthly pricing is final. */}
          {/* TODO(owner-verify): exact QuickBooks disconnect path, if you want it more specific than “inside QuickBooks Online”. */}
          <div className="mt-8">
            <FaqList />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16 sm:py-24">
          <div className="max-w-2xl">
            <h2 className="text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.6rem]">
              See Cash Desk on your own books.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">
              Tell us who you are and whether you use QuickBooks Online. We reply within one business day.
            </p>
            {/* TODO(owner): confirm the one-business-day reply window. */}
            <Link href="/demo" className={`${btnPrimary} mt-8`}>
              Book a demo
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
