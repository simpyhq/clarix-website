import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    badge: "🟢",
    name: "Personal",
    audience: "Students · Creators · Executives · High-Performers",
    setup: "2,500",
    monthly: "500",
    setupMargin: "~$1,300 (52%)",
    monthlyMargin: "~$425–450 (88%)",
    annualLTV: "~$8,500",
    features: [
      "Dedicated Mac mini — configured and shipped",
      "1–2 hour discovery session (goals, schedule, priorities)",
      "Daily briefings (weather, calendar, news, personalized content)",
      "Email and messaging integration (WhatsApp / iMessage / Discord)",
      "Persistent memory and context across all conversations",
      "Monthly maintenance and model updates",
    ],
    cta: "Get Personal Plan",
  },
  {
    badge: "🔵",
    name: "Professional",
    audience: "Real Estate · Legal · Finance · Consulting · Healthcare",
    setup: "3,500",
    monthly: "750",
    setupMargin: "~$2,000 (57%)",
    monthlyMargin: "~$650–675 (89%)",
    annualLTV: "~$12,500",
    highlight: true,
    features: [
      "Everything in Personal",
      "2–3 hour discovery session (practice, clients, workflows)",
      "CRM or calendar integration",
      "Client follow-up and research automation",
      "Industry-specific report templates",
      "Document drafting and summarization",
      "Monthly check-in call",
    ],
    cta: "Get Professional Plan",
  },
  {
    badge: "🟠",
    name: "Business Standard",
    audience: "Businesses doing $1M–$25M in revenue",
    setup: "5,000",
    monthly: "1,000",
    setupMargin: "~$3,800 (76%)",
    monthlyMargin: "~$875–900 (90%)",
    annualLTV: "~$17,000",
    features: [
      "Everything in Professional",
      "3–5 hour deep-dive discovery interview",
      "QuickBooks / Xero financial reporting automation",
      "Daily P&L and cash flow monitoring",
      "Proactive alerts for anomalies and deadlines",
      "KPI dashboard and weekly reporting",
      "2-week tuning period post-launch",
      "Monthly strategy call",
    ],
    cta: "Get Business Standard",
  },
  {
    badge: "🔴",
    name: "Business Premium",
    audience: "Businesses needing deeper strategic support",
    setup: "5,000",
    monthly: "1,500",
    setupMargin: "~$3,800 (76%)",
    monthlyMargin: "~$1,300–1,350 (89%)",
    annualLTV: "~$23,000",
    features: [
      "Everything in Business Standard",
      "Weekly strategy call",
      "Custom forecast and board report builds",
      "Investor / lender report preparation",
      "Multi-platform integrations (CRM, payroll, inventory)",
      "Priority support — direct line to our team",
    ],
    cta: "Get Business Premium",
  },
];

const addons = [
  "QuickBooks / Xero automated reporting",
  "CRM integration (HubSpot, Salesforce, custom)",
  "Payroll system connection",
  "E-commerce platform (Shopify, WooCommerce)",
  "Custom API integrations",
];

const compTable = [
  { factor: "Knows the client deeply", us: "✓  Built-in via discovery", generic: "✗  Stateless", traditional: "✓  But expensive" },
  { factor: "Persistent memory", us: "✓  Indefinitely", generic: "✗  Session-only", traditional: "Partial" },
  { factor: "Proactive & autonomous", us: "✓  Cron jobs, alerts", generic: "✗  Reactive only", traditional: "✗  Billed hourly" },
  { factor: "Dedicated hardware", us: "✓  Client owns it", generic: "✗  Shared cloud", traditional: "N/A" },
  { factor: "Available 24/7", us: "✓", generic: "✓", traditional: "✗" },
  { factor: "Monthly cost", us: "$500–1,500/mo", generic: "$20–200/mo (no config)", traditional: "$5,000–30,000/mo" },
];

