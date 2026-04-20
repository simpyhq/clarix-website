import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const problems = [
  {
    audience: "For Businesses",
    points: [
      "Financial reports arrive weeks late — decisions made on stale data",
      "Can't afford a full-time CFO, analyst, or operations manager",
      "Data locked in QuickBooks, spreadsheets, and email — uninterpreted",
      "Every vendor, every deadline, every follow-up falls on the owner",
    ],
  },
  {
    audience: "For Professionals",
    points: [
      "Admin consumes 30–50% of billable time",
      "Client follow-ups, scheduling, research, and reporting are manual",
      "No system that knows your practice and proactively supports you",
    ],
  },
  {
    audience: "For Individuals",
    points: [
      "Generic AI tools don't retain context between sessions",
      "No assistant that knows your goals, schedule, and priorities",
      "Research, planning, and communication fragmented across a dozen apps",
    ],
  },
];

const deliverables = [
  { title: "Dedicated Mac mini", desc: "Your AI lives on its own machine. Data stays isolated and private — nothing shared, nothing in the cloud." },
  { title: "Custom knowledge base", desc: "Built from a deep discovery interview: your goals, industry, workflows, contacts, and preferences." },
  { title: "Persistent memory", desc: "Remembers every conversation, decision, and piece of context across time. No re-explaining yourself." },
  { title: "Proactive monitoring", desc: "Watches for deadlines, flags issues, and surfaces opportunities — without being asked." },
  { title: "Natural communication", desc: "Text it on WhatsApp, iMessage, email, or Discord like a real team member." },
  { title: "Automated workflows", desc: "Reports, research, summaries, reminders, and data pulls run on schedule — reliably." },
  { title: "File delivery", desc: "Outputs land in Dropbox, Google Drive, or email — wherever you want them." },
  { title: "Multi-model intelligence", desc: "Routes tasks to the right AI model: fast and cheap for routine work, premium for high-stakes decisions." },
];

const differentiators = [
  { label: "It knows you.", detail: "The onboarding process builds a knowledge base no generic AI has." },
  { label: "It remembers.", detail: "Memory persists indefinitely across every conversation." },
  { label: "It acts.", detail: "Proactive alerts, scheduled reports, and autonomous workflows — not just answers." },
  { label: "It's yours.", detail: "Dedicated hardware, isolated environment, no shared infrastructure." },
  { label: "We maintain it.", detail: "Updates, tuning, and support included in the monthly service." },
];

const onboarding = [
  { step: "01", title: "Discovery Interview", desc: "1–3 hours. Deep dive into your goals, workflows, contacts, data sources, and pain points." },
  { step: "02", title: "Hardware Configuration", desc: "Mac mini set up with our software, messaging integrations, and memory system." },
  { step: "03", title: "Knowledge Base Build", desc: "Industry context, client-specific information, and preferences loaded into the system." },
  { step: "04", title: "Integration Setup", desc: "Accounting software, CRM, calendar, email, and file storage connected." },
  { step: "05", title: "Workflow Build", desc: "Automated reports, scheduled tasks, and alerts configured to your specs." },
  { step: "06", title: "Two-Week Tuning", desc: "Daily adjustments based on real usage and feedback." },
  { step: "07", title: "Handoff & Training", desc: "You learn exactly what to ask, what's automated, and how to get the most out of it." },
];

