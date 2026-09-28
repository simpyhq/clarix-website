import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1120px] px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-[13px] font-semibold text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
        {title}
      </h2>
      {lede ? <p className="mt-4 text-[17px] leading-relaxed text-muted">{lede}</p> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="border-b border-line">
      <Container className="py-16 sm:py-20">
        <p className="text-[13px] font-semibold text-accent">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-[2.4rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-muted">{lede}</p>
      </Container>
    </header>
  );
}

export function SamplePill() {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-paper px-2.5 py-1 text-[12px] font-semibold tracking-normal text-muted">
      Sample data
    </span>
  );
}
