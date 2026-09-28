import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHero } from "@/components/marketing/Frame";
import { founders, supportEmail } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { btnPrimary } from "@/lib/ui";

export const metadata: Metadata = pageMeta({
  title: "About",
  description:
    "ClarixHQ builds Cash Desk, an AI finance desk for small businesses on QuickBooks Online. Meet the founders and get in touch.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A finance desk for companies that live in QuickBooks."
        lede="ClarixHQ builds Clarix Cash Desk so owner-operators and the people who keep their books can see cash clearly, without waiting for month-end to find out what happened."
      />
      <Container className="py-14">
        <div className="max-w-2xl space-y-4 text-[17px] leading-relaxed text-muted">
          <p>
            The books stay in QuickBooks Online. Cash Desk categorizes, watches invoices and bills, and writes a morning brief a person can read in a few minutes. Changes to the file wait for approval.
          </p>
          <p>
            We are a small team. We would rather publish one true sentence than a pile of claims we cannot stand behind.
          </p>
        </div>

        <h2 className="mt-14 text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">Founders</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {founders.map((founder) => (
            <article key={founder.name} className="rounded-2xl border border-line bg-surface p-5">
              {/* TODO(owner): founder photo */}
              <div className="grid h-28 w-28 place-items-center rounded-2xl border border-dashed border-[#C5CAD3] bg-paper text-center text-[13px] font-semibold text-muted">
                Photo not added
              </div>
              <h3 className="mt-4 text-[1.2rem] font-semibold text-ink">{founder.name}</h3>
              <p className="text-[14px] text-muted">{founder.role}</p>
              {/* TODO(owner): founder bio, including relevant finance or operations background. Do not invent one. */}
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Bio not written yet. Add a short, factual background before launch.
              </p>
            </article>
          ))}
        </div>

        <h2 className="mt-14 text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">Contact</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          Email{" "}
          <a className="font-semibold text-accent-ink underline underline-offset-4" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
          . For a demo, use the short form.
        </p>
        <Link href="/demo" className={`${btnPrimary} mt-6`}>
          Book a demo
        </Link>
      </Container>
    </>
  );
}
