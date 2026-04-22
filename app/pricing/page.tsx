import Link from "next/link";
import { Check, ArrowRight, Clock } from "lucide-react";
import { Reveal } from "@/components/Reveal";

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
    name: "Basic", price: "$100", freq: "/mo",
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
    name: "Pro", price: "$250", freq: "/mo",
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
  { factor: "Knows you deeply",       us: "✓ Built via discovery",     generic: "✗ Stateless",           trad: "✓ But expensive" },
  { factor: "Persistent memory",      us: "✓ Indefinitely",            generic: "✗ Session only",         trad: "Partial" },
  { factor: "Proactive & autonomous", us: "✓ Cron jobs, alerts",       generic: "✗ Reactive only",        trad: "✗ Billed hourly" },
  { factor: "Dedicated hardware",     us: "✓ You own it",              generic: "✗ Shared cloud",         trad: "N/A" },
  { factor: "Available 24/7",         us: "✓",                         generic: "✓",                      trad: "✗" },
  { factor: "Monthly cost",           us: "$100–$250/mo",              generic: "$20–200/mo (no config)",  trad: "$5K–30K/mo" },
];

const faqs = [
  { q: "What's included in the $2,500 setup fee?",     a: "Everything to go from zero to live: discovery consultation, a dedicated Mac mini M4 configured and shipped, full software setup, custom knowledge base, channel integrations, automated workflows, and 2 months of Pro support." },
  { q: "What's the difference between Basic and Pro?", a: "Basic keeps your assistant running and up to date. Pro adds active optimization: new skills, workflow improvements, LLM tuning, and 2 hours of hands-on support each month." },
  { q: "When would I use the hourly rate?",            a: "For larger projects outside monthly scope — custom integrations, significant workflow rebuilds, new data sources, or on-site configuration. Billed in 15-minute increments at $125/hr." },
  { q: "What are API credits?",                        a: "Your assistant uses Claude by Anthropic. You pay Anthropic directly — typically $50–150/month depending on usage. Separate from the monthly service fee." },
  { q: "Who owns the hardware?",                       a: "You do. The Mac mini ships to you permanently. Your data lives on your machine. We maintain it remotely." },
  { q: "Can I cancel?",                                a: "Yes, any time. Monthly billing only — no contracts. The Mac mini stays with you." },
];

