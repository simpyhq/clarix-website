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

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)" }}>

      {/* HERO */}
      <section className="text-center px-6 sm:px-8 py-40 md:py-48 max-w-4xl mx-auto">
        <p
          className="animate-fade-in"
          style={{
            color: "var(--gold)",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}
        >
          By Invitation
        </p>

        <h1
          className="animate-fade-in-up delay-100 font-serif"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontStyle: "italic",
            lineHeight: 1.1,
            marginBottom: "28px",
            color: "var(--ink)",
          }}
        >
          Your world. An intelligence<br />built around it.
        </h1>

        <p
          className="animate-fade-in-up delay-200 mx-auto"
          style={{
            color: "var(--ink-2)",
            fontSize: "16px",
            lineHeight: 1.7,
            maxWidth: "480px",
            marginBottom: "40px",
          }}
        >
          Clarix builds private AI systems for individuals who value
          discretion, capability, and time.
        </p>

        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
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
              transition: "all 0.15s ease",
              display: "inline-block",
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
            Request Access
          </Link>
          <Link
            href="/about"
            style={{
              color: "var(--ink-3)",
              fontSize: "14px",
              padding: "12px 28px",
              display: "inline-block",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-3)"; }}
          >
            Learn More
          </Link>
        </div>

        {/* Thin gold rule */}
        <div
          className="mx-auto"
          style={{
            maxWidth: "200px",
            height: "1px",
            background: "rgba(201,168,76,0.15)",
          }}
        />
      </section>

      {/* THREE PILLARS */}
      <section className="px-6 sm:px-8 pb-28 max-w-5xl mx-auto">
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Private by Design",
              body: "Runs on dedicated hardware you own. No shared infrastructure. No third-party access.",
            },
            {
              title: "Built Around You",
              body: "Deep knowledge of your schedule, priorities, and relationships. Built through a private onboarding.",
            },
            {
              title: "Proactive Intelligence",
              body: "Monitors, surfaces, and acts. You are informed before you need to ask.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="hover-card"
              style={{
                background: "var(--bg-2)",
                borderTop: "2px solid var(--gold)",
                borderLeft: "1px solid var(--border)",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "32px 28px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--gold)",
                  margin: "0 auto 20px",
                }}
              />
              <h3
                className="font-serif"
                style={{
                  fontSize: "18px",
                  color: "var(--ink)",
                  marginBottom: "14px",
                  fontWeight: 500,
                }}
              >
                {card.title}
              </h3>
              <p style={{ color: "var(--ink-2)", fontSize: "14px", lineHeight: 1.7 }}>
                {card.body}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* PULL QUOTE */}
      <section className="px-6 sm:px-8 py-24 max-w-3xl mx-auto text-center">
        <Reveal>
          <div
            style={{
              height: "1px",
              background: "var(--gold)",
              opacity: 0.25,
              marginBottom: "40px",
            }}
          />
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.4rem)",
              fontStyle: "italic",
              color: "var(--ink)",
              lineHeight: 1.3,
            }}
          >
            Not a chatbot. Not a subscription. A system.
          </p>
          <div
            style={{
              height: "1px",
              background: "var(--gold)",
              opacity: 0.25,
              marginTop: "40px",
            }}
          />
        </Reveal>
      </section>

      {/* ACCESS SECTION */}
      <section className="px-6 sm:px-8 py-28 max-w-2xl mx-auto text-center">
        <Reveal>
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
