import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white text-[#0a0a0a]">

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-20 pb-16">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">About</p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight mb-5 max-w-3xl">
          Built for a $25M energy company.<br />
          <span className="text-[#9b9b9b]">Now available to everyone.</span>
        </h1>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-14 items-start">
          <div className="md:col-span-3 space-y-5 text-[#6b6b6b] leading-relaxed text-[15px]">
            <p>
              Clarix grew out of a real implementation. Michael Simpson — CEO of a 25-person energy services company in Fort Worth — built the first version of this system with his AI CFO (Hank) to handle financial reporting, vendor tracking, operations dashboards, and executive briefings.
            </p>
            <p>
              It replaced functions that would have cost $150,000+ per year in human labor. It ran on a Mac mini. It checked in every morning, flagged anomalies the same day they appeared, and never called in sick.
            </p>
            <p>
              Christian Simpson — finance student at OU, Michael&apos;s son — built his own version. Daily briefings. Email monitoring. Internship tracking. Research automation. The same architecture, configured for a very different life.
            </p>
            <p>
              When they started explaining it to lawyers, real estate agents, consultants, and other business owners — the reaction was always the same: <em className="text-[#0a0a0a]">&ldquo;I want that. I have no idea how to set it up.&rdquo;</em>
            </p>
            <p>
              That&apos;s Clarix. We remove the barrier between the technology and the people who need it most.
            </p>
          </div>

          <div className="md:col-span-2 space-y-5">
            {[
              { label: "Founded", value: "2025 · Fort Worth, TX" },
              { label: "Founders", value: "Michael Simpson & Christian Simpson" },
              { label: "First client", value: "CHP Energy Services — a live $25M implementation" },
              { label: "Stack", value: "OpenClaw · Claude by Anthropic · Mac mini M4" },
              { label: "Mission", value: "Remove the barrier between advanced AI and the people who need it most" },
            ].map((item) => (
              <div key={item.label} className="border-t border-[#e8e8e8] pt-4">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[#9b9b9b] mb-1">{item.label}</p>
                <p className="text-[14px] text-[#0a0a0a]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="border-t border-[#e8e8e8] bg-[#f7f7f7] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">The Approach</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12 max-w-xl">
            Why this works when everything else doesn&apos;t.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { n: "01", title: "Dedicated hardware",     desc: "Your AI runs on a machine you own. No shared infrastructure, no data leaving your control." },
              { n: "02", title: "Deep onboarding",        desc: "We spend hours learning your world before writing a single line of configuration. Generic tools skip this entirely." },
              { n: "03", title: "Persistent memory",      desc: "Every conversation, decision, and context is retained indefinitely. It gets smarter the longer you use it." },
              { n: "04", title: "Proactive by design",    desc: "Scheduled workflows, alerts, and autonomous tasks — not just a chatbot waiting to be asked." },
              { n: "05", title: "We maintain it",         desc: "Software updates, model upgrades, and ongoing tuning are included. You don't have to touch it." },
              { n: "06", title: "Proven in production",   desc: "Not a demo. Not a pilot. A real system running for a real business — that's where this came from." },
            ].map((item) => (
              <div key={item.n} className="bg-white border border-[#e8e8e8] rounded-xl p-6">
                <span className="font-mono text-[11px] text-[#9b9b9b] mb-4 block">{item.n}</span>
                <h3 className="font-semibold text-[#0a0a0a] text-[14px] mb-2">{item.title}</h3>
                <p className="text-[#6b6b6b] text-[13px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#e8e8e8] bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight">
            Want to see it in action?
          </h2>
          <p className="text-white/40 text-[16px] max-w-lg mx-auto mb-10">
            Fill out the intake form and we&apos;ll show you exactly what your assistant would look like — before you commit to anything.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/intake"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-[#0a0a0a] px-7 py-3.5 rounded-lg font-bold text-[14px]">
              Start Intake Form <ArrowRight size={14} />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/40 text-white/60 hover:text-white px-7 py-3.5 rounded-lg font-medium text-[14px]">
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
