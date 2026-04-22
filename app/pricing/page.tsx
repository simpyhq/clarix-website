import Link from "next/link";
import { Check, ArrowRight, Clock } from "lucide-react";

const setupIncludes = [
  "Initial discovery consultation (1–3 hours)",
  "Dedicated Mac mini M4 — configured and shipped to you",
  "Full software installation and gateway setup",
  "Custom knowledge base built from your intake form",
  "Channel integrations (WhatsApp, iMessage, Discord, email)",
  "Scheduled workflows and automated reports",
  "2 months of Pro-level support included",
  "Handoff session and usage walkthrough",
];

const plans = [
  {
    name: "Basic",
    price: "$100",
    freq: "/mo",
    tagline: "Keep your assistant running and current.",
    featured: false,
    items: [
      "24/7 keep-alive monitoring",
      "Monthly software and model updates",
      "Security patches applied remotely",
      "Email support for issues",
    ],
  },
  {
    name: "Pro",
    price: "$250",
    freq: "/mo",
    tagline: "Active optimization and hands-on support.",
    featured: true,
    items: [
      "Everything in Basic",
      "Workflow optimization and tuning",
      "New skills and capability additions",
      "Multi-model LLM configuration",
      "2 hrs dedicated support/month",
      "Priority response within 24 hours",
    ],
  },
];

const compTable = [
  { factor: "Knows you deeply",      us: "✓ Built via discovery",     generic: "✗ Stateless",          trad: "✓ But expensive" },
  { factor: "Persistent memory",     us: "✓ Indefinitely",            generic: "✗ Session only",        trad: "Partial" },
  { factor: "Proactive & autonomous",us: "✓ Cron jobs, alerts",       generic: "✗ Reactive only",       trad: "✗ Billed hourly" },
  { factor: "Dedicated hardware",    us: "✓ You own it",              generic: "✗ Shared cloud",        trad: "N/A" },
  { factor: "Available 24/7",        us: "✓",                         generic: "✓",                     trad: "✗" },
  { factor: "Monthly cost",          us: "$100–$250/mo",              generic: "$20–200/mo (no config)", trad: "$5K–30K/mo" },
];

const faqs = [
  { q: "What's included in the $2,500 setup fee?",     a: "Everything to go from zero to live: discovery consultation, a dedicated Mac mini M4 configured and shipped to you, full software setup, custom knowledge base, channel integrations, automated workflows, and 2 months of Pro support. After that you move to Basic or Pro." },
  { q: "What's the difference between Basic and Pro?", a: "Basic keeps your assistant running and up to date. Pro adds active optimization: new skills, workflow improvements, LLM tuning, and 2 hours of hands-on support each month. Most clients start on Pro and drop to Basic once they're dialed in." },
  { q: "When would I use the hourly rate?",            a: "For larger projects outside monthly scope — custom integrations, significant workflow rebuilds, new data sources, or on-site configuration. Billed in 15-minute increments at $125/hr." },
  { q: "What are API credits?",                        a: "Your assistant uses Claude by Anthropic. You pay Anthropic directly — typically $50–150/month depending on usage. We help you set up the account. Separate from the monthly service fee." },
  { q: "Who owns the hardware?",                       a: "You do. The Mac mini ships to you and is yours permanently. Your data lives on your machine. We configure and maintain it remotely." },
  { q: "Can I cancel?",                                a: "Yes, any time. Monthly billing only — no contracts. Your assistant keeps running as long as you have Anthropic credits. The Mac mini stays with you." },
];

