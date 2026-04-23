"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

function Reveal({ children, delay = 0, className = "", stagger = false }: {
  children: React.ReactNode; delay?: number; className?: string; stagger?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`${stagger ? "stagger" : "reveal"} ${className}`}
      style={!stagger ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

function Terminal() {
  const lines: Array<{ type: string; label?: string; value?: string; text?: string }> = [
    { type: "comment", text: "# Wednesday, 9:04am — Jarvis morning briefing" },
    { type: "blank" },
    { type: "label", label: "weather",     value: "Fort Worth, TX  74°F  Partly cloudy" },
    { type: "label", label: "markets",     value: "S&P +0.4%  BTC $83K  NVDA up after hours" },
    { type: "label", label: "calendar",    value: "Client call at 2pm — brief prepped" },
    { type: "label", label: "email",       value: "3 new — 1 flagged urgent (vendor re: contract)" },
    { type: "label", label: "action",      value: "Draft reply ready — check your inbox" },
    { type: "blank" },
    { type: "comment", text: "# Sent to WhatsApp · cost: $0.004" },
    { type: "prompt" },
  ];

  return (
    <div className="w-full rounded-xl overflow-hidden border border-[#e2e8f0] shadow-2xl">
      <div className="bg-[#f1f3f5] border-b border-[#e2e8f0] px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
        <div className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
        <div className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
        <div className="ml-3 flex-1 bg-white border border-[#e2e8f0] rounded text-center text-[11px] text-[#94a3b8] py-0.5 max-w-[180px] mx-auto font-mono">
          jarvis@mac-mini
        </div>
      </div>
      <div className="bg-[#f8f9fa] px-5 py-5 font-mono text-[13px] leading-7">
        {lines.map((line, i) => (
          <div key={i}>
            {line.type === "comment" && <span className="text-[#94a3b8]">{line.text}</span>}
            {line.type === "label" && (
              <div className="flex gap-3">
                <span className="text-[#334155] font-medium w-24 flex-shrink-0">{line.label}</span>
                <span className="text-[#334155]">{line.value}</span>
              </div>
            )}
            {line.type === "prompt" && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[#0f172a]">❯</span>
                <span className="w-2 h-4 bg-[#0f172a] opacity-80 cursor-blink inline-block" />
              </div>
            )}
            {line.type === "blank" && <div className="h-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}

const faqs = [
  { q: "Do I need technical knowledge?",      a: "None. Fill out our intake form, tell us what you want, and we handle everything." },
  { q: "What are API credits?",               a: "Your assistant uses Claude by Anthropic. You pay Anthropic directly — typically $30–80/month. We optimize model routing to keep this as low as possible." },
  { q: "Who owns the hardware and data?",     a: "You do. The Mac mini ships to you. Your data lives on your machine — not on our servers, not in the cloud." },
  { q: "How long does setup take?",           a: "We come to you in the DFW area for a hands-on setup session. Most clients are live the same day or next day." },
  { q: "Where do you serve clients?",         a: "We're based in Dallas-Fort Worth and handle all initial setups in person. Ongoing support is fully remote — no need for us on-site after that." },
  { q: "What if I want changes after setup?", a: "Covered under the monthly fee. Support is handled remotely. If on-site work is ever needed, it's billed at $125/hr." },
  { q: "Can I cancel?",                       a: "Yes, any time. Monthly billing, no contracts. The Mac mini stays with you." },
];

export default function HomePage() {
  return (
    <div className="bg-white text-[#0f172a]">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="animate-fade-in inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] border border-[#e2e8f0] bg-[#f1f3f5] px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Live in DFW — Currently accepting clients
            </div>

            <h1 className="animate-fade-in-up delay-100 text-[2.2rem] sm:text-[2.8rem] md:text-5xl font-medium leading-[1.06] tracking-tight mb-7 text-[#0f172a]">
              An AI that knows<br />
              your business.<br />
              <span className="text-[#94a3b8]">Not just questions.</span>
            </h1>

            <p className="animate-fade-in-up delay-200 text-[15px] text-[#64748b] leading-relaxed max-w-lg mb-6">
              You&apos;ve tried ChatGPT. It&apos;s useful for 10 minutes. This is different — a configured assistant that runs on hardware you own, knows your clients, your workflows, and your goals, and does things without being asked.
            </p>

            <p className="animate-fade-in-up delay-250 text-[15px] text-[#64748b] leading-relaxed max-w-lg mb-10">
              We build it, configure it, and maintain it. You just talk to it.
            </p>

            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-3 mb-12">
              <Link href="/intake"
                className="inline-flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-3 rounded-lg font-semibold text-[14px]">
                Get Started <ArrowRight size={14} />
              </Link>
              <Link href="/services"
                className="inline-flex items-center justify-center gap-2 border border-[#e2e8f0] hover:border-[#94a3b8] text-[#334155] hover:text-[#0f172a] px-6 py-3 rounded-lg font-medium text-[14px]">
                See How It Works
              </Link>
            </div>

            <p className="animate-fade-in delay-500 text-[13px] text-[#94a3b8]">
              $2,500 setup · $100–$250/mo · No contracts · Hardware yours to keep
            </p>
          </div>

          <div className="animate-fade-in-up delay-400 lg:pt-4">
            <Terminal />
            <p className="text-[12px] text-[#94a3b8] mt-3 text-center">
              This is what it looks like every morning — real output from a live system
            </p>
          </div>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="border-t border-[#e2e8f0] bg-[#f8f9fa] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
            <Reveal>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-5">Where This Came From</p>
              <h2 className="text-2xl sm:text-3xl font-medium leading-[1.1] tracking-tight mb-6">
                We built this for ourselves first.
              </h2>
              <p className="text-[#64748b] leading-relaxed text-[15px] mb-4">
                Michael Simpson runs a 25-person energy company in Fort Worth. A few years ago, hiring a full-time CFO wasn&apos;t in the budget. So he built one — an AI called Hank that handles financial reporting, vendor tracking, and daily operations briefings. It runs on a Mac mini in his office and checks in every morning before he opens his laptop.
              </p>
              <p className="text-[#64748b] leading-relaxed text-[15px] mb-4">
                Christian — his son, finance student at OU — built his own version. Internship tracking, class deadlines, market briefings, research. Same architecture, different life.
              </p>
              <p className="text-[#64748b] leading-relaxed text-[15px]">
                When they started telling people about it, the response was always the same: <em className="text-[#0f172a] not-italic font-medium">&ldquo;I want that. How do I get that?&rdquo;</em> That&apos;s why Clarix exists.
              </p>
            </Reveal>

            <Reveal delay={150} className="space-y-0">
              {[
                { label: "The first client",  value: "CHP Energy Services — $25M company, live since 2024" },
                { label: "What it replaced",  value: "Functions that would have cost $150K+/yr in human labor" },
                { label: "Where it runs",     value: "A Mac mini. On your desk. Under your control." },
                { label: "Who maintains it",  value: "Us. Monthly, remotely. You don't touch it." },
                { label: "Service area",      value: "Dallas-Fort Worth for setup. Remote support everywhere." },
              ].map((item, i, arr) => (
                <div key={item.label} className={`py-5 ${i !== arr.length - 1 ? "border-b border-[#e2e8f0]" : ""}`}>
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-[#94a3b8] mb-1.5">{item.label}</p>
                  <p className="text-[14px] text-[#0f172a] leading-relaxed">{item.value}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* DAY IN THE LIFE */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20 md:py-28">
        <Reveal className="mb-14">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-4">A Typical Tuesday</p>
          <h2 className="text-2xl sm:text-3xl md:text-[2.4rem] font-medium leading-[1.1] tracking-tight max-w-2xl">
            What it actually does<br />
            <span className="text-[#94a3b8]">while you sleep.</span>
          </h2>
        </Reveal>

        <div className="space-y-0 max-w-3xl">
          {[
            { time: "6:30am",  event: "Morning briefing delivered to your WhatsApp. Weather, calendar, overnight emails flagged by priority, market summary if relevant." },
            { time: "7:15am",  event: "You reply \"draft a response to that vendor email.\" It does. You review and send in 30 seconds." },
            { time: "9:00am",  event: "Automated P&L pulled from QuickBooks. Summary in your inbox before your first meeting." },
            { time: "2:00pm",  event: "Client meeting. You mentioned a competitor three weeks ago. Your assistant already has context notes ready if you ask." },
            { time: "5:00pm",  event: "End-of-day digest. Three things that need your attention tomorrow, flagged automatically." },
            { time: "11:00pm", event: "You're asleep. It's monitoring email, watching for anything urgent, and preparing tomorrow's briefing." },
          ].map((item, i, arr) => (
            <Reveal key={item.time} delay={i * 60}>
              <div className={`flex gap-6 sm:gap-10 items-start py-6 ${i !== arr.length - 1 ? "border-b border-[#e2e8f0]" : ""}`}>
                <div className="w-16 flex-shrink-0">
                  <span className="font-mono text-[12px] text-[#94a3b8]">{item.time}</span>
                </div>
                <p className="text-[14px] text-[#64748b] leading-relaxed">{item.event}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHAT MAKES IT DIFFERENT */}
      <section className="border-t border-[#e2e8f0] bg-[#f8f9fa] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-14">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-4">Why It&apos;s Different</p>
            <h2 className="text-2xl sm:text-3xl md:text-[2.4rem] font-medium leading-[1.1] tracking-tight max-w-2xl">
              Not a chatbot.<br />
              <span className="text-[#94a3b8]">A system.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "It remembers everything",
                desc: "Every conversation, decision, client name, and preference is stored permanently. Tell it something once — it knows it forever. No re-explaining yourself to a blank slate every session.",
              },
              {
                title: "It acts without being asked",
                desc: "Scheduled briefings, automated reports, proactive alerts. It doesn't wait for you to open an app. It shows up in your WhatsApp or inbox like a real team member.",
              },
              {
                title: "It runs on hardware you own",
                desc: "Your AI lives on a Mac mini at your location. Not in a shared cloud. Not on our servers. You own it. If you cancel, it keeps running as long as you have API credits.",
              },
              {
                title: "We configure it for your specific life",
                desc: "We spend hours during onboarding learning your industry, your clients, your workflows, and your goals. It's not generic. It knows the difference between a regular Tuesday and a Tuesday before quarter-end.",
              },
              {
                title: "We keep it running",
                desc: "Software updates, model upgrades, new integrations as your needs change — we handle all of it remotely every month. You never have to maintain it.",
              },
              {
                title: "You talk to it like a person",
                desc: "WhatsApp, iMessage, Discord, or email. No new apps. No dashboards to learn. Just text it like you'd text a sharp person on your team.",
              },
            ].map((item) => (
              <Reveal key={item.title}>
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 h-full hover:border-[#94a3b8] transition-colors">
                  <h3 className="font-semibold text-[#0f172a] text-[14px] mb-3">{item.title}</h3>
                  <p className="text-[#64748b] text-[13px] leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MODEL ROUTING CALLOUT */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20 md:py-28">
        <Reveal>
          <div className="border border-[#e2e8f0] bg-[#f8f9fa] rounded-xl p-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-4">On Cost</p>
                <h2 className="text-xl sm:text-2xl font-medium mb-4 tracking-tight">
                  We&apos;re obsessive about keeping AI costs low.
                </h2>
                <p className="text-[#64748b] leading-relaxed text-[15px]">
                  Not every task needs the most expensive model. Routine briefings run on fast, cheap models. Complex analysis and important decisions get premium models. Most clients land at $30–80/month in API credits — we&apos;ve seen it, we monitor it, and we optimize it ongoing.
                </p>
              </div>
              <div className="space-y-3 font-mono text-[13px]">
                {[
                  { task: "Daily briefings",      model: "Gemini Flash",   cost: "~$0.003/run",  color: "text-green-500" },
                  { task: "Email monitoring",     model: "Ollama (local)",  cost: "$0.00/run",    color: "text-green-500" },
                  { task: "Complex analysis",     model: "Claude Sonnet",  cost: "~$0.04/run",   color: "text-yellow-500" },
                  { task: "Important decisions",  model: "Claude Sonnet",  cost: "as needed",    color: "text-yellow-500" },
                ].map((r) => (
                  <div key={r.task} className="flex items-center justify-between bg-white border border-[#e2e8f0] rounded-lg px-4 py-3">
                    <div>
                      <span className="text-[#334155]">{r.task}</span>
                      <span className="text-[#94a3b8] mx-2">→</span>
                      <span className="text-[#0f172a]">{r.model}</span>
                    </div>
                    <span className={`text-[12px] ${r.color}`}>{r.cost}</span>
                  </div>
                ))}
                <p className="text-[#94a3b8] text-[12px] pt-1">Most clients spend $30–80/mo on API credits. We keep it there.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* PRICING */}
      <section className="border-t border-[#e2e8f0] bg-[#f8f9fa] py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-14">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-4">Pricing</p>
            <h2 className="text-2xl sm:text-3xl md:text-[2.4rem] font-medium leading-[1.1] tracking-tight">
              One setup. One monthly fee.<br />
              <span className="text-[#94a3b8]">No surprises.</span>
            </h2>
            <p className="text-[#64748b] text-[15px] mt-4 max-w-xl leading-relaxed">
              $2,500 to set it up — that covers the discovery session, hardware configuration, and your first two months of support. After that, $100–$250/month keeps everything running and improving.
            </p>
          </Reveal>
          <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {[
              { name: "Basic",  price: "$100", for: "Individuals & students",    plan: "/mo · after $2,500 setup" },
              { name: "Pro",    price: "$250", for: "Businesses & professionals", plan: "/mo · after $2,500 setup", featured: true },
            ].map((t) => (
              <div key={t.name}
                className={`rounded-xl p-7 flex flex-col h-full border ${
                  t.featured
                    ? "bg-[#f1f3f5] border-[#e2e8f0]"
                    : "bg-white border-[#e2e8f0]"
                }`}>
                <p className="text-[11px] font-semibold tracking-widest uppercase mb-1 text-[#0f172a]">{t.name}</p>
                <p className="text-[13px] text-[#94a3b8] mb-5">{t.for}</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-[#0f172a]">{t.price}</span>
                  <span className="text-[13px] text-[#94a3b8] mb-1">{t.plan}</span>
                </div>
                <Link href="/intake"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[13px] mt-auto ${
                    t.featured
                      ? "bg-[#0f172a] text-white hover:bg-[#1e293b]"
                      : "border border-[#e2e8f0] hover:border-[#94a3b8] text-[#334155] hover:text-[#0f172a]"
                  }`}>
                  Get started <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </Reveal>
          <Reveal>
            <p className="text-center text-[13px] text-[#94a3b8] mt-8">
              <Link href="/pricing" className="text-[#0f172a] hover:text-[#334155]">Full pricing breakdown including hourly rates →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-20 md:py-28">
        <Reveal className="mb-14">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-4">FAQ</p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">Common questions.</h2>
        </Reveal>
        {faqs.map((faq, i) => (
          <Reveal key={faq.q} delay={i * 50}>
            <div className={`py-6 ${i !== faqs.length - 1 ? "border-b border-[#e2e8f0]" : ""}`}>
              <h3 className="font-semibold text-[#0f172a] mb-2 text-[15px]">{faq.q}</h3>
              <p className="text-[14px] text-[#64748b] leading-relaxed">{faq.a}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* CTA */}
      <section className="border-t border-[#e2e8f0]">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 md:py-28 text-center">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-6">Ready?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.08] mb-6 text-[#0f172a] tracking-tight">
              Let&apos;s see if it&apos;s a fit.
            </h2>
            <p className="text-[#64748b] text-[15px] max-w-lg mx-auto mb-12 leading-relaxed">
              Fill out the intake form and we&apos;ll show you exactly what your assistant would look like — before you spend anything.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href="/intake"
                className="inline-flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white px-8 py-4 rounded-lg font-bold text-[15px]">
                Start Intake Form <ArrowRight size={16} />
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-[#e2e8f0] hover:border-[#94a3b8] text-[#64748b] hover:text-[#0f172a] px-8 py-4 rounded-lg font-medium text-[15px]">
                See Full Pricing
              </Link>
            </div>
            <p className="text-[12px] text-[#94a3b8]">
              No contracts · Hardware yours to keep · Cancel any time
            </p>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
