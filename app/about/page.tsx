import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-14">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">About</p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#0D0D0D] mb-6 max-w-3xl">
          We built this for a $25M energy company. It works. Now we scale it to everyone else.
        </h1>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-14 items-start">
          <div className="md:col-span-3 space-y-5 text-[#444] leading-relaxed text-[15px]">
            <p>
              Clarix grew out of a real implementation. Michael Simpson — CEO of a 25-person energy services company in Fort Worth — built the first version of this system with his CFO-equivalent AI (Hank) to handle financial reporting, vendor tracking, operations dashboards, and executive briefings.
            </p>
            <p>
              It replaced functions that would have cost $150,000+ per year in human labor. It ran on a Mac mini. It checked in every morning, flagged anomalies the same day they appeared, and never called in sick.
            </p>
            <p>
              Christian Simpson — finance student at OU, Michael&apos;s son — built his own version. Daily briefings. Email monitoring. Internship tracking. Research automation. The same architecture, configured for a very different life.
            </p>
            <p>
              When they started explaining it to lawyers, real estate agents, consultants, and other business owners — the reaction was always the same: <em>&ldquo;I want that. I have no idea how to set it up.&rdquo;</em>
            </p>
            <p className="font-medium text-[#0D0D0D]">
              That&apos;s Clarix. We do the setup so you don&apos;t have to.
            </p>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="bg-white border border-[#E2E0DA] rounded-lg p-6">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-4">The Team</p>
              <div className="space-y-5">
                {[
                  {
                    initials: "CS",
                    name: "Christian Simpson",
                    role: "Founder",
                    detail: "Finance student, OU. Runs his own AI assistant daily.",
                  },
                  {
                    initials: "MS",
                    name: "Michael Simpson",
                    role: "Co-Founder",
                    detail: "CEO, OS Pipe & Supply. Built the original system for a $25M business.",
                  },
                ].map((p) => (
                  <div key={p.name} className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded bg-[#0F1B3C] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{p.initials}</span>
                    </div>
                    <div>
                      <p className="text-[#0D0D0D] text-sm font-semibold">{p.name}</p>
                      <p className="text-[#B8902A] text-[11px] font-medium tracking-wide uppercase">{p.role}</p>
                      <p className="text-[#6B6B6B] text-xs mt-1">{p.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E2E0DA] mt-5 pt-5">
                <a href="mailto:hello@clarix.ai" className="text-sm text-[#0F1B3C] font-medium hover:underline">hello@clarix.ai</a>
              </div>
            </div>

            <div className="bg-[#F8F7F3] border border-[#E2E0DA] rounded-lg p-6">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Version History</p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B6B]">v1.0 — Feb 2026</span>
                  <span className="text-[#0D0D0D] text-xs">Virtual CFO for SMBs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B6B]">v2.0 — Apr 2026</span>
                  <span className="text-[#0D0D0D] text-xs font-medium">Anyone. Now scaling.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why now */}
      <section className="bg-[#0F1B3C] py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#D4A847] mb-3">Why Now</p>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-6">
              The models are ready. The hardware is affordable. What&apos;s missing is execution.
            </h2>
            <p className="text-white/60 leading-relaxed mb-5">
              The AI models are powerful enough. The hardware is affordable enough. The tools — Claude, Gemini, OpenClaw — are mature enough. What the market lacks is not better AI. It&apos;s someone who will sit down, understand a client&apos;s actual world, and build a system that works for them specifically.
            </p>
            <p className="text-white/60 leading-relaxed mb-5">
              The window to establish this as a premium, trust-based service is open right now — before this becomes commoditized. In 24–36 months, everyone will have an AI assistant.
            </p>
            <p className="text-white font-medium">
              The clients who get set up properly now will have a compounding advantage over those who wait. And so will we.
            </p>
          </div>
        </div>
      </section>

      {/* The Tech */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">The Technology</p>
        <h2 className="font-display text-3xl sm:text-4xl text-[#0D0D0D] mb-6">Built on proven infrastructure.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Claude by Anthropic",
              desc: "The underlying AI model. Trusted by Fortune 500 companies, consistently ranked among the most capable and safe AI systems available. We route tasks intelligently across model tiers.",
            },
            {
              name: "OpenClaw Gateway",
              desc: "The platform layer that connects Claude to your messaging apps, schedules tasks, reads files, browses the web, and maintains memory between conversations. The operating system for your AI.",
            },
            {
              name: "Mac mini M4",
              desc: "Dedicated hardware per client. Silent, low-power, runs 24/7. Configured and shipped ready to go. You own it. When you cancel, it stays with you.",
            },
          ].map((t) => (
            <div key={t.name} className="bg-white border border-[#E2E0DA] rounded-lg p-6">
              <h3 className="font-semibold text-[#0D0D0D] mb-3">{t.name}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E2E0DA] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl text-[#0D0D0D] mb-1">Want to talk before committing?</h2>
            <p className="text-[#6B6B6B] text-sm">We&apos;re a small team. We actually reply.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white px-6 py-3 rounded font-medium text-sm">
              Reach out <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 border border-[#E2E0DA] hover:border-[#0D0D0D] text-[#0D0D0D] px-6 py-3 rounded font-medium text-sm">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
