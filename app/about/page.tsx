"use client";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)" }}>

      {/* ── HEADER ── */}
      <section className="px-6 sm:px-8 pt-24 pb-20 max-w-4xl mx-auto">
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "24px" }}>About</p>
          <h1
            className="font-serif"
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "0",
              color: "var(--ink)",
              maxWidth: "700px",
              letterSpacing: "-0.04em",
            }}
          >
            We build intelligence for people who move at a <span style={{ color: "var(--cyan)" }}>different pace.</span>
          </h1>
        </Reveal>
      </section>

      {/* ── BODY ── */}
      <section className="px-6 sm:px-8 pb-24 max-w-3xl mx-auto">
        <Reveal delay={100}>
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, var(--cyan), transparent)",
              opacity: 0.35,
              marginBottom: "48px",
            }}
          />
          <p
            style={{
              color: "var(--ink-2)",
              fontSize: "17px",
              lineHeight: 1.8,
              marginBottom: "28px",
            }}
          >
            Clarix is an invitation-only private members club. We serve a deliberate number of principals at a time — executives, founders, and individuals who require a different standard of attention. We build private AI systems that know your world: your priorities, your relationships, your schedule, your work.
          </p>
          <p
            style={{
              color: "var(--ink-2)",
              fontSize: "17px",
              lineHeight: 1.8,
            }}
          >
            Every engagement begins with a private discovery process. We architect your system from the ground up, configure it to your channels and workflows, and maintain it as your life evolves. The result is not software. It is not a subscription. It is infrastructure — and it belongs to you.
          </p>
        </Reveal>
      </section>

      {/* ── NUMBERED TRUTHS ── */}
      <section className="px-6 sm:px-8 pb-28 max-w-3xl mx-auto">
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {[
            { num: "01", label: "Discretion", body: "Your system is yours alone. Dedicated infrastructure, isolated by design. No shared models, no co-tenancy, no third-party access." },
            { num: "02", label: "Continuity", body: "Unlike software that resets, your system learns and accumulates context over time. Each interaction makes it sharper." },
            { num: "03", label: "Partnership", body: "We don't hand you software and disappear. We maintain, evolve, and optimize — a retained relationship, not a transaction." },
          ].map((item, i) => (
            <Reveal key={item.num} delay={i * 100}>
              <div
                style={{
                  borderBottom: "1px solid var(--border)",
                  padding: "36px 0",
                  display: "grid",
                  gridTemplateColumns: "56px 1fr",
                  gap: "24px",
                  alignItems: "start",
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    color: "var(--cyan)",
                    opacity: 0.5,
                    fontSize: "11px",
                    paddingTop: "4px",
                    letterSpacing: "0.1em",
                  }}
                >
                  {item.num}
                </span>
                <div>
                  <h3
                    className="font-serif"
                    style={{
                      fontSize: "18px",
                      color: "var(--ink)",
                      marginBottom: "10px",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.label}
                  </h3>
                  <p style={{ color: "var(--ink-2)", fontSize: "15px", lineHeight: 1.7 }}>{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        className="px-6 sm:px-8 py-24 max-w-4xl mx-auto"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "16px" }}>Get in Touch</p>
          <p
            style={{
              color: "var(--ink-3)",
              fontSize: "14px",
              letterSpacing: "0.02em",
              marginBottom: "40px",
            }}
          >
            For inquiries, reach us directly.
          </p>
        </Reveal>
        <Reveal delay={80} stagger className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Michael Simpson", role: "Co-Founder", email: "michael@clarixhq.ai" },
            { name: "Christian Simpson", role: "Co-Founder", email: "christian@clarixhq.ai" },
            { name: "Support & Onboarding", role: "Clarix", email: "support@clarixhq.ai" },
          ].map((c) => (
            <div
              key={c.email}
              className="hover-card"
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "28px 24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0, left: "24px", right: "24px",
                  height: "1px",
                  background: "var(--cyan)",
                  opacity: 0.35,
                }}
              />
              <div
                style={{
                  width: "6px", height: "6px",
                  borderRadius: "50%",
                  background: "var(--cyan)",
                  marginBottom: "18px",
                  opacity: 0.8,
                }}
              />
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: "4px",
                }}
              >
                {c.role}
              </p>
              <p
                className="font-serif"
                style={{
                  fontSize: "16px",
                  color: "var(--ink)",
                  marginBottom: "14px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {c.name}
              </p>
              <a
                href={`mailto:${c.email}`}
                style={{
                  fontSize: "13px",
                  color: "var(--ink-3)",
                  transition: "color 0.2s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--cyan)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-3)"; }}
              >
                {c.email}
              </a>
            </div>
          ))}
        </Reveal>
        <Reveal delay={200}>
          <p
            style={{
              color: "var(--ink-3)",
              fontSize: "12px",
              marginTop: "28px",
              letterSpacing: "0.04em",
            }}
          >
            All inquiries are reviewed personally. Expect a response within 24 hours.
          </p>
        </Reveal>
      </section>

      {/* ── CLOSING ── */}
      <section className="px-6 sm:px-8 py-28 max-w-2xl mx-auto text-center">
        <Reveal>
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
              color: "var(--ink-2)",
              lineHeight: 1.5,
              marginBottom: "36px",
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            Engagements are accepted by referral or direct inquiry.
          </p>
          <Link href="/intake" className="btn-gold">
            Express Interest →
          </Link>
        </Reveal>
      </section>

    </div>
  );
}
