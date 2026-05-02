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
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: "0",
              color: "var(--ink)",
              maxWidth: "700px",
            }}
          >
            We build intelligence for people who move at a different pace.
          </h1>
        </Reveal>
      </section>

      {/* ── BODY ── */}
      <section className="px-6 sm:px-8 pb-24 max-w-3xl mx-auto">
        <Reveal delay={100}>
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, var(--gold), transparent)",
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
            Clarix serves a small number of principals — executives, founders, and individuals who require a different standard of attention. We build private AI systems that know your world: your priorities, your relationships, your schedule, your work.
          </p>
          <p
            style={{
              color: "var(--ink-2)",
              fontSize: "17px",
              lineHeight: 1.8,
            }}
          >
            Every engagement begins with a private discovery process. We architect your system from the ground up, configure it to your channels and workflows, and maintain it as your life evolves. The result is not software. It is infrastructure.
          </p>
        </Reveal>
      </section>

      {/* ── NUMBERED TRUTHS ── */}
      <section className="px-6 sm:px-8 pb-28 max-w-3xl mx-auto">
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {[
            { num: "I", label: "Discretion", body: "Your system is yours alone. No shared models. No cloud sync. Your data remains on hardware you own." },
            { num: "II", label: "Continuity", body: "Unlike software that resets, your system learns and accumulates context over time. Each interaction makes it sharper." },
            { num: "III", label: "Partnership", body: "We don't hand you software and disappear. We maintain, evolve, and optimize — a retained relationship, not a transaction." },
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
                  className="font-serif"
                  style={{
                    color: "var(--gold)",
                    opacity: 0.45,
                    fontSize: "14px",
                    fontStyle: "italic",
                    paddingTop: "4px",
                  }}
                >
                  {item.num}
                </span>
                <div>
                  <h3
                    className="font-serif"
                    style={{
                      fontSize: "19px",
                      color: "var(--ink)",
                      marginBottom: "10px",
                      fontWeight: 400,
                      fontStyle: "italic",
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

      {/* ── CLOSING ── */}
      <section className="px-6 sm:px-8 py-28 max-w-2xl mx-auto text-center">
        <Reveal>
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
            Engagements are accepted by referral or direct inquiry.
          </p>
          <Link href="/intake" className="btn-gold">
            Request Access →
          </Link>
        </Reveal>
      </section>

    </div>
  );
}
