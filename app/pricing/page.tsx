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

const goldDot = (
  <span
    style={{
      display: "inline-block",
      width: "5px",
      height: "5px",
      borderRadius: "50%",
      background: "var(--gold)",
      marginRight: "12px",
      flexShrink: 0,
      marginTop: "6px",
    }}
  />
);

function AccessButton() {
  return (
    <Link
      href="/intake"
      style={{
        border: "1px solid var(--gold-soft)",
        color: "var(--gold)",
        background: "transparent",
        padding: "11px 24px",
        borderRadius: "6px",
        fontSize: "13px",
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
  );
}

export default function PricingPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)" }}>

      {/* HEADER */}
      <section className="text-center px-6 sm:px-8 pt-28 pb-20 max-w-3xl mx-auto">
        <p
          style={{
            color: "var(--gold)",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          Pricing
        </p>
        <h1
          className="font-serif"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "20px", color: "var(--ink)" }}
        >
          Reserved for a select few.
        </h1>
        <p style={{ color: "var(--ink-2)", fontSize: "15px", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
          We accept a limited number of principals each quarter. Engagements begin with a private onboarding.
        </p>
      </section>

      {/* ONBOARDING FEE */}
      <section className="px-6 sm:px-8 pb-16 max-w-2xl mx-auto">
        <Reveal>
          <div
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--gold-border)",
              borderRadius: "8px",
              padding: "40px 36px",
            }}
          >
            <p
              style={{
                color: "var(--gold)",
                fontSize: "10px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Onboarding
            </p>

            <div style={{ marginBottom: "8px" }}>
              <span
                className="font-serif"
                style={{ fontSize: "2.8rem", color: "var(--ink)", lineHeight: 1 }}
              >
                $5,000
              </span>
              <span style={{ color: "var(--ink-3)", fontSize: "13px", marginLeft: "10px" }}>
                one-time
              </span>
            </div>

            <p style={{ color: "var(--ink-2)", fontSize: "14px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "480px" }}>
              A dedicated engagement to build your system from the ground up. Includes discovery,
              hardware configuration, knowledge architecture, integrations, and 2 months of retained support.
            </p>

            <ul style={{ listStyle: "none", padding: 0, marginBottom: "32px" }}>
              {[
                "Private discovery consultation (2–4 hours)",
                "Dedicated Mac mini M4 — configured and shipped",
                "Full software installation and system setup",
                "Custom knowledge base from your onboarding",
                "Channel integrations (WhatsApp, iMessage, email, and more)",
                "Automated workflows and scheduled intelligence",
                "2 months of Principals support included",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    color: "var(--ink-2)",
                    fontSize: "14px",
                    marginBottom: "12px",
                    lineHeight: 1.5,
                  }}
                >
                  {goldDot}
                  {item}
                </li>
              ))}
            </ul>

            <AccessButton />
          </div>
        </Reveal>
      </section>

      {/* RETAINER PLANS */}
      <section className="px-6 sm:px-8 pb-16 max-w-3xl mx-auto">
        <Reveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Retained */}
            <div
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  color: "var(--gold)",
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Retained
              </p>
              <div style={{ marginBottom: "8px" }}>
                <span className="font-serif" style={{ fontSize: "2.2rem", color: "var(--ink)" }}>$250</span>
                <span style={{ color: "var(--ink-3)", fontSize: "13px", marginLeft: "8px" }}>/mo</span>
              </div>
              <p style={{ color: "var(--ink-2)", fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>
                Active maintenance and reliability monitoring.
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px", flexGrow: 1 }}>
                {[
                  "24/7 keep-alive monitoring",
                  "Monthly model and software updates",
                  "Security maintenance",
                  "Email support",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      color: "var(--ink-2)",
                      fontSize: "13px",
                      marginBottom: "10px",
                    }}
                  >
                    {goldDot}
                    {item}
                  </li>
                ))}
              </ul>
              <AccessButton />
            </div>

            {/* Principals — elevated */}
            <div
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--gold-border)",
                borderRadius: "8px",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 0 40px rgba(201,168,76,0.05)",
              }}
            >
              <p
                style={{
                  color: "var(--gold)",
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Principals
              </p>
              <div style={{ marginBottom: "8px" }}>
                <span className="font-serif" style={{ fontSize: "2.2rem", color: "var(--ink)" }}>$500</span>
                <span style={{ color: "var(--ink-3)", fontSize: "13px", marginLeft: "8px" }}>/mo</span>
              </div>
              <p style={{ color: "var(--ink-2)", fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>
                Ongoing optimization and a dedicated relationship.
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px", flexGrow: 1 }}>
                {[
                  "Everything in Retained",
                  "Workflow optimization and tuning",
                  "New capabilities and integrations",
                  "2 hrs dedicated support/month",
                  "Priority response within 24 hours",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      color: "var(--ink-2)",
                      fontSize: "13px",
                      marginBottom: "10px",
                    }}
                  >
                    {goldDot}
                    {item}
                  </li>
                ))}
              </ul>
              <AccessButton />
            </div>
          </div>
        </Reveal>
      </section>

      {/* BESPOKE */}
      <section className="px-6 sm:px-8 py-16 text-center max-w-xl mx-auto">
        <Reveal delay={150}>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "10px" }}>
            Bespoke engagements available by arrangement.
          </p>
          <p style={{ color: "var(--ink-3)", fontSize: "13px" }}>
            Questions answered privately.{" "}
            <a
              href="mailto:jarvis@simpyhq.com"
              style={{ color: "var(--gold)", textDecoration: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}
            >
              jarvis@simpyhq.com
            </a>
          </p>
        </Reveal>
      </section>

    </div>
  );
}
