import Link from "next/link";
import { Mail, Clock, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export default function ContactPage() {
  return (
    <div className="bg-white text-[#0a0a0a]">

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-20 pb-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0066ff] mb-4">Contact</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight mb-5">Get in touch.</h1>
          <p className="text-[#6b6b6b] text-[17px] max-w-xl leading-relaxed">
            Tell us what you need and we&apos;ll reply within a few hours. No sales funnel, no demo calls, no wait.
          </p>
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">

          <Reveal className="md:col-span-3">
            <div className="bg-white border border-[#e8e8e8] rounded-xl p-8">
              <form action="mailto:jarvis@simpyhq.com" method="GET" encType="text/plain" className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#9b9b9b] mb-2" htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your full name"
                      className="w-full bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg px-4 py-2.5 text-[#0a0a0a] placeholder-[#9b9b9b] text-[14px] focus:outline-none focus:border-[#0066ff] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#9b9b9b] mb-2" htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="you@company.com"
                      className="w-full bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg px-4 py-2.5 text-[#0a0a0a] placeholder-[#9b9b9b] text-[14px] focus:outline-none focus:border-[#0066ff] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#9b9b9b] mb-2" htmlFor="type">I am a...</label>
                  <select id="type" name="type"
                    className="w-full bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg px-4 py-2.5 text-[#0a0a0a] text-[14px] focus:outline-none focus:border-[#0066ff] transition-colors appearance-none">
                    <option value="">Select one</option>
                    <option>Business owner</option>
                    <option>Professional (real estate, legal, finance, healthcare)</option>
                    <option>Individual (student, creator, executive)</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#9b9b9b] mb-2" htmlFor="plan">Plan interest</label>
                  <select id="plan" name="plan"
                    className="w-full bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg px-4 py-2.5 text-[#0a0a0a] text-[14px] focus:outline-none focus:border-[#0066ff] transition-colors appearance-none">
                    <option value="">Not sure yet</option>
                    <option>Basic — $100/mo</option>
                    <option>Pro — $250/mo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#9b9b9b] mb-2" htmlFor="body">What do you need help with?</label>
                  <textarea id="body" name="body" rows={5}
                    placeholder="Tell us about your business, what you'd want your assistant to do, any tools you use, and any questions..."
                    className="w-full bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg px-4 py-2.5 text-[#0a0a0a] placeholder-[#9b9b9b] text-[14px] focus:outline-none focus:border-[#0066ff] transition-colors resize-none" />
                </div>
                <button type="submit"
                  className="w-full bg-[#0a0a0a] hover:bg-[#222] text-white py-3 rounded-lg font-semibold text-[14px] transition-colors">
                  Send Message
                </button>
                <p className="text-[#9b9b9b] text-[12px] text-center">Opens your email client pre-filled. Or email us at jarvis@simpyhq.com</p>
              </form>
            </div>
          </Reveal>

          <Reveal delay={150} className="md:col-span-2 space-y-4">
            <div className="bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl p-6 space-y-5">
              {[
                { label: "General",                        email: "jarvis@simpyhq.com" },
                { label: "Michael Simpson — Founder",      email: "michael@ospipe.com" },
                { label: "Christian Simpson — Operations", email: "christian.simpson.2018@outlook.com" },
              ].map((c) => (
                <a key={c.email} href={`mailto:${c.email}`} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#e8e8e8] flex items-center justify-center flex-shrink-0">
                    <Mail size={13} className="text-[#0066ff]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide uppercase text-[#9b9b9b] mb-0.5">{c.label}</p>
                    <p className="text-[13px] text-[#0066ff] group-hover:underline">{c.email}</p>
                  </div>
                </a>
              ))}
              <div className="flex items-start gap-3 pt-1 border-t border-[#e8e8e8]">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#e8e8e8] flex items-center justify-center flex-shrink-0">
                  <Clock size={13} className="text-[#0a0a0a]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wide uppercase text-[#9b9b9b] mb-0.5">Response time</p>
                  <p className="text-[13px] text-[#0a0a0a]">Usually within a few hours</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl p-6">
              <p className="text-[11px] font-semibold tracking-widests uppercase text-[#0066ff] mb-4">What happens next</p>
              <ol className="space-y-3">
                {["We reply with a few qualifying questions", "You share setup preferences and priorities", "We configure your assistant (48–72 hrs)", "Handoff — live and ready to use"].map((step, i) => (
                  <li key={i} className="flex gap-3 text-[13px] text-[#6b6b6b] leading-relaxed">
                    <span className="w-5 h-5 rounded-md bg-[#0a0a0a] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <Link href="/intake" className="block border border-[#e8e8e8] hover:border-[#0a0a0a] rounded-xl p-6 group transition-colors">
              <p className="font-semibold text-[14px] mb-1">Ready to get started?</p>
              <p className="text-[#6b6b6b] text-[13px] leading-relaxed mb-3">Fill out our intake form — tell us about your business and what you want to automate.</p>
              <p className="text-[#0066ff] text-[13px] font-medium flex items-center gap-1">Start intake form <ArrowRight size={12} /></p>
            </Link>

            <div className="bg-[#f0f5ff] border border-[#0066ff]/15 rounded-xl p-6">
              <p className="text-[11px] font-semibold tracking-widests uppercase text-[#0066ff] mb-2">Referral Program</p>
              <p className="text-[13px] text-[#6b6b6b] leading-relaxed">
                Refer a client and receive a <strong className="text-[#0a0a0a]">$500 credit</strong> toward your next month. No limit on referrals.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
