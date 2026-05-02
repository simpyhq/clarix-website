"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

function Reveal({ children, delay = 0, className = "", stagger = false }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  stagger?: boolean;
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
    <div
      ref={ref}
      className={`${stagger ? "stagger" : "reveal"} ${className}`}
      style={!stagger ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)" }}>

      {/* HEADER */}
      <section className="px-6 sm:px-8 pt-28 pb-20 max-w-3xl mx-auto">
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
          Services
        </p>
        <h1
          className="animate-fade-in-up delay-100 font-serif"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "16px", color: "var(--ink)" }}
        >
          What we build.
        </h1>
        <p
          className="animate-fade-in-up delay-200"
          style={{ color: "var(--ink-2)", fontSize: "15px", lineHeight: 1.7 }}
        >
          Each system is bespoke. These are the domains we work within.
        </p>
      </section>

      {/* SERVICE CARDS — 2x2 GRID */}
      <section className="px-6 sm:px-8 pb-24 max-w-5xl mx-auto">
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Personal Intelligence System",
              body: "Your AI assistant, built around your life. It knows your schedule, your preferences, your priorities. It monitors, surfaces, and acts on your behalf.",
            },
            {
              title: "Calendar & Communications",
              body: "Proactive management of your time and inbox. Briefings before meetings. Drafts before you ask. Alerts before deadlines.",
            },
            {
              title: "Financial Monitoring",
              body: "Real-time awareness of markets, positions, and events relevant to you. Summarized, filtered, and surfaced at the right moment.",
            },
            {
              title: "Health & Research",
              body: "Ongoing monitoring of medical research, clinical developments, and information relevant to your health. Discretion guaranteed.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="hover-card"
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "32px 28px",
              }}
            >
              <h3
                className="font-serif"
                style={{
                  fontSize: "20px",
                  color: "var(--ink)",
                  marginBottom: "14px",
                  fontWeight: 500,
                }}
              >
                {card.title}
              </h3>
              <p style={{ color: "var(--ink-2)", fontSize: "14px", lineHeight: 1.75 }}>
                {card.body}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* BOTTOM CTA */}
      <section className="px-6 sm:px-8 py-24 max-w-2xl mx-auto text-center">
        <Reveal delay={100}>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "28px", lineHeight: 1.7 }}>
            Currently accepting inquiries for a limited number of engagements.
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
              marginBottom: "20px",
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
          <p style={{ color: "var(--ink-3)", fontSize: "12px" }}>
            All engagements begin with a private consultation.
          </p>
        </Reveal>
      </section>

    </div>
  );
}