export default function PricingPage() {
  return (
    <div className="bg-[#0f0f0f] text-[#e8e8e8]">

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-20 pb-16">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] mb-4">Pricing</p>
          <h1 className="text-3xl sm:text-4xl font-medium leading-[1.08] tracking-tight mb-5">
            Simple pricing.<br />
            <span className="text-[#444449]">No surprises.</span>
          </h1>
          <p className="text-[#6b6b72] text-[15px] max-w-xl leading-relaxed">
            One setup fee to get everything built and running. A small monthly fee to keep it sharp. Hourly for anything bigger.
          </p>
        </Reveal>
      </section>

      {/* Setup fee */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-10">
        <Reveal>
          <div className="border border-[#2a2a2e] rounded-xl p-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] mb-4">One-Time Setup</p>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-5xl sm:text-6xl font-bold text-[#e8e8e8]">$2,500</span>
                  <span className="text-[#444449] mb-2 text-[15px]">one-time</span>
                </div>
                <p className="text-[#6b6b72] leading-relaxed mb-7 text-[15px]">
                  Everything you need to go from zero to a fully working AI assistant — hardware, configuration, knowledge base, integrations, and 2 months of Pro support.
                </p>
                <Link href="/intake"
                  className="inline-flex items-center gap-2 bg-[#e8e8e8] hover:bg-white/90 text-[#0f0f0f] px-6 py-3 rounded-lg font-semibold text-[14px]">
                  Start Intake Form <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {setupIncludes.map((item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <Check size={13} className="text-[#5E6AD2] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-[#6b6b72] text-[13px] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Monthly */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-10">
        <Reveal className="mb-6">
          <p className="text-[11px] font-semibold tracking-widests uppercase text-[#5E6AD2]">Monthly Plans — after setup</p>
        </Reveal>
        <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
          {plans.map((plan) => (
            <div key={plan.name}
              className={`relative rounded-xl flex flex-col border ${plan.featured ? "bg-[#e8e8e8] border-[#0a0a0a] text-white" : "bg-[#161618] border-[#2a2a2e]"}`}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066ff] text-white text-[10px] font-bold tracking-widests uppercase px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <div className={`p-6 border-b ${plan.featured ? "border-white/10" : "border-[#2a2a2e]"}`}>
                <p className={`text-[11px] font-semibold tracking-widests uppercase mb-3 ${plan.featured ? "text-[#7c87e8]" : "text-[#5E6AD2]"}`}>{plan.name}</p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className={`text-[13px] mb-0.5 ${plan.featured ? "text-white/40" : "text-[#444449]"}`}>{plan.freq}</span>
                </div>
                <p className={`text-[12px] ${plan.featured ? "text-white/40" : "text-[#444449]"}`}>{plan.tagline}</p>
              </div>
              <div className="p-6 flex-1">
                <ul className="space-y-3">
                  {plan.items.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[13px] leading-relaxed">
                      <Check size={13} className={`flex-shrink-0 mt-0.5 ${plan.featured ? "text-[#7c87e8]" : "text-[#5E6AD2]"}`} strokeWidth={2.5} />
                      <span className={plan.featured ? "text-white/60" : "text-[#6b6b72]"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0">
                <Link href="/intake"
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold w-full ${plan.featured ? "bg-[#0f0f0f] text-[#e8e8e8] hover:bg-[#161618]/90" : "bg-[#e8e8e8] text-white hover:bg-white/90"}`}>
                  Get started <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Hourly */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-20">
        <Reveal>
          <div className="bg-[#161618] border border-[#2a2a2e] rounded-xl p-7 max-w-2xl">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-lg bg-[#161618] border border-[#2a2a2e] flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-[#e8e8e8]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-widests uppercase text-[#5E6AD2] mb-2">Hourly Work</p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-2xl font-bold text-[#e8e8e8]">$125</span>
                  <span className="text-[13px] text-[#444449] mb-0.5">/hr · billed in 15-min increments</span>
                </div>
                <p className="text-[13px] text-[#6b6b72] leading-relaxed mb-4">
                  For work outside monthly scope — custom integrations, workflow rebuilds, new data sources, or on-site configuration.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Custom integrations", "On-site config", "Workflow rebuilds", "New data sources", "Training"].map((t) => (
                    <span key={t} className="text-[11px] text-[#6b6b72] bg-[#161618] border border-[#2a2a2e] px-2.5 py-1 rounded-md">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Comparison */}
      <section className="border-t border-[#2a2a2e] bg-[#161618] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-10">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] mb-4">Competitive Advantage</p>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight">How we stack up.</h2>
          </Reveal>
          <Reveal>
            <div className="overflow-x-auto rounded-xl border border-[#2a2a2e]">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="bg-[#e8e8e8]">
                    <th className="text-left text-[11px] font-semibold tracking-widests uppercase text-white/40 px-5 py-3.5 w-1/4">Factor</th>
                    <th className="text-left text-[11px] font-semibold tracking-widests uppercase text-[#7c87e8] px-5 py-3.5 w-1/4">Clarix</th>
                    <th className="text-left text-[11px] font-semibold tracking-widests uppercase text-white/40 px-5 py-3.5 w-1/4">Generic AI</th>
                    <th className="text-left text-[11px] font-semibold tracking-widests uppercase text-white/40 px-5 py-3.5 w-1/4">Consultants</th>
                  </tr>
                </thead>
                <tbody>
                  {compTable.map((row, i) => (
                    <tr key={row.factor} className={i % 2 === 0 ? "bg-[#161618]" : "bg-[#161618]"}>
                      <td className="px-5 py-3.5 text-[13px] font-medium text-[#e8e8e8] border-b border-[#2a2a2e]">{row.factor}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#5E6AD2] font-medium border-b border-[#2a2a2e]">{row.us}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#444449] border-b border-[#2a2a2e]">{row.generic}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#444449] border-b border-[#2a2a2e]">{row.trad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-20 md:py-24">
        <Reveal className="mb-12">
          <p className="text-[11px] font-semibold tracking-widests uppercase text-[#5E6AD2] mb-4">FAQ</p>
          <h2 className="text-3xl font-bold tracking-tight">Common questions.</h2>
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
      <section className="border-t border-[#2a2a2e] py-14">
        <Reveal>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-medium mb-1">Ready to get started?</h2>
              <p className="text-[#6b6b72] text-[14px]">Fill out the intake form and we&apos;ll follow up within 24 hours.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/intake"
                className="inline-flex items-center gap-2 bg-[#e8e8e8] hover:bg-white/90 text-[#0f0f0f] px-6 py-3 rounded-lg font-semibold text-[14px]">
                Start Intake Form <ArrowRight size={14} />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 border border-[#2a2a2e] hover:border-[#0a0a0a] text-[#e8e8e8] px-6 py-3 rounded-lg font-medium text-[14px]">
                Ask a question
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
