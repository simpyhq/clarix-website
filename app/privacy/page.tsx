import type { Metadata } from "next";
import { Container, PageHero } from "@/components/marketing/Frame";
import { supportEmail } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy (draft)",
  description:
    "Draft privacy policy for Clarix. Not final legal text. Counsel must review it before a QuickBooks app listing.",
  path: "/privacy",
});

const sections = [
  {
    title: "Who this draft is for",
    body: "Counsel should name the legal entity that operates ClarixHQ, its address, and the contact for privacy requests. None of that is final here.",
  },
  {
    title: "Information the demo form collects",
    body: "The public form asks for name, work email, company, role, whether the company uses QuickBooks Online, a monthly transaction range, and optional notes. Counsel should say why each field is collected, the lawful basis if one is required, and how long submissions are kept.",
  },
  {
    title: "QuickBooks data",
    body: "If a customer connects QuickBooks Online, counsel should list the categories of financial data that can be read, whether any of it is written back, and that the connection uses Intuit OAuth rather than a stored password. Do not invent categories.",
  },
  {
    title: "How information is used",
    body: "Describe responding to demo requests, providing Cash Desk, and any other use. Say clearly if information is not sold. Do not claim a training-data position until it is confirmed on the security page.",
  },
  {
    title: "Service providers",
    body: "Name each vendor that processes personal or financial data, what they do, and where they operate. This website is hosted on Vercel. The rest of the list is not confirmed.",
  },
  {
    title: "Retention and deletion",
    body: "State how long form submissions, tokens, and book data are kept, and how a customer asks for deletion. No period is set in this draft.",
  },
  {
    title: "Choices and contact",
    body: `Tell people how to disconnect QuickBooks, how to access or correct their information, and how to reach ${supportEmail}. Add any region-specific rights counsel decides apply.`,
  },
  {
    title: "Changes",
    body: "Say how policy updates will be posted and dated. This draft has no effective date.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Draft"
        title="Privacy Policy"
        lede="This is a scaffold for legal review, not a finished policy. Intuit requires a public privacy policy before a QuickBooks app can go to production. Do not submit this URL as final text."
      />
      <Container className="py-12">
        {/* TODO(owner/legal): replace this entire page with counsel’s privacy policy, then remove the draft banner and the noindex decision if you add one. */}
        <div className="rounded-2xl border border-amber bg-amber-bg px-5 py-4 text-[15px] leading-relaxed text-ink">
          <p className="font-semibold">Draft for legal review</p>
          <p className="mt-1">
            Effective date: not set. The paragraphs below tell counsel what to write. They are not the policy.
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
