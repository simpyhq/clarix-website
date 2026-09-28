import type { Metadata } from "next";
import { Container, PageHero } from "@/components/marketing/Frame";
import { supportEmail } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Terms (draft)",
  description:
    "Draft terms for Clarix Cash Desk. Not a final EULA. Counsel must review it before a QuickBooks app listing.",
  path: "/terms",
});

const sections = [
  {
    title: "The agreement",
    body: "Counsel should name the legal entity, who the customer is, and how someone accepts these terms. This draft is not an agreement.",
  },
  {
    title: "The service",
    body: "Describe Cash Desk as an assistant for QuickBooks Online books: categorization proposals, invoice follow-ups, bill reminders, a cash brief, and questions about the file. State that a person approves changes before they are written.",
  },
  {
    title: "Not tax, legal, or audit advice",
    body: "State that Cash Desk does not prepare or file tax returns, does not provide legal advice, and does not replace a CPA, bookkeeper, or auditor.",
  },
  {
    title: "Customer responsibilities",
    body: "Cover accurate books, authority to connect a QuickBooks file, review of suggestions, and keeping Intuit credentials private. Clarix does not ask for those passwords.",
  },
  {
    title: "Fees",
    body: "Setup is published from $2,500. Monthly fees are not published. Counsel should describe invoicing, taxes, and what happens if a plan changes, once the commercial terms exist.",
  },
  {
    title: "QuickBooks and Intuit",
    body: "State that QuickBooks Online is a third-party service, that Intuit’s terms also apply, and that Clarix is not endorsed by Intuit. Do not imply a partnership that does not exist.",
  },
  {
    title: "Data and disconnect",
    body: "Point to the privacy policy. Explain how the customer disconnects the QuickBooks app and what happens to data after disconnect. Retention is not confirmed yet.",
  },
  {
    title: "Disclaimers, liability, and law",
    body: `Counsel should add warranty disclaimers, a liability cap, indemnity if any, and the governing law. None of that is written here. Questions: ${supportEmail}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Draft"
        title="Terms of use"
        lede="This is a scaffold for an end-user agreement, not a finished EULA. Intuit requires public terms before a QuickBooks app can go to production. Do not submit this URL as final text."
      />
      <Container className="py-12">
        {/* TODO(owner/legal): replace this entire page with counsel’s terms or EULA. */}
        <div className="rounded-2xl border border-amber bg-amber-bg px-5 py-4 text-[15px] leading-relaxed text-ink">
          <p className="font-semibold">Draft for legal review</p>
          <p className="mt-1">
            Effective date: not set. The sections below are instructions for counsel, not binding terms.
          </p>
        </div>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-ink">{section.title}</h2>
              <p className="mt-2 max-w-3xl text-[16px] leading-relaxed text-muted">{section.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
