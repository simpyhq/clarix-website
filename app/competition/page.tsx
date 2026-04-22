import Link from "next/link";
import { ArrowRight, Check, X, Minus } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const competitors = [
  {
    name: "ChatGPT / OpenAI",
    type: "Generic AI Chatbot",
    price: "$20–30/mo",
    summary: "The most-used AI tool in the world. Powerful for one-off questions and writing tasks. But it starts every conversation fresh, knows nothing about you, and requires you to prompt it manually for every task.",
    strengths: ["Massive capability", "Huge user base", "Cheap"],
    weaknesses: [
      "No memory between sessions",
      "No dedicated hardware — shared cloud",
      "No autonomous workflows or scheduling",
      "Generic — knows nothing about your business",
      "You have to configure and prompt it yourself",
    ],
    verdict: "A powerful tool. Not a system. You still do the work.",
    color: "#10a37f",
  },
  {
    name: "Microsoft Copilot",
    type: "Enterprise AI Suite",
    price: "$30/user/mo",
    summary: "Deeply integrated with Microsoft 365 — great for Word, Excel, Teams, and Outlook automation within the Microsoft ecosystem. Limited outside of it. No persistent memory. No custom workflows.",
    strengths: ["M365 integration", "Enterprise IT familiarity", "Large org support"],
    weaknesses: [
      "Only useful if you live in Microsoft 365",
      "No persistent memory or personalization",
      "No dedicated hardware or data isolation",
      "Generic responses — not industry-specific",
      "No autonomous task scheduling",
    ],
    verdict: "Powerful inside Microsoft. Useless outside it.",
    color: "#0078d4",
  },
  {
    name: "Google Gemini",
    type: "Generic AI Assistant",
    price: "$20/mo",
    summary: "Deeply integrated with Google Workspace. Good at search-connected tasks and Gmail/Drive workflows. No persistent memory, no dedicated hardware, and no custom configuration for your business.",
    strengths: ["Google Search integration", "Gmail/Drive workflows", "Multimodal capability"],
    weaknesses: [
      "No persistent memory",
      "No dedicated hardware or privacy isolation",
      "No autonomous scheduling or proactive alerts",
      "Can't be deeply configured to your industry",
      "Your data trains Google's models",
    ],
    verdict: "Good for Google users. Not a business system.",
    color: "#4285f4",
  },
  {
    name: "Traditional Consultants",
    type: "Human Services",
    price: "$5,000–30,000/mo",
    summary: "Human consultants, virtual assistants, and executive assistants. Expensive, slow, and unavailable at 3am. They're knowledgeable but they clock out. They also charge for every hour.",
    strengths: ["Human judgment", "Relationship-based", "Complex reasoning"],
    weaknesses: [
      "Massively expensive — $5K–30K/mo minimum",
      "Not available 24/7",
      "High turnover — institutional knowledge walks out the door",
      "Slow response times",
      "Billed hourly for everything",
    ],
    verdict: "The gold standard for quality — at 100x the price.",
    color: "#6b6b6b",
  },
  {
    name: "Jasper / Writer / Notion AI",
    type: "AI Writing Tools",
    price: "$50–200/mo",
    summary: "Excellent for content creation, copywriting, and document workflows. Not assistants — they don't monitor your business, respond to you via WhatsApp, or run autonomous tasks.",
    strengths: ["Strong content output", "Brand voice training", "Team collaboration"],
    weaknesses: [
      "Narrow use case — content only",
      "No monitoring or autonomous workflows",
      "No communication channels (WhatsApp, etc.)",
      "No memory of your business decisions",
      "Not a daily operations system",
    ],
    verdict: "A tool for writing. Not a system for running a business.",
    color: "#f97316",
  },
  {
    name: "Zapier AI / Make.com",
    type: "Automation Platforms",
    price: "$50–500/mo",
    summary: "Powerful workflow automation. Good at connecting apps and triggering actions. But they require significant technical setup, have no conversational AI, and can't understand nuance or context.",
    strengths: ["App integrations", "Workflow automation", "Large ecosystem"],
    weaknesses: [
      "Requires technical setup and maintenance",
      "No conversational interface",
      "No AI judgment or reasoning",
      "Can't adapt to changing instructions",
      "Brittle — breaks when apps update",
    ],
    verdict: "Infrastructure, not intelligence. You still need a human to design it.",
    color: "#ff4a00",
  },
];