export default function HomePage() {
  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] border border-[#D4A847]/40 bg-[#D4A847]/8 px-3 py-1.5 rounded mb-8">
            Powered by Claude · Anthropic
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#0D0D0D] leading-[1.08] mb-6">
            Your Life. Your Work.<br />
            <span className="text-[#0F1B3C]">An AI That Knows It.</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#6B6B6B] leading-relaxed max-w-2xl mb-4">
            This is not a chatbot subscription. It is a configured, persistent AI system that lives on dedicated hardware, accumulates institutional memory, and becomes more valuable over time.
          </p>
          <p className="text-lg text-[#6B6B6B] leading-relaxed max-w-2xl mb-10">
            Think of it as hiring a tireless assistant who already knows your business, your schedule, your industry, and your goals — <em>on day one.</em>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white px-7 py-3.5 rounded font-medium text-[15px]"
            >
              View Pricing <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 border border-[#E2E0DA] hover:border-[#0D0D0D] text-[#0D0D0D] px-7 py-3.5 rounded font-medium text-[15px]"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PROOF BAR ─── */}
      <div className="border-y border-[#E2E0DA] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap gap-x-10 gap-y-3 items-center">
          {[
            "Built on Claude by Anthropic",
            "Dedicated hardware per client",
            "Setup in 48–72 hours",
            "88–90% gross margin for clients who resell",
            "Version 2.0 — April 2026",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2 text-[12px] text-[#6B6B6B]">
              <Check size={12} className="text-[#B8902A]" strokeWidth={2.5} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── THE PROBLEM ─── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="mb-14">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">The Problem</p>
          <h2 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] mb-5">
            The gap isn&apos;t better AI.<br />It&apos;s setup and configuration.
          </h2>
          <p className="text-[#6B6B6B] text-lg max-w-2xl">
            Off-the-shelf AI tools are generic. They don&apos;t know you. They don&apos;t remember yesterday. They don&apos;t proactively help. They just answer questions when asked. We remove that barrier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((p) => (
            <div key={p.audience} className="bg-white border border-[#E2E0DA] rounded-lg p-7">
              <h3 className="text-[11px] font-semibold tracking-widest uppercase text-[#0F1B3C] mb-5">{p.audience}</h3>
              <ul className="space-y-3">
                {p.points.map((pt) => (
                  <li key={pt} className="text-[14px] text-[#444] leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-[#D4A847]">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHAT YOU GET ─── */}
      <section className="bg-[#0F1B3C] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-3">Every Client Gets</p>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-14">
            A complete system, not a subscription.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliverables.map((d) => (
              <div key={d.title} className="border border-white/10 rounded-lg p-6 hover:border-[#D4A847]/40 transition-colors">
                <h3 className="text-white font-semibold text-[15px] mb-2">{d.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT MAKES IT DIFFERENT ─── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">The Difference</p>
            <h2 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] mb-6">
              Why this is different from everything else.
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">
              We built this for a $25M energy services company. It works. We are the proof of concept. We have the hardware setup, the software stack, the configuration process, and the operational playbook.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed">
              Now we scale it to everyone else.
            </p>
            <Link href="/services" className="inline-flex items-center gap-2 text-[#0F1B3C] font-medium text-sm mt-8 hover:gap-3 transition-all">
              See full service breakdown <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-6">
            {differentiators.map((d) => (
              <div key={d.label} className="flex gap-5 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B8902A] mt-2 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-[#0D0D0D]">{d.label}</span>{" "}
                  <span className="text-[#6B6B6B]">{d.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-white border-y border-[#E2E0DA] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">The Process</p>
          <h2 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] mb-14">
            From intake to live in 48–72 hours.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {onboarding.map((s) => (
              <div key={s.step}>
                <div className="text-4xl font-black text-[#E2E0DA] mb-4 font-display">{s.step}</div>
                <h3 className="font-semibold text-[#0D0D0D] mb-2">{s.title}</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Who It&apos;s For</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] mb-5">
          No client is too small or too large.
        </h2>
        <p className="text-[#6B6B6B] text-lg max-w-2xl mb-12">
          A college student managing internship applications and coursework needs this just as much as a $10M business owner managing 20 employees. The configuration is different. The value is the same.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              tier: "Tier A — Business",
              range: "$2M – $50M revenue",
              desc: "CFO functions, operations dashboards, KPI monitoring, financial reporting, vendor management, and industry-specific automation.",
              plan: "Business Standard or Premium",
            },
            {
              tier: "Tier B — Professionals",
              range: "Real estate · Legal · Finance · Medicine",
              desc: "Admin automation, client management, research, scheduling, and communication support. Recover your billable hours.",
              plan: "Professional Plan",
            },
            {
              tier: "Tier C — Individuals",
              range: "Students · Creators · Executives",
              desc: "Personal briefings, research, health tracking, goal management, and proactive scheduling. Your life, organized.",
              plan: "Personal Plan",
            },
          ].map((t) => (
            <div key={t.tier} className="bg-white border border-[#E2E0DA] rounded-lg p-7 flex flex-col">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-2">{t.tier}</p>
              <p className="text-[12px] text-[#6B6B6B] mb-4">{t.range}</p>
              <p className="text-sm text-[#444] leading-relaxed mb-6 flex-1">{t.desc}</p>
              <p className="text-[12px] font-semibold text-[#0F1B3C] border-t border-[#E2E0DA] pt-4">→ {t.plan}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[#F8F7F3] border-t border-[#E2E0DA]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28 text-center">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-4">Get Started</p>
          <h2 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] mb-5 max-w-2xl mx-auto">
            The window to establish this is open now.
          </h2>
          <p className="text-[#6B6B6B] text-lg max-w-xl mx-auto mb-10">
            In 24–36 months, everyone will have an AI assistant. The clients who get set up properly now will have a compounding advantage over those who wait.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white px-8 py-4 rounded font-medium text-[15px]">
              See Pricing <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-[#E2E0DA] hover:border-[#0D0D0D] text-[#0D0D0D] px-8 py-4 rounded font-medium text-[15px]">
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
