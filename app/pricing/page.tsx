"use client";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const onboardingIncludes = [
  "Private discovery consultation (2–4 hours)",
  "Dedicated Mac mini M4 — configured and shipped to you",
  "Full software installation and system setup",
  "Custom knowledge base built from your onboarding",
  "Channel integrations (WhatsApp, iMessage, email, and more)",
  "Automated workflows and scheduled intelligence",
  "2 months of Principals support included",
];

const plans = [
  {
    name: "RETAINED",
    price: "$250",
    tagline: "Active maintenance and reliability monitoring.",
    featured: false,
    items: [
      "24/7 keep-alive monitoring",
      "Monthly model and software updates",
      "Security maintenance",
      "Email support",
    ],
  },
  {
    name: "PRINCIPALS",
    price: "$500",
    tagline: "Ongoing optimization and a dedicated relationship.",
    featured: true,
    items: [
      "Everything in Retained",
      "Workflow optimization and tuning",
      "New capabilities and integrations",
      "2 hrs dedicated support / month",
      "Priority response within 24 hours",
    ],
  },
];

export default function PricingPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)" }}>

      {/* ── HEADER ── */}
      <section className="px-6 sm:px-8 pt-24 pb-20 max-w-4xl mx-auto">
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "24px" }}>Pricing</p>
          <h1
            className="font-serif"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: "20px",
              color: "var(--ink)",
            }}
          >
            Reserved for a select few.
          </h1>
          <p style={{ color: "var(--ink-2)", fontSize: "16px", lineHeight: 1.75, maxWidth: "520px" }}>
            We accept a limited number of principals each quarter. Every engagement begins with a private onboarding.
          </p>
        </Reveal>
      </section>

      {/* ── ONBOARDING CARD ── */}
      <section className="px-6 sm:px-8 pb-16 max-w-4xl mx-auto">
        <Reveal>
          <div
            className="hover-card"
            style={{
              border: "1px solid var(--gold-border)",
              borderTop: "1px solid rgba(201,168,76,0.45)",
              background: "var(--bg-2)",
              borderRadius: "10px",
              padding: "48px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle corner glow */}
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle at top right, rgba(201,168,76,0.05) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="eyebrow" style={{ marginBottom: "20px" }}>Onboarding</p>
                <div style={{ marginBottom: "16px" }}>
                  <span
                    className="font-serif"
                    style={{ fontSize: "64px", color: "var(--ink)", fontWeight: 400, lineHeight: 1 }}
                  >
                    $5,000
                  </span>
                  <span style={{ color: "var(--ink-3)", fontSize: "14px", marginLeft: "10px" }}>one-time</span>
                </div>
                <p style={{ color: "var(--ink-2)", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px", maxWidth: "360px" }}>
                  A dedicated engagement to build your system from the ground up — discovery, hardware, knowledge architecture, integrations, and ongoing support.
                </p>
                <Link href="/intake" className="btn-gold">
                  Request Access →
                </Link>
              </div>

              <div>
                <p className="eyebrow" style={{ marginBottom: "20px" }}>What&apos;s included</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                  {onboardingIncludes.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        color: "var(--ink-2)",
                        fontSize: "14px",
                        lineHeight: 1.6,
                      }}
                    >
                      <span style={{ color: "var(--gold)", marginTop: "6px", fontSize: "6px", flexShrink: 0 }}>●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── RETAINER PLANS ── */}
      <section className="px-6 sm:px-8 pb-16 max-w-4xl mx-auto">
        <Reveal className="mb-8">
          <p style={{ color: "var(--ink-3)", fontSize: "13px", letterSpacing: "0.08em" }}>
            Monthly retainer — after onboarding
          </p>
        </Reveal>
        <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="hover-card"
              style={{
                background: "var(--bg-2)",
                border: plan.featured
                  ? "1px solid rgba(201,168,76,0.35)"
                  : "1px solid var(--border)",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {plan.featured && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
                  opacity: 0.6,
                }} />
              )}

              <div
                style={{
                  padding: "32px",
                  borderBottom: `1px solid ${plan.featured ? "rgba(201,168,76,0.12)" : "var(--border)"}`,
                }}
              >
                <p className="eyebrow" style={{ marginBottom: "20px" }}>{plan.name}</p>
                <div style={{ marginBottom: "12px" }}>
                  <span
                    className="font-serif"
                    style={{
                      fontSize: "42px",
                      color: plan.featured ? "var(--gold)" : "var(--ink)",
                      fontWeight: 400,
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ color: "var(--ink-3)", fontSize: "13px", marginLeft: "6px" }}>/mo</span>
                </div>
                <p style={{ color: "var(--ink-3)", fontSize: "13px", lineHeight: 1.6 }}>{plan.tagline}</p>
              </div>

              <div style={{ padding: "32px", flex: 1 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                  {plan.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        color: "var(--ink-2)",
                        fontSize: "13px",
                        lineHeight: 1.6,
                      }}
                    >
                      <span style={{ color: "var(--gold)", marginTop: "5px", fontSize: "6px", flexShrink: 0 }}>●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: "24px 32px" }}>
                <Link
                  href="/intake"
                  className="btn-gold"
                  style={{
                    display: "block",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Request Access →
                </Link>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── BESPOKE LINE ── */}
      <section className="px-6 sm:px-8 py-20 max-w-4xl mx-auto text-center">
        <Reveal>
          <div style={{ height: "1px", background: "var(--border)", marginBottom: "40px" }} />
          <p
            className="font-serif"
            style={{ color: "var(--ink-2)", fontSize: "18px", fontStyle: "italic", marginBottom: "12px" }}
          >
            Bespoke engagements available by arrangement.
          </p>
          <p style={{ color: "var(--ink-3)", fontSize: "13px" }}>
            Questions answered privately.{" "}
            <a
              href="mailto:jarvis@simpyhq.com"
              style={{ color: "var(--gold)", textDecoration: "none", transition: "opacity 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
            >
              Reach us directly.
            </a>
          </p>
        </Reveal>
      </section>

    </div>
  );
}
