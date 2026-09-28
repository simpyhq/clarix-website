import type { Metadata } from "next";
import { Container, PageHero } from "@/components/marketing/Frame";
import { pageMeta } from "@/lib/seo";
import { supportEmail } from "@/lib/content";

export const metadata: Metadata = pageMeta({
  title: "Security",
  description:
    "How Clarix connects to QuickBooks Online: Intuit sign-in, no stored passwords, and a person approving changes before they are written.",
  path: "/security",
});

const flow = [
  {
    title: "You approve access",
    body: "The sign-in screen is Intuit’s. Clarix does not collect your QuickBooks password or your bank password.",
  },
  {
    title: "Intuit issues a token",
    body: "The connection is OAuth. What we keep is an access token and a refresh token so you are not asked to sign in every day.",
  },
  {
    title: "Cash Desk prepares work",
    body: "Categories, follow-ups, and the morning brief are prepared from the QuickBooks file you connected.",
  },
  {
    title: "A person approves",
    body: "Changes are written to your books only after a person approves them. You can reject or edit a suggestion.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="How the QuickBooks connection works."
        lede="This page states how the connection is built today. Items we have not confirmed are labeled, and they should stay off any launch claim until they are checked."
      />

      <Container className="py-14 sm:py-16">
        <h2 className="text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">What is true today</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {flow.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-line bg-surface p-5">
              <p className="font-mono text-[13px] tabular-nums text-accent-ink">0{index + 1}</p>
              <h3 className="mt-2 text-[1.15rem] font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 max-w-3xl space-y-4 text-[16px] leading-relaxed text-muted">
          <p>
            The site you are reading is served over HTTPS and hosted on Vercel. Calls to Intuit’s OAuth endpoint use HTTPS.
          </p>
          <p>
            You can disconnect Clarix from QuickBooks Online, which revokes the connection. You can also email{" "}
            <a className="font-semibold text-accent-ink underline underline-offset-4" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>{" "}
            and ask us to stop.
          </p>
          <p>
            Certification reports and availability statistics are not published here. They are not established.
          </p>
        </div>

        <h2 className="mt-14 text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">Confirm before launch</h2>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-muted">
          The notes below are open questions, not promises. Do not treat them as current practice until they are checked.
        </p>
        <ul className="mt-6 grid gap-3">
          {/* TODO(owner-verify): accounting scope com.intuit.quickbooks.accounting is what the reconnect link in operations code requests. Confirm it is the only production scope before naming it publicly. */}
          <Confirm
            title="Scopes requested from Intuit"
            body="Confirm the exact OAuth scopes on the production Intuit app, and publish only that list. Do not assume the accounting scope is the only one."
          />
          {/* TODO(owner-verify): token storage vendor, region, encryption at rest, and who can read tokens. */}
          <Confirm
            title="How tokens are stored"
            body="Tokens are stored so the connection can refresh. Confirm the vendor, the region, whether they are encrypted at rest, and who can read them before describing storage in more detail."
          />
          {/* TODO(owner-verify): where customer financial data is processed and hosted, separate from this marketing site. */}
          <Confirm
            title="Where book data is processed"
            body="This website is on Vercel. Confirm where QuickBooks data is read, transformed, and stored, and in which region, before stating a hosting claim for customer financial data."
          />
          {/* TODO(owner-verify): retention period for tokens, prompts, briefs, and form submissions. */}
          <Confirm
            title="How long data is kept"
            body="Confirm retention for OAuth tokens, generated briefs, review history, and demo-form submissions. No retention period is stated yet."
          />
          {/* TODO(owner-verify): name every AI and infrastructure subprocessor, what they process, and the region. */}
          <Confirm
            title="Subprocessors"
            body="List every AI provider and infrastructure vendor that can see customer financial data, what they receive, and where they run. That list is not published yet."
          />
          {/* TODO(owner-verify): whether customer data is used to train models, by Clarix or by any provider. */}
          <Confirm
            title="Model training"
            body="Confirm whether customer data is used to train models, including by any AI provider. Do not claim “we never train on your data” until that is checked and written down."
          />
          {/* TODO(owner-verify): in-product disconnect control, and the exact QuickBooks menu path. */}
          <Confirm
            title="Disconnect steps"
            body="Confirm the exact clicks inside QuickBooks Online, and whether Cash Desk itself will have a disconnect button."
          />
          {/* TODO(owner-verify): incident contact and backup practices, if they should be public. */}
          <Confirm
            title="Incidents and backups"
            body="If you want a public incident contact or a backup statement, write it from the actual practice. Nothing is claimed here."
          />
        </ul>
      </Container>
    </>
  );
}

function Confirm({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-2xl border border-dashed border-accent/40 bg-surface px-5 py-4">
      <p className="text-[13px] font-semibold text-amber">Needs confirmation</p>
      <h3 className="mt-1 text-[16px] font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-[15px] leading-relaxed text-muted">{body}</p>
    </li>
  );
}
