import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const onboarding = [
  { n: "01", title: "Discovery Interview",    time: "1–3 hrs",  desc: "Deep dive into your goals, workflows, contacts, pain points, and data sources. This is where we learn your world." },
  { n: "02", title: "Hardware Configuration", time: "2–4 hrs",  desc: "Mac mini M4 set up with OpenClaw, messaging integrations, and the full memory system." },
  { n: "03", title: "Knowledge Base Build",   time: "3–5 hrs",  desc: "Industry context, client-specific information, contacts, and preferences loaded into the system." },
  { n: "04", title: "Integration Setup",      time: "2–4 hrs",  desc: "Accounting software, CRM, calendar, email, and file storage connected and tested." },
  { n: "05", title: "Workflow Build",         time: "3–6 hrs",  desc: "Automated reports, scheduled tasks, and alerts configured to your specifications." },
  { n: "06", title: "Two-Week Tuning",        time: "Ongoing",  desc: "Daily adjustments based on real usage and your feedback. This is where it gets good." },
  { n: "07", title: "Handoff & Training",     time: "1–2 hrs",  desc: "You learn how to interact with it, what's automated, and how to get the most out of the system." },
];

const capabilities = [
  { category: "Communication", items: [
    "WhatsApp, iMessage, Discord, and email integration",
    "Responds like a real team member — not a chatbot",
    "Voice note transcription and response",
    "Group chat participation where enabled",
  ]},
  { category: "Intelligence & Research", items: [
    "Live web search and full-page reading",
    "Document analysis (PDF, spreadsheets, contracts)",
    "Market research and competitive analysis",
    "News and industry monitoring on schedule",
  ]},
  { category: "Financial & Business", items: [
    "QuickBooks / Xero reporting automation",
    "Daily P&L and cash flow monitoring",
    "KPI dashboards and weekly reporting",
    "Invoice and vendor tracking",
    "Anomaly detection and proactive alerts",
  ]},
  { category: "Personal Productivity", items: [
    "Daily morning briefings (weather, calendar, news)",
    "Email monitoring and priority filtering",
    "Deadline tracking and reminders",
    "Goal and progress monitoring",
    "Travel and schedule management",
  ]},
  { category: "Memory & Context", items: [
    "Persistent memory across all conversations",
    "Curated long-term knowledge base",
    "Daily activity logs",
    "Contact and relationship memory",
    "Institutional knowledge that compounds",
  ]},
  { category: "Automation", items: [
    "Scheduled reports delivered automatically",
    "Recurring workflow automation",
    "File delivery to Dropbox, Drive, or email",
    "Multi-model routing (fast for routine, premium for critical)",
    "Custom alert pipelines and triggers",
  ]},
];

const ongoing = [
  "Monthly model and software updates applied remotely",
  "New integrations added as your needs evolve",
  "Regular audits to improve workflows",
  "Token usage monitoring to keep API costs optimized",
  "Priority support response within 24 hours",
];

export default function ServicesPage() {
  return (
    <div className="bg-white text-[#0a0a0a]">

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-20 pb-16">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">Services</p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight mb-5">
          What we build.<br />
          <span className="text-[#9b9b9b]">What you get.</span>
        </h1>
        <p className="text-[#6b6b6b] text-[17px] max-w-2xl leading-relaxed">
          A fully configured AI assistant on dedicated hardware, customized through a structured onboarding process. It learns your world during setup and keeps learning through every interaction.
        </p>
      </section>

      {/* Onboarding */}
      <section className="border-t border-[#e8e8e8] bg-[#f7f7f7] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">The Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-14">Every client. Every time.</h2>
          <div className="space-y-0">
            {onboarding.map((s, i) => (
              <div key={s.n} className={`flex gap-6 sm:gap-10 items-start py-7 ${i !== onboarding.length - 1 ? "border-b border-[#e8e8e8]" : ""}`}>
                <div className="w-10 flex-shrink-0">
                  <span className="font-mono text-[13px] text-[#9b9b9b]">{s.n}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-[#0a0a0a] text-[15px]">{s.title}</h3>
                    <span className="text-[11px] font-semibold text-[#0066ff] bg-[#f0f5ff] px-2.5 py-1 rounded-md flex-shrink-0">{s.time}</span>
                  </div>
                  <p className="text-[14px] text-[#6b6b6b] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20 md:py-24">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">Capabilities</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-14">What your assistant can do.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap) => (
            <div key={cap.category} className="bg-white border border-[#e8e8e8] rounded-xl p-6">
              <h3 className="text-[11px] font-semibold tracking-widests uppercase text-[#0066ff] mb-5">{cap.category}</h3>
              <ul className="space-y-2.5">
                {cap.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] text-[#6b6b6b] leading-relaxed">
                    <Check size={12} className="text-[#0066ff] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Ongoing */}
      <section className="border-t border-[#e8e8e8] bg-[#0a0a0a] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b9bff] mb-4">Ongoing Service</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight">
                We don&apos;t hand it off<br />and disappear.
              </h2>
              <p className="text-white/40 leading-relaxed text-[15px]">
                Every month we apply model updates, tune workflows, add integrations as your needs evolve, and monitor API costs. Your assistant gets better over time — not stale.
              </p>
            </div>
            <div className="space-y-4">
              {ongoing.map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <Check size={13} className="text-[#6b9bff] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-white/60 text-[14px] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hardware */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">The Hardware</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
              Your AI lives<br />on its own machine.
            </h2>
            <p className="text-[#6b6b6b] leading-relaxed mb-4 text-[15px]">
              Every client gets a dedicated Mac mini — configured and shipped. Your AI runs 24/7 on hardware you own. Data never touches shared cloud infrastructure. Nothing pooled with other clients.
            </p>
            <p className="text-[#6b6b6b] leading-relaxed text-[15px]">
              When you cancel, you keep the hardware. Your assistant keeps running as long as you have Anthropic credits.
            </p>
          </div>
          <div className="bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl p-7 space-y-5">
            {[
              { label: "Hardware",       value: "Mac mini M4 (16GB RAM, 256GB SSD)" },
              { label: "Software",       value: "OpenClaw gateway + Claude API" },
              { label: "Channels",       value: "WhatsApp, iMessage, Discord, Email" },
              { label: "Memory",         value: "Persistent across all conversations" },
              { label: "Updates",        value: "Applied remotely, monthly" },
              { label: "Data location",  value: "On your machine. Nowhere else." },
            ].map((row, i, arr) => (
              <div key={row.label} className={`flex justify-between items-start gap-4 ${i !== arr.length - 1 ? "pb-5 border-b border-[#e8e8e8]" : ""}`}>
                <span className="text-[12px] font-semibold tracking-wide uppercase text-[#9b9b9b]">{row.label}</span>
                <span className="text-[13px] text-[#0a0a0a] text-right font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#e8e8e8] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Ready to see pricing?</h2>
            <p className="text-white/40 text-[14px]">One setup fee. Monthly maintenance. No surprises.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/pricing"
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-[#0a0a0a] px-6 py-3 rounded-lg font-semibold text-[14px]">
              View Pricing <ArrowRight size={14} />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white/60 hover:text-white px-6 py-3 rounded-lg font-medium text-[14px]">
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
