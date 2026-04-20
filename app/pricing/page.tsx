import Link from "next/link";
import { Check, ArrowRight, Clock } from "lucide-react";

const plans = [
  {
    name: "Basic",
    monthly: "100",
    tagline: "Your assistant stays alive and current.",
    features: [
      "Keep-alive monitoring — assistant stays running 24/7",
      "Monthly software and model updates",
      "Security patches applied remotely",
      "Minimal interaction support",
      "Email support for issues",
    ],
    cta: "Get Basic",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: "250",
    tagline: "Active optimization and hands-on support.",
    features: [
      "Everything in Basic",
      "Workflow optimization and tuning",
      "New skills and capability additions",
      "Multi-modal LLM configuration",
      "2 hours of dedicated support per month",
      "Priority response within 24 hours",
    ],
    cta: "Get Pro",
    highlight: true,
  },
];

const setupIncludes = [
  "Initial discovery consultation (1–3 hours)",
  "Dedicated Mac mini M4 — configured and shipped",
  "Full software installation and gateway setup",
  "Custom knowledge base built from your intake form",
  "Channel integrations (WhatsApp, Discord, Email)",
  "Scheduled workflows and automated reports",
  "2 months of Pro-level support included",
  "Handoff session and usage walkthrough",
];

const compTable = [
  { factor: "Knows the client deeply", us: "✓  Built via discovery", generic: "✗  Stateless", traditional: "✓  But expensive" },
  { factor: "Persistent memory", us: "✓  Indefinitely", generic: "✗  Session-only", traditional: "Partial" },
  { factor: "Proactive & autonomous", us: "✓  Cron jobs, alerts", generic: "✗  Reactive only", traditional: "✗  Billed hourly" },
  { factor: "Dedicated hardware", us: "✓  You own it", generic: "✗  Shared cloud", traditional: "N/A" },
  { factor: "Available 24/7", us: "✓", generic: "✓", traditional: "✗" },
  { factor: "Monthly cost", us: "$100–$250/mo", generic: "$20–200/mo (no config)", traditional: "$5,000–30,000/mo" },
];

