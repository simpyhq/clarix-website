"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

function Reveal({
  children,
  delay = 0,
  className = "",
  stagger = false,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  stagger?: boolean;
  direction?: "up" | "left";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cls = stagger ? "stagger" : direction === "left" ? "reveal-left" : "reveal";
  return (
    <div
      ref={ref}
      className={`${cls} ${className}`}
      style={!stagger ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

const pillars = [
  {
    title: "Private by Design",
    body: "Runs on dedicated hardware you own. No shared infrastructure. No third-party access.",
  },
  {
    title: "Built Around You",
    body: "Deep knowledge of your schedule, priorities, and relationships — built through a private onboarding.",
  },
  {
    title: "Proactive Intelligence",
    body: "Monitors, surfaces, and acts. You are informed before you need to ask.",
  },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section
        className="relative text-center px-6 sm:px-8 flex flex-col items-center justify-center"
        style={{ minHeight: "92vh", paddingTop: "80px", paddingBottom: "80px" }}
      >
        {/* Ambient glow orbs */}
        <div
          className="ambient-glow animate-orb-float"
          style={{ top: "10%", left: "50%", transform: "translateX(-50%)", opacity: 0.8 }}
        />
        <div
          className="ambient-glow"
          style={{
            top: "40%",
            left: "20%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(201,168,76,0.025) 0%, transparent 70%)",
            animationDelay: "2s",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="eyebrow animate-fade-in" style={{ marginBottom: "32px" }}>
            By Invitation
          </p>

          <h1
            className="font-serif animate-fade-in-up delay-100"
            style={{
              fontSize: "clamp(2.6rem, 6.5vw, 4.5rem)",
              fontStyle: "italic",
              lineHeight: 1.08,
              marginBottom: "28px",
              color: "var(--ink)",
              fontWeight: 400,
            }}
          >
            Your world.<br />
            An intelligence<br />
            built around it.
          </h1>

          <p
            className="animate-fade-in-up delay-200 mx-auto"
            style={{
              color: "var(--ink-2)",
              fontSize: "16px",
              lineHeight: 1.75,
              maxWidth: "420px",
              marginBottom: "44px",
            }}
          >
            Clarix builds private AI systems for individuals who value
            discretion, capability, and time.
          </p>

          <div
            className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center"
            style={{ marginBottom: "64px" }}
          >
            <Link href="/intake" className="btn-gold">
              Request Access
            </Link>
            <Link
              href="/about"
              style={{
                color: "var(--ink-3)",
                fontSize: "14px",
                padding: "12px 28px",
                display: "inline-block",
                transition: "color 0.2s ease",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-3)"; }}
            >
              Learn More
            </Link>
          </div>

          {/* Animated gold rule */}
          <div
            className="mx-auto line-reveal animate-fade-in delay-500"
            style={{
              maxWidth: "160px",
              height: "1px",
              background: "rgba(201,168,76,0.22)",
            }}
          />
        </div>

        {/* Scroll indicator */}
        <div
          className="animate-fade-in delay-700"
          style={{
            position: "absolute",
            bottom: "36px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.4))",
            }}
          />
        </div>
      </section>

      {/* ── THREE PILLARS ── */}
      <section className="px-6 sm:px-8 pb-32 max-w-5xl mx-auto">
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((card) => (
            <div
              key={card.title}
              className="hover-card"
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderTop: "1px solid var(--gold-border)",
                borderRadius: "8px",
                padding: "36px 28px",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Gold accent top line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "28px",
                  right: "28px",
                  height: "1px",
                  background: "var(--gold)",
                  opacity: 0.5,
                }}
              />
              {/* Dot */}
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "var(--gold)",
                  marginBottom: "22px",
                  opacity: 0.85,
                }}
              />
              <h3
                className="font-serif"
                style={{
                  fontSize: "19px",
                  color: "var(--ink)",
                  marginBottom: "14px",
                  fontWeight: 400,
                  fontStyle: "italic",
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

      {/* ── PULL QUOTE ── */}
      <section
        className="px-6 sm:px-8 py-28 max-w-3xl mx-auto text-center"
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <Reveal>
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(1.6rem, 4.5vw, 2.6rem)",
              fontStyle: "italic",
              color: "var(--ink)",
              lineHeight: 1.25,
              fontWeight: 400,
            }}
          >
            "Not a chatbot.<br />Not a subscription.<br />
            <span style={{ color: "var(--gold)" }}>A system.</span>"
          </p>
        </Reveal>
      </section>

      {/* ── THREE TRUTHS ── */}
      <section className="px-6 sm:px-8 py-28 max-w-4xl mx-auto">
        <Reveal className="mb-16">
          <p className="eyebrow" style={{ marginBottom: "16px" }}>What sets us apart</p>
        </Reveal>
        <div className="flex flex-col gap-0">
          {[
            { num: "01", title: "Yours alone.", body: "Your system runs on hardware you own. Your data never passes through shared infrastructure." },
            { num: "02", title: "Built from discovery.", body: "We learn your world before we build anything. The result knows your patterns, not just your prompts." },
            { num: "03", title: "Maintained, not forgotten.", body: "Monthly upkeep, tuning, and evolution. As your life changes, your system does too." },
          ].map((item, i) => (
            <Reveal key={item.num} delay={i * 80}>
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "32px",
                  paddingBottom: "32px",
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: "24px",
                  alignItems: "start",
                }}
              >
                <span
                  className="font-serif"
                  style={{ color: "var(--gold)", opacity: 0.5, fontSize: "13px", paddingTop: "4px", fontStyle: "italic" }}
                >
                  {item.num}
                </span>
                <div>
                  <h3
                    className="font-serif"
                    style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px", fontWeight: 400, fontStyle: "italic" }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--ink-2)", fontSize: "15px", lineHeight: 1.7, maxWidth: "480px" }}>
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </section>

      {/* ── ACCESS SECTION ── */}
      <section className="px-6 sm:px-8 py-32 max-w-2xl mx-auto text-center">
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "24px" }}>Availability</p>
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
              fontStyle: "italic",
              color: "var(--ink)",
              lineHeight: 1.4,
              marginBottom: "36px",
              fontWeight: 400,
            }}
          >
            Currently accepting a limited number of engagements.
          </p>
          <Link href="/intake" className="btn-gold" style={{ marginBottom: "20px" }}>
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