const unitMetrics = [
  { label: "Month", cols: ["Personal", "Professional", "Business Std.", "Business Prem."] },
  { label: "Setup Revenue", cols: ["$2,500", "$3,500", "$5,000", "$5,000"] },
  { label: "Setup Margin", cols: ["~$1,300 (52%)", "~$2,000 (57%)", "~$3,800 (76%)", "~$3,800 (76%)"] },
  { label: "Monthly Revenue", cols: ["$500", "$750", "$1,000", "$1,500"] },
  { label: "Monthly Cost (API+hosting)", cols: ["~$50–75", "~$75–100", "~$100–150", "~$150–200"] },
  { label: "Monthly Margin", cols: ["~88%", "~89%", "~90%", "~89%"] },
  { label: "Annual Revenue/Client", cols: ["~$8,500", "~$12,500", "~$17,000", "~$23,000"] },
  { label: "3-Year LTV", cols: ["~$20,500", "~$29,500", "~$41,000", "~$59,000"] },
];

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-14">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Pricing</p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] mb-5">
          Transparent pricing.<br />No hidden costs.
        </h1>
        <p className="text-[#6B6B6B] text-lg max-w-2xl">
          One-time setup fee covers hardware, configuration, and onboarding. Monthly fee covers maintenance, updates, and support. API costs (~$50–150/month) billed separately through your own Anthropic account.
        </p>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg flex flex-col ${
                plan.highlight
                  ? "bg-[#0F1B3C] text-white border border-[#0F1B3C]"
                  : "bg-white border border-[#E2E0DA]"
              }`}
            >
              <div className="p-6 border-b border-white/10 flex-shrink-0" style={{ borderColor: plan.highlight ? 'rgba(255,255,255,0.1)' : '#E2E0DA' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{plan.badge}</span>
                  <span className={`text-[11px] font-semibold tracking-widest uppercase ${plan.highlight ? 'text-white/70' : 'text-[#6B6B6B]'}`}>
                    {plan.name}
                  </span>
                </div>
                <p className={`text-[11px] mb-5 leading-relaxed ${plan.highlight ? 'text-white/60' : 'text-[#6B6B6B]'}`}>
                  {plan.audience}
                </p>
                <div className="mb-1">
                  <span className={`text-3xl font-black ${plan.highlight ? 'text-white' : 'text-[#0D0D0D]'}`}>
                    ${plan.monthly}
                  </span>
                  <span className={`text-sm ml-1 ${plan.highlight ? 'text-white/60' : 'text-[#6B6B6B]'}`}>/mo</span>
                </div>
                <p className={`text-[12px] ${plan.highlight ? 'text-white/60' : 'text-[#6B6B6B]'}`}>
                  + ${plan.setup} setup
                </p>
              </div>

              <div className="p-6 flex-1">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex gap-2.5 text-[13px] leading-relaxed ${plan.highlight ? 'text-white/80' : 'text-[#444]'}`}>
                      <Check size={13} className={`flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-[#D4A847]' : 'text-[#B8902A]'}`} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/contact"
                  className={`flex items-center justify-center gap-2 py-3 rounded text-sm font-medium w-full transition-colors ${
                    plan.highlight
                      ? "bg-[#D4A847] hover:bg-[#c49a30] text-[#0F1B3C]"
                      : "border border-[#0F1B3C] text-[#0F1B3C] hover:bg-[#0F1B3C] hover:text-white"
                  }`}
                >
                  {plan.cta} <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mt-10 bg-white border border-[#E2E0DA] rounded-lg p-7">
          <h3 className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-4">Add-On Integrations — $250–$500 each</h3>
          <div className="flex flex-wrap gap-3">
            {addons.map((a) => (
              <span key={a} className="text-[13px] text-[#444] bg-[#F8F7F3] border border-[#E2E0DA] px-3 py-1.5 rounded">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Economics */}
      <section className="bg-white border-y border-[#E2E0DA] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Unit Economics</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#0D0D0D] mb-3">Why margins stay high.</h2>
          <p className="text-[#6B6B6B] mb-8 max-w-2xl text-sm sm:text-base">
            The AI does the ongoing work. Monthly costs are primarily API fees and minimal maintenance time. As client count scales, costs do not scale proportionally.
          </p>
          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-3">
            {[
              { plan: "Personal", setup: "$2,500", margin: "52%", monthly: "$500", monthlyMargin: "~88%", ltv: "~$20,500" },
              { plan: "Professional", setup: "$3,500", margin: "57%", monthly: "$750", monthlyMargin: "~89%", ltv: "~$29,500" },
              { plan: "Business Std.", setup: "$5,000", margin: "76%", monthly: "$1,000", monthlyMargin: "~90%", ltv: "~$41,000" },
              { plan: "Business Prem.", setup: "$5,000", margin: "76%", monthly: "$1,500", monthlyMargin: "~89%", ltv: "~$59,000" },
            ].map((p) => (
              <div key={p.plan} className="bg-[#F8F7F3] border border-[#E2E0DA] rounded-lg p-4">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#0F1B3C] mb-3">{p.plan}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Setup", p.setup], ["Setup Margin", p.margin],
                    ["Monthly", p.monthly], ["Monthly Margin", p.monthlyMargin],
                    ["3-Year LTV", p.ltv],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-semibold text-[#0D0D0D]">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: full table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[640px] w-full">
              <thead>
                <tr className="bg-[#0F1B3C]">
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-white/70 px-5 py-3">Metric</th>
                  {["Personal", "Professional", "Business Std.", "Business Prem."].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold tracking-widest uppercase text-white/70 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Setup Revenue", "$2,500", "$3,500", "$5,000", "$5,000"],
                  ["Setup Cost", "~$1,200", "~$1,500", "~$1,200", "~$1,200"],
                  ["Setup Margin", "~$1,300 (52%)", "~$2,000 (57%)", "~$3,800 (76%)", "~$3,800 (76%)"],
                  ["Monthly Revenue", "$500", "$750", "$1,000", "$1,500"],
                  ["Monthly Cost", "~$50–75", "~$75–100", "~$100–150", "~$150–200"],
                  ["Monthly Margin", "~88%", "~89%", "~90%", "~89%"],
                  ["Annual Revenue/Client", "~$8,500", "~$12,500", "~$17,000", "~$23,000"],
                  ["3-Year LTV", "~$20,500", "~$29,500", "~$41,000", "~$59,000"],
                ].map((row, i) => (
                  <tr key={row[0]} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F7F3]'}>
                    {row.map((cell, j) => (
                      <td key={j} className={`px-5 py-3 text-sm border-b border-[#E2E0DA] whitespace-nowrap ${j === 0 ? 'font-medium text-[#0D0D0D]' : 'text-[#444]'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Competitive Table */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Competitive Advantage</p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#0D0D0D] mb-3">How we stack up.</h2>
        <p className="text-[#6B6B6B] mb-8 max-w-2xl text-sm sm:text-base">
          White-glove setup, persistent memory, and dedicated hardware are not Google or Microsoft products. They never will be.
        </p>
        {/* Mobile: stacked comparison cards */}
        <div className="md:hidden space-y-3">
          {compTable.map((row) => (
            <div key={row.factor} className="bg-white border border-[#E2E0DA] rounded-lg p-4">
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#0D0D0D] mb-3">{row.factor}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-[11px] font-semibold text-[#B8902A] uppercase tracking-wide w-20 flex-shrink-0">Clarix</span>
                  <span className="text-sm text-[#B8902A] font-medium text-right">{row.us}</span>
                </div>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wide w-20 flex-shrink-0">ChatGPT</span>
                  <span className="text-sm text-[#6B6B6B] text-right">{row.generic}</span>
                </div>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wide w-20 flex-shrink-0">Consult.</span>
                  <span className="text-sm text-[#6B6B6B] text-right">{row.traditional}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop: full table */}
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
      </section>

      {/* CTA */}
      <section className="border-t border-[#E2E0DA] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-[#0D0D0D] mb-4">Not sure which plan?</h2>
          <p className="text-[#6B6B6B] mb-8 max-w-md mx-auto">Reach out and we&apos;ll recommend the right fit based on what you actually need.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white px-7 py-3.5 rounded font-medium text-[15px]">
            Talk to us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