const ourAdvantages = [
  {
    title: "The only one that knows you",
    desc: "We spend 1–3 hours in discovery before writing a single line of configuration. Your assistant knows your industry, your contacts, your goals, and your workflows — on day one. No competitor does this.",
  },
  {
    title: "Persistent memory that compounds",
    desc: "Every conversation, every decision, every context is retained indefinitely. The longer you use it, the smarter it gets. ChatGPT starts fresh every conversation. We don't.",
  },
  {
    title: "Hardware you own",
    desc: "Your AI runs on a Mac mini you own. Your data doesn't leave your machine. You don't share infrastructure with other users. When you cancel, you keep the hardware. No competitor offers this.",
  },
  {
    title: "Proactive, not reactive",
    desc: "Scheduled briefings, automated reports, deadline alerts, and workflow automation run without you asking. Every other AI tool waits to be prompted. Ours wakes up and works.",
  },
  {
    title: "White-glove setup included",
    desc: "We configure everything. You don't need to know what a prompt is. We handle the knowledge base, integrations, workflows, and ongoing tuning. The setup cost is a feature, not a friction.",
  },
  {
    title: "Price point nobody else occupies",
    desc: "$100–$250/month sits in a gap no competitor owns. Too cheap for traditional consultants. Too capable for generic AI subscriptions. We own that middle ground.",
  },
];

function Tick({ yes }: { yes: boolean | null }) {
  if (yes === true)  return <Check size={15} className="text-[#5E6AD2]" strokeWidth={2.5} />;
  if (yes === false) return <X     size={15} className="text-red-400"   strokeWidth={2.5} />;
  return <Minus size={15} className="text-[#444449]" strokeWidth={2.5} />;
}

const matrix = [
  { feature: "Persistent memory",       clarix: true,  chatgpt: false, copilot: false, consultants: null  },
  { feature: "Dedicated hardware",       clarix: true,  chatgpt: false, copilot: false, consultants: false },
  { feature: "Deep custom onboarding",   clarix: true,  chatgpt: false, copilot: false, consultants: true  },
  { feature: "Proactive scheduling",     clarix: true,  chatgpt: false, copilot: null,  consultants: false },
  { feature: "WhatsApp / iMessage",      clarix: true,  chatgpt: false, copilot: false, consultants: null  },
  { feature: "Available 24/7",           clarix: true,  chatgpt: true,  copilot: true,  consultants: false },
  { feature: "Data stays on your machine",clarix: true, chatgpt: false, copilot: false, consultants: null  },
  { feature: "Under $500/mo",            clarix: true,  chatgpt: true,  copilot: true,  consultants: false },
  { feature: "No technical knowledge needed", clarix: true, chatgpt: false, copilot: null, consultants: true },
];

