import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const services = [
  {
    num: "01",
    title: "Personal Intelligence System",
    body: "Your AI system, built around your life. It knows your schedule, your preferences, your priorities. It monitors, surfaces, and acts on your behalf — proactively, not reactively.",
  },
  {
    num: "02",
    title: "Calendar & Communications",
    body: "Proactive management of your time and inbox. Briefings before meetings. Drafts before you ask. Alerts before deadlines slip.",
  },
  {
    num: "03",
    title: "Financial Monitoring",
    body: "Real-time awareness of markets, positions, and events relevant to you. Summarized, filtered, and surfaced at the right moment — not buried in noise.",
  },
  {
    num: "04",
    title: "Health & Research",
    body: "Ongoing monitoring of medical research, clinical developments, and information relevant to your health profile. Delivered with discretion, filtered for relevance.",
  },
];

export default function ServicesPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)" }}>

      {/* ── HEADER ── */}
      <section className="px-6 sm:px-8 pt-24 pb-20 max-w-4xl mx-auto">
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "24px" }}>Services</p>
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
            What we build.
          </h1>
          <p style={{ color: "var(--ink-2)", fontSize: "16px", lineHeight: 1.75, maxWidth: "480px" }}>
            Each system is bespoke. These are the domains we work within.
          </p>
        </Reveal>
      </section>

      {/* ── SERVICE CARDS ── */}
      <section className="px-6 sm:px-8 pb-28 max-w-4xl mx-auto">
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((s) => (
            <div
              key={s.num}
              className="hover-card"
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "40px 36px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle top-left glow */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "200px",
                height: "200px",
                background: "radial-gradient(circle at top left, rgba(201,168,76,0.03) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              <span
                className="font-serif"
                style={{
                  color: "var(--gold)",
                  opacity: 0.4,
                  fontSize: "13px",
                  fontStyle: "italic",
                  display: "block",
                  marginBottom: "20px",
                }}
              >
                {s.num}
              </span>
              <h3
                className="font-serif"
                style={{
                  fontSize: "20px",
                  color: "var(--ink)",
                  marginBottom: "16px",
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.2,
                }}
              >
                {s.title}
              </h3>
              <p style={{ color: "var(--ink-2)", fontSize: "14px", lineHeight: 1.75 }}>
                {s.body}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section
        className="px-6 sm:px-8 py-28 max-w-2xl mx-auto text-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "20px" }}>Availability</p>
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
              fontStyle: "italic",
              color: "var(--ink-2)",
              lineHeight: 1.5,
              marginBottom: "36px",
              fontWeight: 400,
            }}
          >
            Every system is built for one principal.
          </p>
          <Link href="/intake" className="btn-gold">
            Request Access →
          </Link>
          <p style={{ color: "var(--ink-3)", fontSize: "12px", marginTop: "20px", letterSpacing: "0.04em" }}>
            All engagements begin with a private consultation.
          </p>
        </Reveal>
      </section>

    </div>
  );
}
