"use client";

import Link from "next/link";
import { ArrowRight, Check, Zap, Brain, Lock, Clock, MessageSquare, BarChart3, Folder, Cpu } from "lucide-react";
import { useEffect, useRef } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const deliverables = [
  { icon: Cpu,           title: "Dedicated Mac mini",      desc: "Your AI lives on its own machine. Isolated, private, nothing in the cloud." },
  { icon: Brain,         title: "Custom knowledge base",   desc: "Built from a deep discovery interview: your goals, workflows, contacts, and preferences." },
  { icon: Clock,         title: "Persistent memory",       desc: "Remembers every conversation and decision across time. No re-explaining yourself." },
  { icon: Zap,           title: "Proactive monitoring",    desc: "Watches for deadlines, flags issues, and surfaces opportunities without being asked." },
  { icon: MessageSquare, title: "Natural communication",   desc: "Text it on WhatsApp, iMessage, email, or Discord like a real team member." },
  { icon: BarChart3,     title: "Automated workflows",     desc: "Reports, research, summaries, and data pulls run on schedule — reliably." },
  { icon: Folder,        title: "File delivery",           desc: "Outputs land in Dropbox, Google Drive, or email — wherever you want them." },
  { icon: Lock,          title: "Multi-model intelligence","desc": "Routes tasks to the right AI: fast for routine work, premium for high-stakes decisions." },
];

const tiers = [
  { label: "Business", range: "$2M–$50M revenue", plan: "Pro — $250/mo",   desc: "CFO functions, KPI monitoring, financial reporting, vendor management, and industry-specific automation." },
  { label: "Professional", range: "Real estate · Legal · Finance", plan: "Pro — $250/mo", desc: "Admin automation, client management, research, scheduling, and communication support." },
  { label: "Individual",   range: "Students · Creators · Executives", plan: "Basic — $100/mo", desc: "Personal briefings, research, health tracking, goal management, and proactive scheduling." },
];

const steps = [
  { n: "01", title: "Discovery Interview",   desc: "1–3 hours. Deep dive into your goals, workflows, contacts, and pain points." },
  { n: "02", title: "Hardware Setup",        desc: "Mac mini configured with our software, messaging integrations, and memory system." },
  { n: "03", title: "Knowledge Base",        desc: "Industry context, client-specific information, and preferences loaded in." },
  { n: "04", title: "Integrations",          desc: "Accounting, CRM, calendar, email, and file storage connected." },
  { n: "05", title: "Workflow Build",        desc: "Automated reports, scheduled tasks, and alerts configured to your specs." },
  { n: "06", title: "Two-Week Tuning",       desc: "Daily adjustments based on real usage and feedback." },
  { n: "07", title: "Handoff & Training",    desc: "You learn exactly what to ask, what's automated, and how to get the most from it." },
];

const faqs = [
  { q: "Do I need any technical knowledge?",       a: "None at all. Fill out our intake form, tell us what you want, and we handle everything." },
  { q: "What are API credits and what do they cost?", a: "Your assistant uses Claude by Anthropic. You pay Anthropic directly — typically $50–150/month depending on usage." },
  { q: "Who owns the hardware and data?",          a: "You do. The Mac mini is shipped to you and it's yours. Your data lives on your machine." },
  { q: "How long does setup take?",                a: "48–72 hours from completed intake form to live assistant. Complex setups may take up to a week." },
  { q: "What if I want to change something?",      a: "Every plan includes a tuning period. Ongoing changes are covered under the monthly fee — usually updated within 24 hours." },
  { q: "Can I cancel?",                            a: "Yes, any time. Monthly billing only — no annual contracts. The Mac mini stays with you either way." },
];

// ─── Scroll reveal hook ──────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Reusable reveal wrapper ─────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Mock product screenshot (built purely with divs) ────────────────────────