export default function CompetitionPage() {
  return (
    <div className="bg-[#0f0f0f] text-[#e8e8e8]">

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-20 pb-16">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-widests uppercase text-[#5E6AD2] mb-4">Competitive Analysis</p>
          <h1 className="text-3xl sm:text-4xl font-medium leading-[1.08] tracking-tight mb-5 max-w-3xl">
            Who else is in this space.<br />
            <span className="text-[#444449]">And why we win.</span>
          </h1>
          <p className="text-[#6b6b72] text-[15px] max-w-xl leading-relaxed">
            The AI assistant market is crowded. But the &ldquo;white-glove, dedicated hardware, persistent memory&rdquo; segment is not. Here&apos;s the honest breakdown.
          </p>
        </Reveal>
      </section>

      {/* Feature matrix */}
      <section className="border-t border-[#2a2a2e] bg-[#161618] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-10">
            <p className="text-[11px] font-semibold tracking-widests uppercase text-[#5E6AD2] mb-4">Feature Matrix</p>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight">Side by side.</h2>
          </Reveal>
          <Reveal>
            <div className="overflow-x-auto rounded-xl border border-[#2a2a2e]">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-[#e8e8e8]">
                    <th className="text-left text-[11px] font-semibold tracking-widests uppercase text-white/40 px-5 py-3.5">Feature</th>
                    <th className="text-center text-[11px] font-semibold tracking-widests uppercase text-[#7c87e8] px-5 py-3.5">Clarix</th>
                    <th className="text-center text-[11px] font-semibold tracking-widests uppercase text-white/40 px-5 py-3.5">ChatGPT</th>
                    <th className="text-center text-[11px] font-semibold tracking-widests uppercase text-white/40 px-5 py-3.5">Copilot</th>
                    <th className="text-center text-[11px] font-semibold tracking-widests uppercase text-white/40 px-5 py-3.5">Consultants</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? "bg-[#161618]" : "bg-[#161618]"}>
                      <td className="px-5 py-3 text-[13px] font-medium text-[#e8e8e8] border-b border-[#2a2a2e]">{row.feature}</td>
                      <td className="px-5 py-3 text-center border-b border-[#2a2a2e]"><div className="flex justify-center"><Tick yes={row.clarix} /></div></td>
                      <td className="px-5 py-3 text-center border-b border-[#2a2a2e]"><div className="flex justify-center"><Tick yes={row.chatgpt} /></div></td>
                      <td className="px-5 py-3 text-center border-b border-[#2a2a2e]"><div className="flex justify-center"><Tick yes={row.copilot} /></div></td>
                      <td className="px-5 py-3 text-center border-b border-[#2a2a2e]"><div className="flex justify-center"><Tick yes={row.consultants} /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[12px] text-[#444449] mt-3">— = partial or context-dependent</p>
          </Reveal>
        </div>
      </section>

      {/* Competitor cards */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20 md:py-24">
        <Reveal className="mb-14">
          <p className="text-[11px] font-semibold tracking-widests uppercase text-[#5E6AD2] mb-4">The Landscape</p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">Every major player, honestly assessed.</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {competitors.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <div className="border border-[#2a2a2e] rounded-xl p-6 h-full hover:border-[#d0d0d0] hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[#e8e8e8] text-[16px]">{c.name}</h3>
                    <p className="text-[12px] text-[#444449] mt-0.5">{c.type} · {c.price}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: c.color }} />
                </div>
                <p className="text-[#6b6b72] text-[13px] leading-relaxed mb-5">{c.summary}</p>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-[10px] font-semibold tracking-widests uppercase text-[#5E6AD2] mb-2">Strengths</p>
                    <ul className="space-y-1.5">
                      {c.strengths.map((s) => (
                        <li key={s} className="flex gap-1.5 text-[12px] text-[#6b6b72]">
                          <Check size={11} className="text-[#444449] flex-shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-widests uppercase text-red-400 mb-2">Gaps</p>
                    <ul className="space-y-1.5">
                      {c.weaknesses.slice(0, 4).map((w) => (
                        <li key={w} className="flex gap-1.5 text-[12px] text-[#6b6b72]">
                          <X size={11} className="text-red-300 flex-shrink-0 mt-0.5" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-[#2a2a2e] pt-4">
                  <p className="text-[12px] text-[#e8e8e8] font-semibold">Verdict: <span className="font-normal text-[#6b6b72]">{c.verdict}</span></p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Our advantages */}
      <section className="border-t border-[#2a2a2e] bg-[#161618] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-14">
            <p className="text-[11px] font-semibold tracking-widests uppercase text-[#5E6AD2] mb-4">Our Edge</p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight max-w-xl">
              Six things no competitor does.
            </h2>
          </Reveal>
          <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ourAdvantages.map((a, i) => (
              <div key={a.title} className="bg-[#161618] border border-[#2a2a2e] rounded-xl p-6">
                <span className="font-mono text-[11px] text-[#444449] mb-4 block">0{i + 1}</span>
                <h3 className="font-medium text-[#e8e8e8] text-[14px] mb-2">{a.title}</h3>
                <p className="text-[#6b6b72] text-[13px] leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* The gap */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 py-20 md:py-24">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-widests uppercase text-[#5E6AD2] mb-4">The Gap We Own</p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight mb-6">
            No one else lives here.
          </h2>
          <p className="text-[#6b6b72] text-[16px] leading-relaxed mb-6">
            Generic AI tools ($20–$200/mo) are cheap and generic. Enterprise AI platforms ($5,000–$30,000/mo) are expensive and require IT departments to deploy. Traditional consultants are human, expensive, and unavailable at 3am.
          </p>
          <p className="text-[#6b6b72] text-[16px] leading-relaxed mb-10">
            Clarix at <strong className="text-[#e8e8e8]">$100–$250/mo</strong> occupies a position no one else is selling: <strong className="text-[#e8e8e8]">white-glove, persistent, proactive, and affordable</strong>. That gap isn&apos;t an accident — it exists because nobody built the operational playbook to serve it at this price. We did.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/intake"
              className="inline-flex items-center justify-center gap-2 bg-[#e8e8e8] hover:bg-white/90 text-[#0f0f0f] px-7 py-3.5 rounded-lg font-bold text-[14px]">
              Get Started <ArrowRight size={14} />
            </Link>
            <Link href="/pricing"
              className="inline-flex items-center justify-center gap-2 border border-[#2a2a2e] hover:border-[#0a0a0a] text-[#e8e8e8] px-7 py-3.5 rounded-lg font-medium text-[14px]">
              View Pricing
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
