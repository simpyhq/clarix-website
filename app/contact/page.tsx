import Link from "next/link";
import { Mail, Clock, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export default function ContactPage() {
  return (
    <div className="bg-white text-[#0f172a]">

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-20 pb-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-4">Contact</p>
          <h1 className="text-3xl sm:text-4xl font-medium leading-[1.08] tracking-tight mb-5">Get in touch.</h1>
          <p className="text-[#64748b] text-[15px] max-w-xl leading-relaxed">
            Tell us what you need and we&apos;ll reply within a few hours. No sales funnel, no demo calls, no wait.
          </p>
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">

          <Reveal className="md:col-span-3">
            <div className="bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl p-8">
              <form action="mailto:jarvis@simpyhq.com" method="GET" encType="text/plain" className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#94a3b8] mb-2" htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your full name"
                      className="w-full bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-[#0f172a] placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#0f172a] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#94a3b8] mb-2" htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="you@company.com"
                      className="w-full bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-[#0f172a] placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#0f172a] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#94a3b8] mb-2" htmlFor="type">I am a...</label>
                  <select id="type" name="type"
                    className="w-full bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-[#0f172a] text-[14px] focus:outline-none focus:border-[#0f172a] transition-colors appearance-none">
                    <option value="">Select one</option>
                    <option>Business owner</option>
                    <option>Professional (real estate, legal, finance, healthcare)</option>
                    <option>Individual (student, creator, executive)</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#94a3b8] mb-2" htmlFor="plan">Plan interest</label>
                  <select id="plan" name="plan"
                    className="w-full bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-[#0f172a] text-[14px] focus:outline-none focus:border-[#0f172a] transition-colors appearance-none">
                    <option value="">Not sure yet</option>
                    <option>Basic — $100/mo</option>
                    <option>Pro — $250/mo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#94a3b8] mb-2" htmlFor="body">What do you need help with?</label>
                  <textarea id="body" name="body" rows={5}
                    placeholder="Tell us about your business, what you'd want your assistant to do, any tools you use, and any questions..."
                    className="w-full bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-[#0f172a] placeholder-[#94a3b8] text-[14px] focus:outline-none focus:border-[#0f172a] transition-colors resize-none" />
                </div>
                <button type="submit"
                  className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-3 rounded-lg font-semibold text-[14px] transition-colors">
                  Send Message
                </button>
                <p className="text-[#94a3b8] text-[12px] text-center">Opens your email client pre-filled. Or email us at jarvis@simpyhq.com</p>
              </form>
            </div>
          </Reveal>

          <Reveal delay={150} className="md:col-span-2 space-y-4">
            <div className="bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl p-6 space-y-5">
              {[
                { label: "General",                        email: "jarvis@simpyhq.com" },
                { label: "Michael Simpson — Founder",      email: "michael@ospipe.com" },
                { label: "Christian Simpson — Operations", email: "christian.simpson.2018@outlook.com" },
              ].map((c) => (
                <a key={c.email} href={`mailto:${c.email}`} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0] flex items-center justify-center flex-shrink-0">
                    <Mail size={13} className="text-[#0f172a]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide uppercase text-[#94a3b8] mb-0.5">{c.label}</p>
                    <p className="text-[13px] text-[#0f172a] group-hover:underline">{c.email}</p>
                  </div>
                </a>
              ))}
              <div className="flex items-start gap-3 pt-1 border-t border-[#e2e8f0]">
                <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0] flex items-center justify-center flex-shrink-0">
                  <Clock size={13} className="text-[#0f172a]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wide uppercase text-[#94a3b8] mb-0.5">Response time</p>
                  <p className="text-[13px] text-[#0f172a]">Usually within a few hours</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl p-6">
              <p className="text-[11px] font-semibold tracking-widests uppercase text-[#0f172a] mb-4">What happens next</p>
              <ol className="space-y-3">
                {["We reply with a few qualifying questions", "You share setup preferences and priorities", "We configure your assistant (48–72 hrs)", "Handoff — live and ready to use"].map((step, i) => (
                  <li key={i} className="flex gap-3 text-[13px] text-[#64748b] leading-relaxed">
                    <span className="w-5 h-5 rounded-md bg-[#0f172a] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <Link href="/intake" className="block border border-[#e2e8f0] hover:border-[#334155] rounded-xl p-6 group transition-colors">
              <p className="font-semibold text-[14px] mb-1">Ready to get started?</p>
              <p className="text-[#64748b] text-[13px] leading-relaxed mb-3">Fill out our intake form — tell us about your business and what you want to automate.</p>
              <p className="text-[#0f172a] text-[13px] font-medium flex items-center gap-1">Start intake form <ArrowRight size={12} /></p>
            </Link>

            <div className="bg-[#f1f3f5] border border-[#e2e8f0] rounded-xl p-6">
              <p className="text-[11px] font-semibold tracking-widests uppercase text-[#0f172a] mb-2">Referral Program</p>
              <p className="text-[13px] text-[#64748b] leading-relaxed">
                Refer a client and receive a <strong className="text-[#0f172a]">$500 credit</strong> toward your next month. No limit on referrals.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
