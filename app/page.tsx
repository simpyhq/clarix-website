"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useRef } from "react";

function Reveal({ children, delay = 0, className = "", stagger = false }: {
  children: React.ReactNode; delay?: number; className?: string; stagger?: boolean;
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
    <div ref={ref} className={`${stagger ? "stagger" : "reveal"} ${className}`}
      style={!stagger ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

function Terminal() {
  const lines: Array<{ type: string; label?: string; value?: string; text?: string }> = [
    { type: "comment", text: "# Jarvis — daily briefing complete" },
    { type: "blank" },
    { type: "label", label: "weather",     value: "Norman, OK  60°F  Rain after 6pm" },
    { type: "label", label: "markets",     value: "S&P 7,087 -0.31%  BTC $75.7K  NVDA $201" },
    { type: "label", label: "canvas",      value: "2 items due tomorrow — METR-1014" },
    { type: "label", label: "internships", value: "8 new listings — 3 DFW  5 NYC" },
    { type: "label", label: "model",       value: "gemini-flash (routine)  cost: $0.003" },
    { type: "blank" },
    { type: "comment", text: "# Email sent to christian@outlook.com" },
    { type: "comment", text: "# Next run in 23h 47m" },
    { type: "blank" },
    { type: "prompt" },
  ];

  return (
    <div className="w-full rounded-xl overflow-hidden border border-[#2a2a2e] shadow-2xl">
      <div className="bg-[#161618] border-b border-[#2a2a2e] px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#444449]" />
        <div className="w-3 h-3 rounded-full bg-[#444449]" />
        <div className="w-3 h-3 rounded-full bg-[#444449]" />
        <div className="ml-3 flex-1 bg-[#0f0f0f] border border-[#2a2a2e] rounded text-center text-[11px] text-[#444449] py-0.5 max-w-[180px] mx-auto font-mono">
          jarvis@mac-mini
        </div>
      </div>
      <div className="bg-[#0a0a0b] px-5 py-5 font-mono text-[13px] leading-7">
        {lines.map((line, i) => (
          <div key={i}>
            {line.type === "comment" && <span className="text-[#444449]">{line.text}</span>}
            {line.type === "label" && (
              <div className="flex gap-3">
                <span className="text-[#5E6AD2] w-24 flex-shrink-0">{line.label}</span>
                <span className="text-[#a0a0a8]">{line.value}</span>
              </div>
            )}
            {line.type === "prompt" && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[#5E6AD2]">❯</span>
                <span className="w-2 h-4 bg-[#5E6AD2] opacity-80 cursor-blink inline-block" />
              </div>
            )}
            {line.type === "blank" && <div className="h-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}

const deliverables = [
  { n: "01", title: "Persistent memory",      desc: "Every conversation, decision, and context retained indefinitely. No re-explaining yourself, ever." },
  { n: "02", title: "Dedicated hardware",      desc: "Runs on a Mac mini you own. Isolated, private, nothing shared with anyone." },
  { n: "03", title: "Automated workflows",     desc: "Reports, briefings, research, and data pulls run on schedule — without you asking." },
  { n: "04", title: "Natural communication",   desc: "Text it on WhatsApp, iMessage, email, or Discord like a real team member." },
  { n: "05", title: "Custom knowledge base",   desc: "Built from a discovery interview: your goals, industry, workflows, and contacts." },
  { n: "06", title: "Optimized AI costs",       desc: "We route tasks to the right model — fast and cheap for routine work, premium for high-stakes decisions. Most clients spend $30–80/mo on AI credits." },
];

const tiers = [
  { name: "Basic",  price: "$100", for: "Individuals & students",    plan: "/mo · $2,500 setup" },
  { name: "Pro",    price: "$250", for: "Businesses & professionals", plan: "/mo · $2,500 setup", featured: true },
];

const faqs = [
  { q: "Do I need technical knowledge?",      a: "None. Fill out our intake form, tell us what you want, and we handle everything." },
  { q: "What are API credits?",               a: "Your assistant uses Claude by Anthropic. You pay Anthropic directly — typically $30–80/month. We optimize model routing to keep this as low as possible." },
  { q: "Who owns the hardware and data?",     a: "You do. The Mac mini ships to you. Your data lives on your machine." },
  { q: "How long does setup take?",           a: "48–72 hours from completed intake to a live assistant." },
  { q: "What if I want changes after setup?", a: "Covered under the monthly fee. Most updates done within 24 hours." },
  { q: "Can I cancel?",                       a: "Yes, any time. Monthly billing, no contracts. The Mac mini stays with you." },
];

export default function HomePage() {
  return (
    <div className="bg-[#0f0f0f] text-[#e8e8e8]">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="animate-fade-in inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] border border-[#5E6AD2]/25 bg-[#5E6AD2]/8 px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2]" />
              Powered by Claude — Anthropic
            </div>

            <h1 className="animate-fade-in-up delay-100 text-[2.2rem] sm:text-[2.8rem] md:text-5xl font-medium leading-[1.06] tracking-tight mb-7 text-[#e8e8e8]">
              Your business.<br />
              Your assistant.<br />
              <span className="text-[#444449]">From day one.</span>
            </h1>

            <p className="animate-fade-in-up delay-200 text-[15px] text-[#6b6b72] leading-relaxed max-w-lg mb-10">
              Not a chatbot subscription. A configured, persistent AI system on dedicated hardware — with deep memory of your world. It becomes more valuable every day you use it.
            </p>

            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-3 mb-12">
              <Link href="/intake"
                className="inline-flex items-center justify-center gap-2 bg-[#5E6AD2] hover:bg-[#7c87e8] text-white px-6 py-3 rounded-lg font-semibold text-[14px]">
                Get Started <ArrowRight size={14} />
              </Link>
              <Link href="/services"
                className="inline-flex items-center justify-center gap-2 border border-[#2a2a2e] hover:border-[#5E6AD2]/50 text-[#a0a0a8] hover:text-[#e8e8e8] px-6 py-3 rounded-lg font-medium text-[14px]">
                How It Works
              </Link>
            </div>

            <div className="animate-fade-in delay-500 flex items-center gap-2 text-[13px] text-[#444449]">
              <Check size={13} className="text-[#5E6AD2]" />
              No contracts · Hardware yours to keep · Cancel any time
            </div>
          </div>

          <div className="animate-fade-in-up delay-400 lg:pt-4">
            <Terminal />
            <p className="text-[12px] text-[#444449] mt-3 text-center">
              Actual output from a live Clarix assistant — runs every morning at 9am
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#2a2a2e] bg-[#161618]">
        <Reveal>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x divide-[#2a2a2e]">
              {[
                { stat: "48–72 hrs", label: "From intake to live" },
                { stat: "88–90%",    label: "Gross margin per client" },
                { stat: "$100–$250", label: "Monthly after setup" },
                { stat: "24 / 7",   label: "Always on, always watching" },
              ].map((s) => (
                <div key={s.stat} className="md:px-8 first:pl-0 last:pr-0">
                  <p className="text-xl sm:text-2xl font-medium text-[#e8e8e8] mb-1 tracking-tight">{s.stat}</p>
                  <p className="text-[12px] text-[#444449]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* PROBLEM */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 md:py-32">
        <Reveal className="mb-16">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] mb-4">The Problem</p>
          <h2 className="text-2xl sm:text-3xl md:text-[2.4rem] font-medium leading-[1.1] tracking-tight mb-5 max-w-2xl">
            Generic AI tools don&apos;t know you.<br />
            <span className="text-[#444449]">We fix that.</span>
          </h2>
          <p className="text-[#6b6b72] text-[15px] max-w-xl leading-relaxed">
            Off-the-shelf AI answers questions when asked. It doesn&apos;t know your business, remember your decisions, or act without prompting. That&apos;s the gap we close.
          </p>
        </Reveal>

        <Reveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          ].map((p) => (
            <div key={p.label} className="hover-card bg-[#161618] border border-[#2a2a2e] rounded-xl p-6 h-full">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] mb-5">{p.label}</p>
              <ul className="space-y-3">
                {p.points.map((pt) => (
                  <li key={pt} className="text-[14px] text-[#6b6b72] flex gap-3 leading-relaxed">
                    <span className="text-[#2a2a2e] mt-0.5 flex-shrink-0">—</span>{pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </section>

      {/* WHAT YOU GET */}
      <section className="border-t border-[#2a2a2e] bg-[#161618] py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-16">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] mb-4">Every Client Gets</p>
            <h2 className="text-2xl sm:text-3xl md:text-[2.4rem] font-medium leading-[1.1] tracking-tight">
              A complete system,<br />
              <span className="text-[#444449]">not a subscription.</span>
            </h2>
          </Reveal>
          <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliverables.map((d) => (
              <div key={d.n} className="hover-card bg-[#0f0f0f] border border-[#2a2a2e] rounded-xl p-6 h-full">
                <span className="font-mono text-[11px] text-[#444449] mb-4 block">{d.n}</span>
                <h3 className="font-medium text-[#e8e8e8] text-[14px] mb-2">{d.title}</h3>
                <p className="text-[#6b6b72] text-[13px] leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* MODEL ROUTING CALLOUT */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 md:py-32">
        <Reveal>
          <div className="border border-[#5E6AD2]/25 bg-[#5E6AD2]/5 rounded-xl p-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] mb-4">Built-in Cost Optimization</p>
                <h2 className="text-xl sm:text-2xl font-medium mb-4 tracking-tight">
                  We tailor the AI models to your budget.
                </h2>
                <p className="text-[#6b6b72] leading-relaxed text-[15px]">
                  Not every task needs the most expensive model. We configure intelligent routing — fast, cheap models handle routine tasks like briefings and reminders, while premium models are reserved for complex analysis, important emails, and decisions that matter.
                </p>
              </div>
              <div className="space-y-3 font-mono text-[13px]">
                {[
                  { task: "Daily briefings",      model: "Gemini Flash",  cost: "~$0.003/run",  color: "text-green-400" },
                  { task: "Email monitoring",     model: "Ollama (local)", cost: "$0.00/run",   color: "text-green-400" },
                  { task: "Complex analysis",     model: "Claude Sonnet", cost: "~$0.04/run",  color: "text-yellow-400" },
                  { task: "Important decisions",  model: "Claude Sonnet", cost: "as needed",   color: "text-yellow-400" },
                ].map((r) => (
                  <div key={r.task} className="flex items-center justify-between bg-[#0f0f0f] border border-[#2a2a2e] rounded-lg px-4 py-3">
                    <div>
                      <span className="text-[#a0a0a8]">{r.task}</span>
                      <span className="text-[#444449] mx-2">→</span>
                      <span className="text-[#5E6AD2]">{r.model}</span>
                    </div>
                    <span className={`text-[12px] ${r.color}`}>{r.cost}</span>
                  </div>
                ))}
                <p className="text-[#444449] text-[12px] pt-1">Most clients spend $30–80/mo on API credits. We keep it there.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* PRICING */}
      <section className="border-t border-[#2a2a2e] bg-[#161618] py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-16">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] mb-4">Pricing</p>
            <h2 className="text-2xl sm:text-3xl md:text-[2.4rem] font-medium leading-[1.1] tracking-tight">
              Simple pricing.<br />
              <span className="text-[#444449]">No surprises.</span>
            </h2>
          </Reveal>
          <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {tiers.map((t) => (
              <div key={t.name}
                className={`rounded-xl p-7 flex flex-col h-full border ${
                  t.featured
                    ? "bg-[#5E6AD2]/10 border-[#5E6AD2]/30"
                    : "bg-[#0f0f0f] border-[#2a2a2e]"
                }`}>
                <p className={`text-[11px] font-semibold tracking-widests uppercase mb-1 ${t.featured ? "text-[#7c87e8]" : "text-[#5E6AD2]"}`}>{t.name}</p>
                <p className="text-[13px] text-[#444449] mb-5">{t.for}</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-[#e8e8e8]">{t.price}</span>
                  <span className="text-[13px] text-[#444449] mb-1">{t.plan}</span>
                </div>
                <Link href="/intake"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[13px] mt-auto ${
                    t.featured
                      ? "bg-[#5E6AD2] text-white hover:bg-[#7c87e8]"
                      : "border border-[#2a2a2e] hover:border-[#5E6AD2]/50 text-[#a0a0a8] hover:text-[#e8e8e8]"
                  }`}>
                  Get started <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </Reveal>
          <Reveal>
            <p className="text-center text-[13px] text-[#444449] mt-8">
              <Link href="/pricing" className="text-[#5E6AD2] hover:text-[#7c87e8]">Full pricing details including hourly rates →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-24 md:py-32">
        <Reveal className="mb-14">
          <p className="text-[11px] font-semibold tracking-widests uppercase text-[#5E6AD2] mb-4">FAQ</p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">Common questions.</h2>
        </Reveal>
        {faqs.map((faq, i) => (
          <Reveal key={faq.q} delay={i * 50}>
            <div className={`py-6 ${i !== faqs.length - 1 ? "border-b border-[#2a2a2e]" : ""}`}>
              <h3 className="font-semibold text-[#e8e8e8] mb-2 text-[15px]">{faq.q}</h3>
              <p className="text-[14px] text-[#6b6b72] leading-relaxed">{faq.a}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* CTA */}
      <section className="border-t border-[#2a2a2e]">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-24 md:py-32 text-center">
            <p className="text-[11px] font-semibold tracking-widests uppercase text-[#5E6AD2] mb-6">Get Started</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.08] mb-6 text-[#e8e8e8] tracking-tight">
              The window is open now.
            </h2>
            <p className="text-[#6b6b72] text-[15px] max-w-xl mx-auto mb-12 leading-relaxed">
              In 24 months, every serious business will have a dedicated AI assistant. Clients who set up now will have a compounding advantage over those who wait.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href="/intake"
                className="inline-flex items-center justify-center gap-2 bg-[#5E6AD2] hover:bg-[#7c87e8] text-white px-8 py-4 rounded-lg font-bold text-[15px]">
                Start Intake Form <ArrowRight size={16} />
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-[#2a2a2e] hover:border-[#5E6AD2]/50 text-[#6b6b72] hover:text-[#e8e8e8] px-8 py-4 rounded-lg font-medium text-[15px]">
                View Pricing
              </Link>
            </div>
            <p className="text-[12px] text-[#444449]">
              No contracts · Hardware yours to keep · Cancel any time
            </p>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