function ProductMockup() {
  return (
    <div className="animate-float w-full max-w-2xl mx-auto select-none pointer-events-none">
      {/* Window chrome */}
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
        {/* Title bar */}
        <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-2 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          <div className="ml-4 flex-1 bg-[#2a2a2a] rounded text-center text-[10px] text-white/30 py-0.5 px-3 max-w-[200px] mx-auto">
            clarix.ai/dashboard
          </div>
        </div>
        {/* App body */}
        <div className="bg-[#111] flex" style={{ height: "340px" }}>
          {/* Sidebar */}
          <div className="w-44 bg-[#0d0d0d] border-r border-white/5 p-3 flex flex-col gap-1">
            <div className="text-[10px] text-white/40 font-semibold tracking-widest uppercase mb-2 px-2">Clarix</div>
            {["Dashboard", "Briefings", "Internships", "Finance", "Tasks"].map((item, i) => (
              <div key={item} className={`px-2 py-1.5 rounded text-[11px] ${i === 0 ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}>
                {item}
              </div>
            ))}
            <div className="mt-auto text-[10px] text-white/20 px-2">v2.4.0</div>
          </div>
          {/* Main content */}
          <div className="flex-1 p-5 overflow-hidden">
            <div className="text-[11px] text-white/40 mb-3">Tuesday, April 21 · Good morning, Christian</div>
            {/* Stat row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "S&P 500", val: "7,087", chg: "▼ 0.31%", red: true },
                { label: "BTC",     val: "$75.7K", chg: "▼ 0.26%", red: true },
                { label: "NVDA",    val: "$201",   chg: "▲ 1.2%",  red: false },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <div className="text-[9px] text-white/40 mb-1">{s.label}</div>
                  <div className="text-[13px] font-semibold text-white">{s.val}</div>
                  <div className={`text-[9px] ${s.red ? "text-red-400" : "text-green-400"}`}>{s.chg}</div>
                </div>
              ))}
            </div>
            {/* Briefing card */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/5 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-semibold text-white/70">Daily Briefing</div>
                <div className="text-[9px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">Sent 9:00am</div>
              </div>
              <div className="space-y-1">
                {["Weather: 60°F, partly cloudy · Rain this evening", "Headline: Fed nominee Warsh vows independence", "Canvas: 2 items due tomorrow (METR-1014)"].map((line) => (
                  <div key={line} className="text-[9px] text-white/40 flex gap-1.5">
                    <span className="text-[#D4A847] mt-0.5">·</span>{line}
                  </div>
                ))}
              </div>
            </div>
            {/* Task row */}
            <div className="flex gap-2">
              <div className="flex-1 bg-white/5 rounded-lg p-2.5 border border-white/5">
                <div className="text-[9px] text-white/40 mb-1">Internship Digest</div>
                <div className="text-[10px] text-white/60">8 new listings · 3 DFW · 5 NYC</div>
              </div>
              <div className="flex-1 bg-white/5 rounded-lg p-2.5 border border-[#D4A847]/20">
                <div className="text-[9px] text-[#D4A847]/70 mb-1">AI is processing</div>
                <div className="flex gap-1 mt-1">
                  {[1,2,3].map(i => <div key={i} className="h-1 flex-1 rounded-full bg-[#D4A847]/30" style={{ animationDelay: `${i * 0.2}s` }} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-24 pb-0">

        {/* Radial background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-pulse-glow absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
               style={{ background: "radial-gradient(ellipse, rgba(212,168,71,0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 w-full">
          <div className="max-w-4xl mb-16">

            {/* Badge */}
            <div className="animate-fade-in inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] border border-[#D4A847]/30 bg-[#D4A847]/5 px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A847] animate-pulse" />
              Powered by Claude · Anthropic
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up delay-100 text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight mb-7">
              <span className="gradient-text">Your Life. Your Work.</span><br />
              <span className="text-white">An AI That Knows It.</span>
            </h1>

            {/* Sub */}
            <p className="animate-fade-in-up delay-200 text-lg sm:text-xl text-white/50 leading-relaxed max-w-2xl mb-10">
              Not a chatbot subscription. A configured, persistent AI system on dedicated hardware — with deep memory of your world. It becomes more valuable every day.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-3">
              <Link href="/intake"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#080808] hover:bg-white/90 px-7 py-3.5 rounded-lg font-semibold text-[15px]">
                Get Started <ArrowRight size={16} />
              </Link>
              <Link href="/services"
                className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/40 text-white/80 hover:text-white px-7 py-3.5 rounded-lg font-medium text-[15px]">
                How It Works
              </Link>
            </div>
          </div>

          {/* Product mockup */}
          <div className="animate-fade-in delay-500 w-full max-w-3xl">
            <ProductMockup />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
             style={{ background: "linear-gradient(to top, #080808, transparent)" }} />
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <Reveal>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x md:divide-white/5">
              {[
                { stat: "48–72 hrs", label: "From intake to live" },
                { stat: "88–90%",    label: "Gross margin per client" },
                { stat: "$100–$250", label: "Monthly after setup" },
                { stat: "24 / 7",   label: "Always on, always watching" },
              ].map((s) => (
                <div key={s.stat} className="md:px-8 first:pl-0 last:pr-0">
                  <p className="gradient-text-gold text-2xl sm:text-3xl font-bold mb-1">{s.stat}</p>
                  <p className="text-[12px] text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── THE PROBLEM ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 md:py-32">
        <Reveal className="mb-16">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-4">The Problem</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">
            The gap isn&apos;t better AI.<br />
            <span className="text-white/40">It&apos;s setup and configuration.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl">
            Off-the-shelf AI tools are generic. They don&apos;t know you. They don&apos;t remember yesterday. They don&apos;t proactively help. We remove that barrier.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { audience: "For Businesses", points: [
              "Financial reports arrive weeks late",
              "Can't afford a full-time CFO or analyst",
              "Data locked in QuickBooks and email — uninterpreted",
              "Every deadline falls on the owner",
            ]},
            { audience: "For Professionals", points: [
              "Admin consumes 30–50% of billable time",
              "Client follow-ups and reporting are manual",
              "No system that knows your practice",
            ]},
            { audience: "For Individuals", points: [
              "Generic AI tools don't retain context",
              "No assistant that knows your goals",
              "Research and planning fragmented across apps",
            ]},
          ].map((p, i) => (
            <Reveal key={p.audience} delay={i * 100}>
              <div className="card-glow bg-white/[0.03] border border-white/8 rounded-xl p-6 h-full">
                <h3 className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-5">{p.audience}</h3>
                <ul className="space-y-3">
                  {p.points.map((pt) => (
                    <li key={pt} className="text-[14px] text-white/50 leading-relaxed flex gap-3">
                      <span className="text-[#D4A847] mt-1 flex-shrink-0">—</span>{pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU GET ──────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.02] py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-16">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-4">Every Client Gets</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              A complete system,<br />
              <span className="text-white/40">not a subscription.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliverables.map((d, i) => (
              <Reveal key={d.title} delay={i * 60}>
                <div className="card-glow bg-white/[0.03] border border-white/8 rounded-xl p-5 h-full">
                  <d.icon size={18} className="text-[#D4A847] mb-4" />
                  <h3 className="text-white font-semibold text-[14px] mb-2">{d.title}</h3>
                  <p className="text-white/40 text-[13px] leading-relaxed">{d.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 md:py-32">
        <Reveal className="mb-16">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-4">The Process</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            From intake to live<br />
            <span className="text-white/40">in 48–72 hours.</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="relative">
                <div className="text-5xl font-black text-white/5 mb-4 leading-none">{s.n}</div>
                <div className="absolute top-2 left-0 w-6 h-px bg-[#D4A847]/40" />
                <h3 className="font-semibold text-white text-[14px] mb-2">{s.title}</h3>
                <p className="text-white/40 text-[13px] leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRICING / TIERS ───────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-white/[0.02] py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-16">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-4">Who It&apos;s For</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              No client too small.<br />
              <span className="text-white/40">No client too large.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((t, i) => (
              <Reveal key={t.label} delay={i * 100}>
                <div className={`card-glow rounded-xl p-7 flex flex-col h-full border ${i === 0 ? "bg-[#D4A847]/5 border-[#D4A847]/20" : "bg-white/[0.03] border-white/8"}`}>
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-1">{t.label}</p>
                  <p className="text-[12px] text-white/30 mb-5">{t.range}</p>
                  <p className="text-[14px] text-white/50 leading-relaxed flex-1 mb-6">{t.desc}</p>
                  <div className="border-t border-white/5 pt-5 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-white">{t.plan}</span>
                    <Link href="/pricing" className="text-[12px] text-[#D4A847] hover:text-[#f0c96e] flex items-center gap-1">
                      Details <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-24 md:py-32">
        <Reveal className="mb-14">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-4">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold">Common questions.</h2>
        </Reveal>
        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <div className={`py-6 ${i !== faqs.length - 1 ? "border-b border-white/5" : ""}`}>
                <h3 className="font-semibold text-white mb-2 text-[15px]">{faq.q}</h3>
                <p className="text-[14px] text-white/40 leading-relaxed">{faq.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
               style={{ background: "radial-gradient(ellipse, rgba(212,168,71,0.1) 0%, transparent 70%)" }} />
        </div>
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-24 md:py-32 text-center relative">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-6">Get Started</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              The window is open now.
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
              In 24 months, everyone will have an AI assistant. Clients who get set up properly now will have a compounding advantage over those who wait.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/intake"
                className="inline-flex items-center justify-center gap-2 bg-[#D4A847] hover:bg-[#c49a30] text-[#080808] px-8 py-4 rounded-lg font-bold text-[15px]">
                Start Intake Form <ArrowRight size={16} />
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/40 text-white/70 hover:text-white px-8 py-4 rounded-lg font-medium text-[15px]">
                View Pricing
              </Link>
            </div>

            {/* Social proof micro-line */}
            <div className="mt-12 flex items-center justify-center gap-2 text-[12px] text-white/25">
              <Check size={12} className="text-green-400" />
              No contracts · Hardware yours to keep · Cancel any time
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
