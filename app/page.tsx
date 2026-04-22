"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useRef } from "react";

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
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

// ── Terminal mockup ───────────────────────────────────────────────────────────
function Terminal() {
  const lines: Array<{type: string; text?: string; label?: string; value?: string}> = [
    { type: "comment", text: "# Jarvis — daily briefing complete" },
    { type: "blank" },
    { type: "label",  label: "weather",     value: "Norman, OK · 60°F · Rain after 6pm" },
    { type: "label",  label: "markets",     value: "S&P 7,087 ▼0.31% · BTC $75.7K · NVDA $201" },
    { type: "label",  label: "canvas",      value: "2 items due tomorrow (METR-1014)" },
    { type: "label",  label: "internships", value: "8 new listings · 3 DFW · 5 NYC" },
    { type: "blank" },
    { type: "comment", text: "# Email sent → christian.simpson.2018@outlook.com" },
    { type: "comment", text: "# Next run in 23h 47m" },
    { type: "blank" },
    { type: "prompt",  text: "" },
  ];

  return (
    <div className="w-full rounded-xl overflow-hidden border border-[#e0e0e0] shadow-[0_24px_64px_rgba(0,0,0,0.08)]">
      {/* Chrome bar */}
      <div className="bg-[#f5f5f5] border-b border-[#e0e0e0] px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 bg-white border border-[#e0e0e0] rounded text-center text-[11px] text-[#9b9b9b] py-0.5 max-w-[180px] mx-auto font-mono">
          jarvis@mac-mini
        </div>
      </div>
      {/* Terminal body */}
      <div className="bg-[#0e0e0e] px-5 py-5 font-mono text-[13px] leading-7">
        {lines.map((line, i) => (
          <div key={i}>
            {line.type === "comment" && (
              <span className="text-[#6b6b6b]">{line.text}</span>
            )}
            {line.type === "label" && (
              <div className="flex gap-3">
                <span className="text-[#0066ff] w-24 flex-shrink-0">{line.label}</span>
                <span className="text-[#e0e0e0]">{line.value}</span>
              </div>
            )}
            {line.type === "prompt" && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[#0066ff]">❯</span>
                <span className="w-2 h-4 bg-[#0066ff] opacity-80 cursor-blink inline-block" />
              </div>
            )}
            {line.type === "blank" && <div className="h-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const capabilities = [
  { n: "01", title: "Persistent memory",       desc: "Remembers every conversation, decision, and context across time. No re-explaining yourself." },
  { n: "02", title: "Dedicated hardware",       desc: "Runs on a Mac mini in your hands. Isolated, private, nothing shared with anyone." },
  { n: "03", title: "Automated workflows",      desc: "Reports, briefings, research, and data pulls run on schedule — without you asking." },
  { n: "04", title: "Natural communication",    desc: "Text it on WhatsApp, iMessage, email, or Discord like a real team member." },
  { n: "05", title: "Custom knowledge base",    desc: "Built from a discovery interview: your goals, industry, workflows, and contacts." },
  { n: "06", title: "Multi-model routing",      desc: "Fast models for routine tasks. Premium models when the stakes are high." },
];

const steps = [
  { n: "01", title: "Discovery interview",   desc: "1–3 hours. We map your goals, workflows, contacts, data sources, and pain points." },
  { n: "02", title: "Hardware setup",        desc: "Mac mini configured with our software, messaging integrations, and memory system." },
  { n: "03", title: "Knowledge base",        desc: "Industry context, client info, and preferences loaded into the system." },
  { n: "04", title: "Integrations",          desc: "Accounting, CRM, calendar, email, and file storage connected." },
  { n: "05", title: "Workflow build",        desc: "Automated reports, tasks, and alerts configured to your specs." },
  { n: "06", title: "Two-week tuning",       desc: "Daily adjustments based on real usage and feedback." },
  { n: "07", title: "Handoff & training",    desc: "You learn exactly what to ask, what's automated, and how to get the most from it." },
];

const tiers = [
  {
    name: "Basic",
    price: "$100",
    freq: "/mo after setup",
    for: "Individuals & students",
    items: [
      "Daily briefings & reminders",
      "Personal research assistant",
      "Calendar & deadline tracking",
      "Health & goal monitoring",
      "WhatsApp / iMessage access",
    ],
  },
  {
    name: "Pro",
    price: "$250",
    freq: "/mo after setup",
    for: "Businesses & professionals",
    featured: true,
    items: [
      "Everything in Basic",
      "Financial reporting & KPIs",
      "CRM & email automation",
      "Vendor & deadline management",
      "Multi-channel delivery",
      "Dedicated support",
    ],
  },
];

const faqs = [
  { q: "Do I need technical knowledge?",        a: "None. Fill out our intake form, tell us what you want, and we handle everything." },
  { q: "What are API credits?",                  a: "Your assistant uses Claude by Anthropic. You pay Anthropic directly — typically $50–150/month." },
  { q: "Who owns the hardware and data?",        a: "You do. The Mac mini ships to you. Your data lives on your machine — we don't retain access." },
  { q: "How long does setup take?",              a: "48–72 hours from completed intake to a live assistant. Complex setups may take up to a week." },
  { q: "What if I want changes after setup?",    a: "Covered under the monthly fee. Most updates done within 24 hours." },
  { q: "Can I cancel?",                          a: "Yes, any time. Monthly billing, no contracts. The Mac mini is yours either way." },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="bg-white text-[#0a0a0a]">

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left col */}
          <div>
            {/* Tag */}
            <div className="animate-fade-in inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] border border-[#0066ff]/20 bg-[#f0f5ff] px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff]" />
              Powered by Claude · Anthropic
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up delay-100 text-[2.6rem] sm:text-5xl md:text-6xl font-bold leading-[1.06] tracking-tight mb-7 text-[#0a0a0a]">
              Your business.<br />
              Your assistant.<br />
              <span className="text-[#6b6b6b]">From day one.</span>
            </h1>

            <p className="animate-fade-in-up delay-200 text-[17px] text-[#6b6b6b] leading-relaxed max-w-lg mb-10">
              A configured, persistent AI system on dedicated hardware — with deep memory of your world. Not a chatbot. A system that knows your business and acts on it.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-3 mb-12">
              <Link href="/intake"
                className="inline-flex items-center justify-center gap-2 bg-[#0a0a0a] hover:bg-[#222] text-white px-6 py-3 rounded-lg font-semibold text-[14px]">
                Start intake form <ArrowRight size={14} />
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-[#e8e8e8] hover:border-[#0a0a0a] text-[#0a0a0a] px-6 py-3 rounded-lg font-medium text-[14px]">
                View pricing
              </Link>
            </div>

            {/* Trust line */}
            <div className="animate-fade-in delay-500 flex items-center gap-2 text-[13px] text-[#9b9b9b]">
              <Check size={13} className="text-[#0066ff]" />
              No contracts · Hardware yours to keep · Cancel any time
            </div>
          </div>

          {/* Right col — terminal */}
          <div className="animate-fade-in-up delay-400 lg:pt-4">
            <Terminal />
            <p className="text-[12px] text-[#9b9b9b] mt-3 text-center">
              Actual output from a live Clarix assistant — running every morning at 9am
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-[#e8e8e8]">
        <Reveal>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x divide-[#e8e8e8]">
              {[
                { stat: "48–72 hrs", label: "From intake to live" },
                { stat: "88–90%",    label: "Gross margin per client" },
                { stat: "$100–$250", label: "Monthly after setup" },
                { stat: "24 / 7",   label: "Always on, always watching" },
              ].map((s) => (
                <div key={s.stat} className="md:px-8 first:pl-0 last:pr-0">
                  <p className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] mb-1 tracking-tight">{s.stat}</p>
                  <p className="text-[12px] text-[#9b9b9b]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 md:py-32">
        <Reveal className="mb-16">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">The Problem</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.8rem] font-bold leading-[1.1] tracking-tight mb-5 max-w-2xl">
            Generic AI tools don&apos;t know you. We fix that.
          </h2>
          <p className="text-[#6b6b6b] text-[17px] max-w-xl leading-relaxed">
            Off-the-shelf AI answers questions when asked. It doesn&apos;t know your business, remember your decisions, or act without prompting. That&apos;s the gap we close.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: "For Businesses", points: [
              "Financial reports arrive weeks late",
              "Can't afford a full-time CFO or analyst",
              "Data locked in QuickBooks and email",
              "Every deadline falls on the owner",
            ]},
            { label: "For Professionals", points: [
              "Admin consumes 30–50% of billable time",
              "Client follow-ups are manual",
              "No system that knows your practice",
            ]},
            { label: "For Individuals", points: [
              "Generic AI has no memory between sessions",
              "No assistant that knows your goals",
              "Research and planning is fragmented",
            ]},
          ].map((p, i) => (
            <Reveal key={p.label} delay={i * 80}>
              <div className="hover-card bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl p-6 h-full">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-5">{p.label}</p>
                <ul className="space-y-3">
                  {p.points.map((pt) => (
                    <li key={pt} className="text-[14px] text-[#6b6b6b] flex gap-3 leading-relaxed">
                      <span className="text-[#d0d0d0] mt-0.5 flex-shrink-0">—</span>{pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="border-t border-[#e8e8e8] bg-[#f7f7f7] py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-16">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">What You Get</p>
            <h2 className="text-3xl sm:text-4xl md:text-[2.8rem] font-bold leading-[1.1] tracking-tight max-w-xl">
              A complete system, not a subscription.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((c, i) => (
              <Reveal key={c.n} delay={i * 60}>
                <div className="hover-card bg-white border border-[#e8e8e8] rounded-xl p-6 h-full">
                  <span className="text-[11px] font-mono text-[#9b9b9b] mb-4 block">{c.n}</span>
                  <h3 className="font-semibold text-[#0a0a0a] text-[15px] mb-2">{c.title}</h3>
                  <p className="text-[#6b6b6b] text-[13px] leading-relaxed">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 md:py-32">
        <Reveal className="mb-16">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">The Process</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.8rem] font-bold leading-[1.1] tracking-tight">
            From intake to live<br />
            <span className="text-[#9b9b9b]">in 48–72 hours.</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 60}>
              <div className="relative pt-6 border-t-2 border-[#e8e8e8]">
                <div className="absolute top-0 left-0 w-8 h-0.5 bg-[#0066ff]" />
                <span className="font-mono text-[11px] text-[#9b9b9b] mb-3 block">{s.n}</span>
                <h3 className="font-semibold text-[#0a0a0a] text-[14px] mb-2">{s.title}</h3>
                <p className="text-[#6b6b6b] text-[13px] leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="border-t border-[#e8e8e8] bg-[#f7f7f7] py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-16">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">Pricing</p>
            <h2 className="text-3xl sm:text-4xl md:text-[2.8rem] font-bold leading-[1.1] tracking-tight">
              Simple pricing.<br />
              <span className="text-[#9b9b9b]">No surprises.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {tiers.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className={`rounded-xl p-7 flex flex-col h-full border ${
                  t.featured
                    ? "bg-[#0a0a0a] border-[#0a0a0a] text-white"
                    : "bg-white border-[#e8e8e8] text-[#0a0a0a]"
                }`}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className={`text-[11px] font-semibold tracking-widest uppercase mb-1 ${t.featured ? "text-[#6b9bff]" : "text-[#0066ff]"}`}>{t.name}</p>
                      <p className={`text-[13px] ${t.featured ? "text-white/50" : "text-[#9b9b9b]"}`}>{t.for}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold">{t.price}</span>
                      <span className={`text-[12px] ${t.featured ? "text-white/40" : "text-[#9b9b9b]"}`}>{t.freq}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1 mb-7">
                    {t.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13px]">
                        <Check size={13} className={`mt-0.5 flex-shrink-0 ${t.featured ? "text-[#6b9bff]" : "text-[#0066ff]"}`} />
                        <span className={t.featured ? "text-white/70" : "text-[#6b6b6b]"}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/intake"
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[13px] ${
                      t.featured
                        ? "bg-white text-[#0a0a0a] hover:bg-white/90"
                        : "bg-[#0a0a0a] text-white hover:bg-[#222]"
                    }`}>
                    Get started <ArrowRight size={13} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-center text-[13px] text-[#9b9b9b] mt-8">
              One-time setup fee varies by plan. <Link href="/pricing" className="text-[#0066ff] hover:underline">Full pricing details →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-24 md:py-32">
        <Reveal className="mb-14">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Common questions.</h2>
        </Reveal>
        {faqs.map((faq, i) => (
          <Reveal key={faq.q} delay={i * 50}>
            <div className={`py-6 ${i !== faqs.length - 1 ? "border-b border-[#e8e8e8]" : ""}`}>
              <h3 className="font-semibold text-[#0a0a0a] mb-2 text-[15px]">{faq.q}</h3>
              <p className="text-[14px] text-[#6b6b6b] leading-relaxed">{faq.a}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-[#e8e8e8] bg-[#0a0a0a]">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-24 md:py-32 text-center">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b9bff] mb-6">Get Started</p>
            <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold leading-[1.08] mb-6 text-white tracking-tight">
              The window is open now.
            </h2>
            <p className="text-white/40 text-[17px] max-w-xl mx-auto mb-12 leading-relaxed">
              In 24 months, every serious business will have a dedicated AI assistant. Clients who set up now will have a compounding advantage over those who wait.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href="/intake"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-[#0a0a0a] px-8 py-4 rounded-lg font-bold text-[15px]">
                Start intake form <ArrowRight size={16} />
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/40 text-white/70 hover:text-white px-8 py-4 rounded-lg font-medium text-[15px]">
                View pricing <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-[12px] text-white/20">
              No contracts · Hardware yours to keep · Cancel any time
            </p>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
