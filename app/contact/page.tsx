import Link from "next/link";
import { Mail, Clock, ClipboardList } from "lucide-react";

export default function ContactPage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-8">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Contact</p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#0D0D0D] mb-5">Get in touch.</h1>
        <p className="text-[#6B6B6B] text-lg max-w-xl">
          Tell us what you need and we&apos;ll reply within a few hours — usually faster. No sales funnel, no demo calls, no wait.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
          {/* Form */}
          <div className="md:col-span-3 bg-white border border-[#E2E0DA] rounded-lg p-8">
            <form action="mailto:hello@clarix.ai" method="GET" encType="text/plain" className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2" htmlFor="name">Name</label>
                  <input
                    type="text" id="name" name="name"
                    placeholder="Your full name"
                    className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-[#0D0D0D] placeholder-[#ABABAB] text-sm focus:outline-none focus:border-[#0F1B3C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2" htmlFor="email">Email</label>
                  <input
                    type="email" id="email" name="email"
                    placeholder="you@company.com"
                    className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-[#0D0D0D] placeholder-[#ABABAB] text-sm focus:outline-none focus:border-[#0F1B3C] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2" htmlFor="type">I am a...</label>
                <select
                  id="type" name="type"
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-[#0D0D0D] text-sm focus:outline-none focus:border-[#0F1B3C] transition-colors appearance-none"
                >
                  <option value="">Select one</option>
                  <option value="individual">Individual (student, creator, executive)</option>
                  <option value="professional">Professional (real estate, legal, finance, healthcare)</option>
                  <option value="business">Business owner ($1M–$25M revenue)</option>
                  <option value="enterprise">Enterprise / large business</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2" htmlFor="plan">Plan interest</label>
                <select
                  id="plan" name="plan"
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-[#0D0D0D] text-sm focus:outline-none focus:border-[#0F1B3C] transition-colors appearance-none"
                >
                  <option value="">Not sure yet</option>
                  <option value="personal">Personal ($500/mo)</option>
                  <option value="professional">Professional ($750/mo)</option>
                  <option value="business-standard">Business Standard ($1,000/mo)</option>
                  <option value="business-premium">Business Premium ($1,500/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2" htmlFor="body">What do you need help with?</label>
                <textarea
                  id="body" name="body" rows={5}
                  placeholder="Tell us about your business, what you'd want your assistant to do, any tools you use (QuickBooks, HubSpot, etc.), and any questions you have..."
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-[#0D0D0D] placeholder-[#ABABAB] text-sm focus:outline-none focus:border-[#0F1B3C] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white py-3 rounded font-medium text-sm tracking-wide transition-colors"
              >
                Send Message
              </button>
              <p className="text-[#ABABAB] text-xs text-center">Opens your email client pre-filled. Or email us directly.</p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white border border-[#E2E0DA] rounded-lg p-6 space-y-5">
              <a href="mailto:jarvis@simpyhq.com" className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded bg-[#F8F7F3] border border-[#E2E0DA] flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-[#0F1B3C]" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold tracking-wide uppercase text-[#6B6B6B]">General</p>
                  <p className="text-sm text-[#0F1B3C] font-medium group-hover:underline">jarvis@simpyhq.com</p>
                </div>
              </a>
              <a href="mailto:michael@ospipe.com" className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded bg-[#F8F7F3] border border-[#E2E0DA] flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-[#0F1B3C]" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold tracking-wide uppercase text-[#6B6B6B]">Michael Simpson — Founder</p>
                  <p className="text-sm text-[#0F1B3C] font-medium group-hover:underline">michael@ospipe.com</p>
                </div>
              </a>
              <a href="mailto:christian.simpson.2018@outlook.com" className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded bg-[#F8F7F3] border border-[#E2E0DA] flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-[#0F1B3C]" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold tracking-wide uppercase text-[#6B6B6B]">Christian Simpson — Operations</p>
                  <p className="text-sm text-[#0F1B3C] font-medium group-hover:underline">christian.simpson.2018@outlook.com</p>
                </div>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-[#F8F7F3] border border-[#E2E0DA] flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-[#0F1B3C]" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold tracking-wide uppercase text-[#6B6B6B]">Response Time</p>
                  <p className="text-sm text-[#0D0D0D]">Usually within a few hours</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E2E0DA] rounded-lg p-6">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-4">What happens next</p>
              <ol className="space-y-3">
                {[
                  "We reply with a few qualifying questions",
                  "You share your setup preferences and priorities",
                  "We configure your assistant (48–72 hrs)",
                  "Handoff — live and ready to use",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[#444] leading-relaxed">
                    <span className="w-5 h-5 rounded bg-[#0F1B3C] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <Link href="/intake" className="block bg-[#0F1B3C] rounded-lg p-6 group hover:bg-[#1a2d5a] transition-colors">
              <div className="flex items-start gap-3">
                <ClipboardList size={18} className="text-[#D4A847] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Ready to get started?</p>
                  <p className="text-white/60 text-xs leading-relaxed">Fill out our intake form — tell us about your business and what you want to automate. We&apos;ll come back with a tailored recommendation.</p>
                  <p className="text-[#D4A847] text-xs font-medium mt-3 group-hover:underline">Start intake form →</p>
                </div>
              </div>
            </Link>

            <div className="bg-[#F8F7F3] border border-[#E2E0DA] rounded-lg p-6">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-2">Referral Program</p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Every client who refers a new client receives a <strong className="text-[#0D0D0D]">$500 credit</strong> toward their next month. No limit on referrals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
