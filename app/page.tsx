"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
        if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
      },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const cls = stagger ? "stagger" : direction === "left" ? "reveal-left" : "reveal";
  return (
    <div ref={ref} className={`${cls} ${className}`} style={!stagger ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(ease * end));
          if (p < 1) requestAnimationFrame(tick);
          else setVal(end);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const stats = [
  { value: 12, suffix: "+", label: "Active clients" },
  { value: 40, suffix: "h", label: "Saved per client / month" },
  { value: 99, suffix: "%", label: "Uptime across all deployments" },
  { value: 24, suffix: "h", label: "Max onboarding turnaround" },
];

const useCases = [
  {
    tag: "Executive Operations",
    headline: "Your entire business in one intelligence.",
    body: "Monitors email, Slack, CRM, and calendar simultaneously. Surfaces what needs your attention before you ask. Drafts responses, schedules follow-ups, and flags risk — all in the background.",
    metric: "8h saved / week",
  },
  {
    tag: "Sales & Pipeline",
    headline: "Never let a deal go cold again.",
    body: "Tracks every open opportunity, logs every interaction, and prompts next-best actions at the right moment. Works across email, phone, and CRM without manual input.",
    metric: "3x faster follow-up",
  },
  {
    tag: "Financial Services",
    headline: "Real-time intelligence on a 43,000-account portfolio.",
    body: "Daily prioritized queues for every advisor. Scoring engine that ranks accounts by urgency, equity position, and contact history — delivered before they log on.",
    metric: "100% queue coverage",
  },
  {
    tag: "Architecture & Design",
    headline: "Project context that never falls through the cracks.",
    body: "Pulls from email, Deltek, and client conversations. Surfaces open action items, drafts client updates, and keeps every project thread organized without a single manual entry.",
    metric: "Zero missed follow-ups",
  },
];

const process = [
  { num: "01", title: "Discovery call.", body: "We learn your world — your tools, your workflows, your biggest time drains. One hour. No templates." },
  { num: "02", title: "We build.", body: "Custom agent stack deployed on dedicated hardware at your location or ours. Typically live within 48 hours of kickoff." },
  { num: "03", title: "You use it.", body: "Your agent starts working immediately. Morning briefings, proactive alerts, automated tasks — from day one." },
  { num: "04", title: "We tune it.", body: "Weekly check-ins for the first month. We refine the scoring, adjust the workflows, and expand scope based on what you actually need." },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 sm:px-8"
        style={{ minHeight: "100vh", paddingTop: "100px", paddingBottom: "80px" }}
      >
        {/* Ambient glows */}
        <div className="ambient-glow animate-orb-float" style={{ top: "8%", left: "50%", transform: "translateX(-50%)", opacity: 0.9 }} />
        <div className="ambient-glow" style={{ top: "55%", left: "15%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(56,189,248,0.03) 0%, transparent 70%)", animationDelay: "3s" }} />
        <div className="ambient-glow" style={{ top: "30%", right: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(56,189,248,0.025) 0%, transparent 70%)", animationDelay: "1.5s" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="animate-fade-in inline-flex items-center gap-2 mx-auto"
            style={{
              border: "1px solid var(--cyan-border)",
              borderRadius: "100px",
              padding: "6px 16px",
              marginBottom: "40px",
              background: "var(--cyan-bg)",
            }}
          >
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--cyan)", animation: "cyanPulse 2s ease-in-out infinite" }} />
            <span style={{ color: "var(--cyan)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-mono), monospace" }}>
              Now Accepting New Clients
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              lineHeight: 1.0,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              marginBottom: "32px",
              color: "var(--ink)",
            }}
          >
            The AI that runs<br />
            <span style={{
              background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              your business.
            </span>
          </h1>

          {/* Subhead */}
          <p
            className="animate-fade-in-up delay-200 mx-auto"
            style={{ color: "var(--ink-2)", fontSize: "clamp(16px, 2.5vw, 20px)", lineHeight: 1.65, maxWidth: "520px", marginBottom: "48px" }}
          >
            Clarix builds private AI agents for businesses that want real results —
            not another dashboard to manage.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ marginBottom: "80px" }}>
            <Link
              href="/intake"
              style={{
                background: "var(--cyan)",
                color: "var(--bg)",
                padding: "14px 36px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono), monospace",
                transition: "all 0.2s ease",
                boxShadow: "0 0 40px rgba(56,189,248,0.25)",
                display: "inline-block",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 60px rgba(56,189,248,0.45)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 40px rgba(56,189,248,0.25)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              Get Started →
            </Link>
            <Link
              href="/services"
              style={{ color: "var(--ink-3)", fontSize: "14px", padding: "14px 28px", letterSpacing: "0.02em", transition: "color 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-3)"; }}
            >
              See what we build
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="animate-fade-in delay-500 grid grid-cols-2 sm:grid-cols-4 gap-px mx-auto"
            style={{ maxWidth: "680px", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", background: "var(--border)" }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{ background: "var(--bg-2)", padding: "24px 20px", textAlign: "center" }}
              >
                <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--cyan)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  <CountUp end={s.value} suffix={s.suffix} />
                </div>
                <div style={{ color: "var(--ink-3)", fontSize: "11px", marginTop: "6px", letterSpacing: "0.04em", lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in delay-700" style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)" }}>
          <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, transparent, rgba(56,189,248,0.4))", margin: "0 auto" }} />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ borderTop: "1px solid var(--border)", padding: "100px 24px" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-16 text-center">
            <p className="eyebrow" style={{ marginBottom: "16px" }}>The Process</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.04em" }}>
              Live in 48 hours.
            </h2>
          </Reveal>

          <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((step) => (
              <div
                key={step.num}
                className="hover-card"
                style={{
                  background: "var(--bg-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "32px 24px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, var(--cyan) 0%, transparent 100%)",
                    opacity: 0.5,
                  }}
                />
                <span
                  className="font-mono"
                  style={{ color: "var(--cyan)", fontSize: "10px", letterSpacing: "0.2em", opacity: 0.7, display: "block", marginBottom: "20px" }}
                >
                  {step.num}
                </span>
                <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "12px", letterSpacing: "-0.02em" }}>
                  {step.title}
                </h3>
                <p style={{ color: "var(--ink-2)", fontSize: "14px", lineHeight: 1.7 }}>{step.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section style={{ padding: "100px 24px" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-16">
            <p className="eyebrow" style={{ marginBottom: "16px" }}>What we build</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.04em", maxWidth: "500px" }}>
              Built for how your business actually runs.
            </h2>
          </Reveal>

          <div className="flex flex-col gap-0">
            {useCases.map((uc, i) => (
              <Reveal key={uc.tag} delay={i * 60}>
                <div
                  className="hover-card"
                  style={{
                    borderTop: "1px solid var(--border)",
                    padding: "40px 0",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "40px",
                    alignItems: "center",
                    cursor: "default",
                  }}
                >
                  <div>
                    <p className="eyebrow" style={{ marginBottom: "12px" }}>{uc.tag}</p>
                    <h3 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontWeight: 700, marginBottom: "16px", letterSpacing: "-0.03em" }}>
                      {uc.headline}
                    </h3>
                    <p style={{ color: "var(--ink-2)", fontSize: "15px", lineHeight: 1.7, maxWidth: "400px" }}>{uc.body}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "inline-block",
                        border: "1px solid var(--cyan-border)",
                        borderRadius: "6px",
                        padding: "16px 24px",
                        background: "var(--cyan-bg)",
                      }}
                    >
                      <p style={{ color: "var(--cyan)", fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {uc.metric}
                      </p>
                      <p style={{ color: "var(--ink-3)", fontSize: "11px", marginTop: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        Measured outcome
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop: "1px solid var(--border)" }} />
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATORS ── */}
      <section style={{ borderTop: "1px solid var(--border)", padding: "100px 24px", background: "var(--bg-2)" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-16 text-center">
            <p className="eyebrow" style={{ marginBottom: "16px" }}>Why Clarix</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.04em" }}>
              Not a tool. Not a SaaS.<br />
              <span style={{ color: "var(--cyan)" }}>A dedicated system.</span>
            </h2>
          </Reveal>

          <Reveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "🔒",
                title: "Private by design.",
                body: "Your agent runs on dedicated hardware. No shared infrastructure. No data leaving your network. Built for businesses where privacy isn't optional.",
              },
              {
                icon: "⚡",
                title: "Proactive, not reactive.",
                body: "Doesn't wait to be asked. Monitors your tools, surfaces what matters, and acts before you need to. Your agent works while you sleep.",
              },
              {
                icon: "🛠",
                title: "Maintained by us.",
                body: "We own every layer — infrastructure, models, and logic. You never touch a server. We tune, update, and expand scope as your business evolves.",
              },
            ].map((d) => (
              <div
                key={d.title}
                className="hover-card"
                style={{
                  background: "var(--bg-3)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "36px 28px",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "20px" }}>{d.icon}</div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", letterSpacing: "-0.02em" }}>{d.title}</h3>
                <p style={{ color: "var(--ink-2)", fontSize: "14px", lineHeight: 1.75 }}>{d.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section style={{ padding: "120px 24px", borderBottom: "1px solid var(--border)" }}>
        <Reveal className="max-w-3xl mx-auto text-center">
          <p style={{
            fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.15,
            color: "var(--ink)",
          }}>
            "We don't sell software.<br />
            We build the AI that runs<br />
            <span style={{ color: "var(--cyan)" }}>your entire operation."</span>
          </p>
          <p style={{ color: "var(--ink-3)", fontSize: "13px", marginTop: "24px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono), monospace" }}>
            — Christian Simpson, Co-founder
          </p>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "120px 24px" }}>
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: "24px" }}>Get started</p>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.05em", marginBottom: "20px", lineHeight: 1.05 }}>
              Ready to stop doing<br />work AI should handle?
            </h2>
            <p style={{ color: "var(--ink-2)", fontSize: "16px", lineHeight: 1.75, maxWidth: "420px", margin: "0 auto 40px" }}>
              Tell us what you're working on. We'll respond within 24 hours with a plan, not a sales pitch.
            </p>
            <Link
              href="/intake"
              style={{
                background: "var(--cyan)",
                color: "var(--bg)",
                padding: "16px 48px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono), monospace",
                display: "inline-block",
                boxShadow: "0 0 40px rgba(56,189,248,0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 70px rgba(56,189,248,0.5)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 40px rgba(56,189,248,0.3)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              Start the conversation →
            </Link>
            <p style={{ color: "var(--ink-3)", fontSize: "12px", marginTop: "20px", letterSpacing: "0.04em" }}>
              No automated responses. Direct reply within 24 hours.
            </p>
          </Reveal>
        </div>
      </section>

    </div>
  );
}