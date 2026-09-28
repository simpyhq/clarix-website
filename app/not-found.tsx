import Link from "next/link";
import { Container } from "@/components/marketing/Frame";
import { btnPrimary, btnSecondary } from "@/lib/ui";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-[13px] font-semibold text-accent-ink">404</p>
      <h1 className="mt-3 text-[2.4rem] font-semibold tracking-[-0.035em] text-ink">That page is not here.</h1>
      <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">
        The link may be old. Cash Desk lives on the homepage, and you can book a demo from there.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={btnPrimary}>
          Back home
        </Link>
        <Link href="/demo" className={btnSecondary}>
          Book a demo
        </Link>
      </div>
    </Container>
  );
}
