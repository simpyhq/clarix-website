import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export default function AboutPage() {
  return (
    <div className="bg-[#0f0f0f] text-[#e8e8e8]">

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-20 pb-16">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] mb-4">About</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight mb-5 max-w-3xl">
            Built for a $25M energy company.<br />
            <span className="text-[#444449]">Now available to everyone.</span>
          </h1>
        </Reveal>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-14 items-start">
          <Reveal className="md:col-span-3 space-y-5">
            <p className="text-[#6b6b72] leading-relaxed text-[15px]">
              Clarix grew out of a real implementation. Michael Simpson — CEO of a 25-person energy services company in Fort Worth — built the first version of this system with his AI CFO (Hank) to handle financial reporting, vendor tracking, operations dashboards, and executive briefings.
            </p>
            <p className="text-[#6b6b72] leading-relaxed text-[15px]">
              It replaced functions that would have cost $150,000+ per year in human labor. It ran on a Mac mini. It checked in every morning, flagged anomalies the same day they appeared, and never called in sick.
            </p>
            <p className="text-[#6b6b72] leading-relaxed text-[15px]">
              Christian Simpson — finance student at OU, Michael&apos;s son — built his own version. Daily briefings. Email monitoring. Internship tracking. Research automation. The same architecture, configured for a very different life.
            </p>
            <p className="text-[#6b6b72] leading-relaxed text-[15px]">
              When they started explaining it to lawyers, real estate agents, consultants, and business owners — the reaction was always the same: <em className="text-[#e8e8e8]">&ldquo;I want that. I have no idea how to set it up.&rdquo;</em>
            </p>
            <p className="text-[#6b6b72] leading-relaxed text-[15px]">
              That&apos;s Clarix. We remove the barrier between the technology and the people who need it most.
            </p>
          </Reveal>

          <Reveal delay={150} className="md:col-span-2 space-y-5">
            {[
              { label: "Founded",     value: "2025 · Fort Worth, TX" },
              { label: "Founders",    value: "Michael Simpson & Christian Simpson" },
              { label: "First client",value: "CHP Energy Services — live $25M implementation" },
              { label: "Stack",       value: "OpenClaw · Claude by Anthropic · Mac mini M4" },
              { label: "Mission",     value: "Remove the barrier between advanced AI and the people who need it most" },
            ].map((item) => (
              <div key={item.label} className="border-t border-[#2a2a2e] pt-4">
                <p className="text-[11px] font-semibold tracking-widests uppercase text-[#444449] mb-1">{item.label}</p>
                <p className="text-[14px] text-[#e8e8e8]">{item.value}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Why it works */}
      <section className="border-t border-[#2a2a2e] bg-[#161618] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-14">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#5E6AD2] mb-4">The Approach</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-xl">
              Why this works when everything else doesn&apos;t.
            </h2>
          </Reveal>
          <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { n: "01", title: "Dedicated hardware",   desc: "Your AI runs on a machine you own. No shared infrastructure, no data leaving your control." },
              { n: "02", title: "Deep onboarding",      desc: "We spend hours learning your world before writing a single line of configuration. Generic tools skip this entirely." },
              { n: "03", title: "Persistent memory",    desc: "Every conversation, decision, and context is retained indefinitely. It gets smarter the longer you use it." },
              { n: "04", title: "Proactive by design",  desc: "Scheduled workflows, alerts, and autonomous tasks — not just a chatbot waiting to be asked." },
              { n: "05", title: "We maintain it",       desc: "Software updates, model upgrades, and ongoing tuning are included. You don't have to touch it." },
              { n: "06", title: "Proven in production", desc: "Not a demo. Not a pilot. A real system running for a real $25M business — that's where this came from." },
            ].map((item) => (
              <div key={item.n} className="bg-[#161618] border border-[#2a2a2e] rounded-xl p-6">
                <span className="font-mono text-[11px] text-[#444449] mb-4 block">{item.n}</span>
                <h3 className="font-semibold text-[#e8e8e8] text-[14px] mb-2">{item.title}</h3>
                <p className="text-[#6b6b72] text-[13px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2a2a2e] py-20 md:py-24">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight">Want to see it in action?</h2>
            <p className="text-[#6b6b72] text-[16px] max-w-lg mx-auto mb-10">
              Fill out the intake form and we&apos;ll show you exactly what your assistant would look like — before you commit to anything.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/intake"
                className="inline-flex items-center justify-center gap-2 bg-[#e8e8e8] hover:bg-white/90 text-[#0f0f0f] px-7 py-3.5 rounded-lg font-bold text-[14px]">
                Start Intake Form <ArrowRight size={14} />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-[#2a2a2e] hover:border-[#0a0a0a] text-[#e8e8e8] px-7 py-3.5 rounded-lg font-medium text-[14px]">
                Ask a question
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