export default function PricingPage() {
  return (
    <div className="bg-white text-[#0a0a0a]">

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-20 pb-16">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">Pricing</p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight mb-5">
          Simple pricing.<br />
          <span className="text-[#9b9b9b]">No surprises.</span>
        </h1>
        <p className="text-[#6b6b6b] text-[17px] max-w-xl leading-relaxed">
          One setup fee to get everything built and running. A small monthly fee to keep it sharp. Hourly for anything bigger.
        </p>
      </section>

      {/* Setup fee */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-10">
        <div className="bg-[#0a0a0a] rounded-xl p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b9bff] mb-4">One-Time Setup</p>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl sm:text-6xl font-bold text-white">$2,500</span>
                <span className="text-white/40 mb-2 text-[15px]">one-time</span>
              </div>
              <p className="text-white/50 leading-relaxed mb-7 text-[15px]">
                Everything you need to go from zero to a fully working AI assistant — hardware, configuration, knowledge base, integrations, and 2 months of Pro support.
              </p>
              <Link href="/intake"
                className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-[#0a0a0a] px-6 py-3 rounded-lg font-semibold text-[14px]">
                Start Intake Form <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {setupIncludes.map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <Check size={13} className="text-[#6b9bff] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-white/60 text-[13px] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Monthly plans */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-10">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-6">Monthly Plans — after setup</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
          {plans.map((plan) => (
            <div key={plan.name}
              className={`relative rounded-xl flex flex-col border ${
                plan.featured
                  ? "bg-[#0a0a0a] border-[#0a0a0a] text-white"
                  : "bg-white border-[#e8e8e8] text-[#0a0a0a]"
              }`}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066ff] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <div className={`p-6 border-b ${plan.featured ? "border-white/10" : "border-[#e8e8e8]"}`}>
                <p className={`text-[11px] font-semibold tracking-widests uppercase mb-3 ${plan.featured ? "text-[#6b9bff]" : "text-[#0066ff]"}`}>{plan.name}</p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className={`text-[13px] mb-0.5 ${plan.featured ? "text-white/40" : "text-[#9b9b9b]"}`}>{plan.freq}</span>
                </div>
                <p className={`text-[12px] ${plan.featured ? "text-white/40" : "text-[#9b9b9b]"}`}>{plan.tagline}</p>
              </div>
              <div className="p-6 flex-1">
                <ul className="space-y-3">
                  {plan.items.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[13px] leading-relaxed">
                      <Check size={13} className={`flex-shrink-0 mt-0.5 ${plan.featured ? "text-[#6b9bff]" : "text-[#0066ff]"}`} strokeWidth={2.5} />
                      <span className={plan.featured ? "text-white/60" : "text-[#6b6b6b]"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0">
                <Link href="/intake"
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold w-full ${
                    plan.featured
                      ? "bg-white text-[#0a0a0a] hover:bg-white/90"
                      : "bg-[#0a0a0a] text-white hover:bg-[#222]"
                  }`}>
                  Get started <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hourly */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-20">
        <div className="bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl p-7 max-w-2xl">
          <div className="flex items-start gap-5">
            <div className="w-10 h-10 rounded-lg bg-white border border-[#e8e8e8] flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-[#0a0a0a]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-widests uppercase text-[#0066ff] mb-2">Hourly Work</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-2xl font-bold text-[#0a0a0a]">$125</span>
                <span className="text-[13px] text-[#9b9b9b] mb-0.5">/hr · billed in 15-min increments</span>
              </div>
              <p className="text-[13px] text-[#6b6b6b] leading-relaxed mb-4">
                For work outside the monthly scope — custom integrations, significant workflow rebuilds, new data sources, or on-site configuration. Remote is standard; on-site at same rate plus travel.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Custom integrations", "On-site configuration", "Workflow rebuilds", "New data sources", "Training sessions"].map((t) => (
                  <span key={t} className="text-[11px] text-[#6b6b6b] bg-white border border-[#e8e8e8] px-2.5 py-1 rounded-md">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-t border-[#e8e8e8] bg-[#f7f7f7] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">Competitive Advantage</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-10">How we stack up.</h2>
          <div className="overflow-x-auto rounded-xl border border-[#e8e8e8]">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="bg-[#0a0a0a]">
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-white/50 px-5 py-3.5 w-1/4">Factor</th>
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-[#6b9bff] px-5 py-3.5 w-1/4">Clarix</th>
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-white/50 px-5 py-3.5 w-1/4">Generic AI</th>
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-white/50 px-5 py-3.5 w-1/4">Consultants</th>
                </tr>
              </thead>
              <tbody>
                {compTable.map((row, i) => (
                  <tr key={row.factor} className={i % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-[#0a0a0a] border-b border-[#e8e8e8]">{row.factor}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#0066ff] font-medium border-b border-[#e8e8e8]">{row.us}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#9b9b9b] border-b border-[#e8e8e8]">{row.generic}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#9b9b9b] border-b border-[#e8e8e8]">{row.trad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-20 md:py-24">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">FAQ</p>
        <h2 className="text-3xl font-bold tracking-tight mb-12">Common questions.</h2>
        {faqs.map((faq, i) => (
          <div key={faq.q} className={`py-6 ${i !== faqs.length - 1 ? "border-b border-[#e8e8e8]" : ""}`}>
            <h3 className="font-semibold text-[#0a0a0a] mb-2 text-[15px]">{faq.q}</h3>
            <p className="text-[14px] text-[#6b6b6b] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </section>

      {/* CTA bar */}
      <section className="border-t border-[#e8e8e8] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Ready to get started?</h2>
            <p className="text-white/40 text-[14px]">Fill out the intake form and we'll follow up within 24 hours.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/intake"
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-[#0a0a0a] px-6 py-3 rounded-lg font-semibold text-[14px]">
              Start Intake Form <ArrowRight size={14} />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white/70 hover:text-white px-6 py-3 rounded-lg font-medium text-[14px]">
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
