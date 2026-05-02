"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)" }}>

      {/* HERO */}
      <section className="px-6 sm:px-8 pt-28 pb-16 max-w-3xl mx-auto">
        <p
          className="animate-fade-in"
          style={{
            color: "var(--gold)",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          About
        </p>
        <h1
          className="animate-fade-in-up delay-100 font-serif"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontStyle: "italic",
            lineHeight: 1.15,
            color: "var(--ink)",
          }}
        >
          We build intelligence for people<br />who move at a different pace.
        </h1>
      </section>

      {/* BODY */}
      <section className="px-6 sm:px-8 pb-20 max-w-2xl mx-auto">
        <Reveal>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", lineHeight: 1.8, marginBottom: "24px" }}>
            Clarix serves a small number of principals — executives, founders, and individuals who
            require a different standard of attention. We build private AI systems that know your world:
            your priorities, your relationships, your schedule, your work.
          </p>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", lineHeight: 1.8 }}>
            Every engagement begins with a private discovery process. We architect your system from
            the ground up, configure it to your channels and workflows, and maintain it as your life
            evolves. The result is not software. It is infrastructure.
          </p>
        </Reveal>
      </section>

      {/* DIVIDER */}
      <div
        className="mx-auto"
        style={{
          maxWidth: "600px",
          height: "1px",
          background: "var(--gold)",
          opacity: 0.18,
          margin: "0 24px 48px",
        }}
      />

      {/* CLOSING */}
      <section className="px-6 sm:px-8 py-20 max-w-2xl mx-auto text-center">
        <Reveal delay={100}>
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
              fontStyle: "italic",
              color: "var(--ink)",
              marginBottom: "32px",
              lineHeight: 1.4,
            }}
          >
            Engagements are accepted by referral or direct inquiry.
          </p>
          <Link
            href="/intake"
            style={{
              border: "1px solid var(--gold-soft)",
              color: "var(--gold)",
              background: "transparent",
              padding: "12px 28px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              display: "inline-block",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "var(--gold)";
              el.style.color = "var(--bg)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "transparent";
              el.style.color = "var(--gold)";
            }}
          >
            Request Access →
          </Link>
        </Reveal>
      </section>

    </div>
  );
}