const faqs = [
  {
    q: "What's included in the $2,500 setup fee?",
    a: "Everything needed to go from zero to a live assistant: discovery consultation, a dedicated Mac mini M4 configured and shipped to you, full software installation, your custom knowledge base, channel integrations, automated workflows, and 2 months of Pro-level support. After those 2 months you move to Basic or Pro.",
  },
  {
    q: "What's the difference between Basic and Pro?",
    a: "Basic keeps your assistant running and up to date — software updates, security patches, and monitoring. Pro adds active optimization: new skills, workflow improvements, LLM tuning, and 2 hours of hands-on support each month. Most clients start on Pro and drop to Basic once they're dialed in.",
  },
  {
    q: "When would I use the hourly rate?",
    a: "For larger projects outside the monthly scope — building a custom integration, setting up a new data source, on-site configuration, or a significant workflow rebuild. Billed in 15-minute increments at $125/hr. Remote work is standard; on-site is the same rate plus travel.",
  },
  {
    q: "What are API credits and what do they cost?",
    a: "Your assistant uses Claude by Anthropic to think and respond. You pay Anthropic directly — typically $50–150/month depending on usage. We help you set up your account. This is separate from the monthly service fee.",
  },
  {
    q: "Who owns the hardware?",
    a: "You do. The Mac mini is shipped to you and it's yours permanently. Your data lives on your machine. We configure and maintain it remotely — we don't have access to your conversations.",
  },
  {
    q: "Can I cancel?",
    a: "Yes, any time. Monthly billing only — no contracts. Your assistant keeps running as long as you have Anthropic credits. The Mac mini stays with you.",
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-14">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Pricing</p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] mb-5">
          Simple pricing.<br />No surprises.
        </h1>
        <p className="text-[#6B6B6B] text-lg max-w-2xl">
          One setup fee to get everything built and running. A small monthly fee to keep it sharp. Hourly for anything bigger.
        </p>
      </section>

      {/* Setup fee — featured */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-10">
        <div className="bg-[#0F1B3C] rounded-lg p-7 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-3">One-Time</p>
              <div className="flex items-end gap-3 mb-3">
                <span className="font-display text-5xl sm:text-6xl text-white">$2,500</span>
                <span className="text-white/50 mb-2">setup</span>
              </div>
              <p className="text-white/70 leading-relaxed mb-6">
                Everything you need to go from zero to a fully working AI assistant — hardware, configuration, knowledge base, integrations, and 2 months of Pro support included.
              </p>
              <Link
                href="/intake"
                className="inline-flex items-center gap-2 bg-[#D4A847] hover:bg-[#c49a30] text-[#0F1B3C] px-6 py-3 rounded font-semibold text-sm transition-colors"
              >
                Start Intake Form <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {setupIncludes.map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <Check size={14} className="text-[#D4A847] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-white/80 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Monthly plans */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-10">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-6">Monthly Plans — after setup</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg flex flex-col bg-white border transition-shadow hover:shadow-md ${
                plan.highlight
                  ? "border-[#0F1B3C] ring-1 ring-[#0F1B3C]/10 shadow-sm"
                  : "border-[#E2E0DA]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F1B3C] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <div className="p-6 border-b border-[#E2E0DA]">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">{plan.name}</p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-3xl font-black text-[#0D0D0D]">${plan.monthly}</span>
                  <span className="text-sm text-[#6B6B6B] mb-0.5">/mo</span>
                </div>
                <p className="text-[12px] text-[#6B6B6B]">{plan.tagline}</p>
              </div>
              <div className="p-6 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[13px] text-[#444] leading-relaxed">
                      <Check size={13} className="text-[#B8902A] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0">
                <Link
                  href="/intake"
                  className={`flex items-center justify-center gap-2 py-3 rounded text-sm font-medium w-full transition-colors ${
                    plan.highlight
                      ? "bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white"
                      : "border border-[#0F1B3C] text-[#0F1B3C] hover:bg-[#0F1B3C] hover:text-white"
                  }`}
                >
                  {plan.cta} <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hourly rate */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="bg-white border border-[#E2E0DA] rounded-lg p-7 max-w-2xl">
          <div className="flex items-start gap-5">
            <div className="w-10 h-10 rounded-lg bg-[#F8F7F3] border border-[#E2E0DA] flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-[#0F1B3C]" />
            </div>
            <div className="flex-1">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-black text-[#0D0D0D]">$125</span>
                <span className="text-sm text-[#6B6B6B] mb-0.5">/hr · billed in 15-min increments</span>
              </div>
              <p className="text-[11px] font-semibold tracking-widests uppercase text-[#B8902A] mb-3">Hourly Work</p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">
                For work outside the monthly scope — custom integrations, new data sources, significant workflow rebuilds, or anything that needs dedicated time. Remote via Tailscale is standard. On-site available at the same rate plus travel.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Custom integrations", "On-site configuration", "Workflow rebuilds", "New data sources", "Training sessions"].map((t) => (
                  <span key={t} className="text-[11px] text-[#444] bg-[#F8F7F3] border border-[#E2E0DA] px-2.5 py-1 rounded">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Table */}
      <section className="bg-white border-y border-[#E2E0DA] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Competitive Advantage</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#0D0D0D] mb-3">How we stack up.</h2>
          <p className="text-[#6B6B6B] mb-8 max-w-2xl text-sm sm:text-base">
            White-glove setup, persistent memory, and dedicated hardware are not Google or Microsoft products. They never will be.
          </p>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {compTable.map((row) => (
              <div key={row.factor} className="bg-white border border-[#E2E0DA] rounded-lg p-4">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#0D0D0D] mb-3">{row.factor}</p>
                <div className="space-y-2">
                  {[["Clarix", row.us, true], ["ChatGPT", row.generic, false], ["Consultants", row.traditional, false]].map(([label, val, gold]) => (
                    <div key={String(label)} className="flex justify-between items-start gap-3">
                      <span className={`text-[11px] font-semibold uppercase tracking-wide w-20 flex-shrink-0 ${gold ? 'text-[#B8902A]' : 'text-[#6B6B6B]'}`}>{label}</span>
                      <span className={`text-sm text-right ${gold ? 'text-[#B8902A] font-medium' : 'text-[#6B6B6B]'}`}>{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[640px] w-full">
              <thead>
                <tr className="bg-[#0F1B3C]">
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-white/70 px-5 py-3 w-1/4">Factor</th>
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] px-5 py-3 w-1/4">Clarix</th>
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-white/70 px-5 py-3 w-1/4">Generic AI</th>
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-white/70 px-5 py-3 w-1/4">Traditional Consultants</th>
                </tr>
              </thead>
              <tbody>
                {compTable.map((row, i) => (
                  <tr key={row.factor} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F7F3]'}>
                    <td className="px-5 py-3.5 text-sm font-medium text-[#0D0D0D] border-b border-[#E2E0DA]">{row.factor}</td>
                    <td className="px-5 py-3.5 text-sm text-[#B8902A] font-medium border-b border-[#E2E0DA]">{row.us}</td>
                    <td className="px-5 py-3.5 text-sm text-[#6B6B6B] border-b border-[#E2E0DA]">{row.generic}</td>
                    <td className="px-5 py-3.5 text-sm text-[#6B6B6B] border-b border-[#E2E0DA]">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">FAQ</p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#0D0D0D] mb-10">Common questions.</h2>
        <div className="max-w-3xl space-y-0">
          {faqs.map((faq, i, arr) => (
            <div key={faq.q} className={`py-6 ${i !== arr.length - 1 ? 'border-b border-[#E2E0DA]' : ''}`}>
              <h3 className="font-semibold text-[#0D0D0D] mb-2 text-sm">{faq.q}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E2E0DA] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl text-[#0D0D0D] mb-1">Ready to get started?</h2>
            <p className="text-[#6B6B6B] text-sm">Fill out the intake form and we'll follow up within 24 hours.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/intake" className="inline-flex items-center gap-2 bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white px-6 py-3 rounded font-medium text-sm">
              Start Intake Form <ArrowRight size={14} />
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
