import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const onboarding = [
  { n: "01", title: "Discovery Interview", time: "1–3 hrs", desc: "Deep dive into goals, workflows, contacts, pain points, and data sources. This is where we learn your world." },
  { n: "02", title: "Hardware Configuration", time: "2–4 hrs", desc: "Mac mini set up with OpenClaw, messaging integrations, and the full memory system." },
  { n: "03", title: "Knowledge Base Build", time: "3–5 hrs", desc: "Industry context, client-specific information, contacts, and preferences loaded into the system." },
  { n: "04", title: "Integration Setup", time: "2–4 hrs", desc: "Accounting software, CRM, calendar, email, and file storage connected and tested." },
  { n: "05", title: "Report & Workflow Build", time: "3–6 hrs", desc: "Automated reports, cron jobs, and alerts configured to your specifications." },
  { n: "06", title: "Two-Week Tuning Period", time: "Ongoing", desc: "Daily adjustments based on real usage and your feedback. This is where it gets good." },
  { n: "07", title: "Handoff & Training", time: "1–2 hrs", desc: "You learn how to interact with it, what's automated, and how to get the most out of the system." },
];

const capabilities = [
  {
    category: "Communication",
    items: [
      "WhatsApp, iMessage, Discord, and email integration",
      "Responds like a real team member — not a chatbot prompt",
      "Voice note transcription and response (WhatsApp)",
      "Group chat participation (where enabled)",
    ],
  },
  {
    category: "Intelligence & Research",
    items: [
      "Live web search and full-page reading",
      "Document analysis (PDF, spreadsheets, contracts)",
      "Market research and competitive analysis",
      "News and industry monitoring on schedule",
    ],
  },
  {
    category: "Financial & Business",
    items: [
      "QuickBooks / Xero reporting automation",
      "Daily P&L and cash flow monitoring",
      "KPI dashboards and weekly reporting",
      "Invoice and vendor tracking",
      "Anomaly detection and proactive alerts",
    ],
  },
  {
    category: "Personal Productivity",
    items: [
      "Daily morning briefings (weather, calendar, news)",
      "Email monitoring and priority filtering",
      "Reminders and deadline tracking",
      "Goal tracking and progress monitoring",
      "Travel and schedule management",
    ],
  },
  {
    category: "Memory & Context",
    items: [
      "Persistent memory across all conversations",
      "Curated long-term knowledge base",
      "Daily activity logs",
      "Contact and relationship memory",
      "Institutional knowledge that compounds over time",
    ],
  },
  {
    category: "Automation",
    items: [
      "Scheduled reports delivered automatically",
      "Cron-based workflows for any recurring task",
      "File delivery to Dropbox, Google Drive, or email",
      "Multi-model routing (cheap for routine, premium for critical)",
      "Custom alert pipelines and trigger conditions",
    ],
  },
];

const ongoing = [
  "Monthly model and software updates applied remotely",
  "New integrations added as your needs evolve",
  "Regular check-ins to audit and improve workflows",
  "Token usage monitoring to keep API costs optimized",
  "Priority support response within 24 hours",
];

export default function ServicesPage() {
  return (
    <div>
      {/* Header */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-14">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Services</p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#0D0D0D] mb-5">
          What we build.<br />What you get.
        </h1>
        <p className="text-[#6B6B6B] text-lg max-w-2xl">
          A fully configured AI assistant, running on dedicated hardware, customized to each client through a structured onboarding process. The AI learns your world during setup and keeps learning through every interaction.
        </p>
      </section>

      {/* Onboarding process */}
      <section className="bg-white border-y border-[#E2E0DA] py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">The Onboarding Process</p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#0D0D0D] mb-14">Every client. Every time.</h2>

          <div className="space-y-0">
            {onboarding.map((s, i) => (
              <div
                key={s.n}
                className={`flex gap-5 sm:gap-8 items-start py-7 sm:py-8 ${i !== onboarding.length - 1 ? 'border-b border-[#E2E0DA]' : ''}`}
              >
                <div className="w-12 flex-shrink-0">
                  <span className="font-display text-2xl text-[#E2E0DA]">{s.n}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-[#0D0D0D]">{s.title}</h3>
                    <span className="text-[11px] font-medium text-[#B8902A] bg-[#D4A847]/10 px-2.5 py-1 rounded flex-shrink-0">{s.time}</span>
                  </div>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Capabilities</p>
        <h2 className="font-display text-3xl sm:text-4xl text-[#0D0D0D] mb-14">What your assistant can do.</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div key={cap.category} className="bg-white border border-[#E2E0DA] rounded-lg p-6">
              <h3 className="text-[11px] font-semibold tracking-widest uppercase text-[#0F1B3C] mb-5">{cap.category}</h3>
              <ul className="space-y-2.5">
                {cap.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-[#444] leading-relaxed">
                    <Check size={13} className="text-[#B8902A] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Ongoing service */}
      <section className="bg-[#0F1B3C] py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-3">Ongoing Service</p>
              <h2 className="font-display text-3xl sm:text-4xl text-white mb-5">
                We don&apos;t hand it off and disappear.
              </h2>
              <p className="text-white/60 leading-relaxed">
                Every month we apply model updates, tune workflows, add integrations as your needs evolve, and monitor API costs. Your assistant gets better over time — not stale.
              </p>
            </div>
            <div className="space-y-4">
              {ongoing.map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <Check size={14} className="text-[#D4A847] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-white/80 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hardware */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">The Hardware</p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#0D0D0D] mb-5">Your AI lives on its own machine.</h2>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">
              Every client gets a dedicated Mac mini — configured and shipped. Your AI runs 24/7 on hardware you own. Data never touches shared cloud infrastructure. Nothing is pooled with other clients. Nothing is rented.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed">
              This is a meaningful privacy and performance advantage. Your assistant isn&apos;t throttled by other users. Your data isn&apos;t subject to another company&apos;s retention policies. And when you cancel, you keep the hardware.
            </p>
          </div>
          <div className="bg-white border border-[#E2E0DA] rounded-lg p-7 space-y-5">
            {[
              { label: "Hardware", value: "Mac mini M4 (16GB RAM, 256GB SSD)" },
              { label: "Software", value: "OpenClaw gateway + Claude API" },
              { label: "Channels", value: "WhatsApp, iMessage, Discord, Email" },
              { label: "Memory", value: "Persistent across all conversations" },
              { label: "Updates", value: "Applied remotely, monthly" },
              { label: "Data location", value: "On your machine. Nowhere else." },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-start gap-4 border-b border-[#F0EDE7] pb-5 last:border-0 last:pb-0">
                <span className="text-[12px] font-semibold tracking-wide uppercase text-[#6B6B6B]">{row.label}</span>
                <span className="text-sm text-[#0D0D0D] text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E2E0DA] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl text-[#0D0D0D] mb-1">Ready to see pricing?</h2>
            <p className="text-[#6B6B6B] text-sm">Four tiers. Real numbers. No hidden costs.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/pricing" className="inline-flex items-center gap-2 bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white px-6 py-3 rounded font-medium text-sm">
              View Pricing <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-[#E2E0DA] hover:border-[#0D0D0D] text-[#0D0D0D] px-6 py-3 rounded font-medium text-sm">
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
