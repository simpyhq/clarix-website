"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";

const inputCls = "w-full bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#334155] transition-colors";
const labelCls = "block text-[11px] font-semibold tracking-widest uppercase text-[#64748b] mb-2";
const cardCls  = "bg-white border border-[#e2e8f0] rounded-xl p-6 sm:p-8";
const checkCls = "flex items-center gap-2 bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg px-3 py-2 cursor-pointer hover:border-[#334155] text-sm text-[#334155] select-none";

export default function IntakePage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const fd   = new FormData(form);
    const data: Record<string, string | string[]> = {};

    // Collect all values — checkboxes become arrays
    const seen: Record<string, string[]> = {};
    fd.forEach((val, key) => {
      if (!seen[key]) seen[key] = [];
      seen[key].push(val as string);
    });
    for (const [k, v] of Object.entries(seen)) {
      data[k] = v.length === 1 ? v[0] : v;
    }

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white text-[#0f172a] min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <CheckCircle size={40} className="text-[#0f172a] mx-auto mb-5" strokeWidth={1.5} />
          <h1 className="text-2xl font-medium tracking-tight mb-3">We got it.</h1>
          <p className="text-[#64748b] text-[15px] leading-relaxed">
            We&apos;ll review your submission and follow up within 24 hours at the email you provided with a tailored recommendation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#0f172a]">
      <section className="max-w-3xl mx-auto px-6 sm:px-8 pt-20 pb-10">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#64748b] mb-3">Client Intake</p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0f172a] mb-5">
          Tell us about your world.
        </h1>
        <p className="text-[#64748b] text-[15px] leading-relaxed">
          The more detail you give us, the better we can configure your assistant. This takes about 5 minutes. We&apos;ll follow up within 24 hours.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 sm:px-8 pb-24">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* 01 — About You */}
          <div className={cardCls}>
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-6">01 — About You</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input type="text" name="name" required placeholder="Your full name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input type="email" name="email" required placeholder="you@company.com" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Phone (optional)</label>
                  <input type="tel" name="phone" placeholder="(555) 000-0000" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Location / Timezone</label>
                  <input type="text" name="location" placeholder="e.g. Dallas, TX — Central" className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>I am a... *</label>
                <select name="client_type" required className={inputCls}>
                  <option value="">Select one</option>
                  <option>Individual — student, executive, creator, or high-performer</option>
                  <option>Professional — real estate, legal, finance, consulting, or healthcare</option>
                  <option>Business owner — $1M–$25M revenue</option>
                  <option>Business owner — $25M+ revenue</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* 02 — Your Business / Life */}
          <div className={cardCls}>
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-6">02 — Your Business or Life</h2>
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Company / Organization (if applicable)</label>
                <input type="text" name="company" placeholder="Company name and what it does" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Describe your day-to-day in a few sentences *</label>
                <textarea name="day_to_day" required rows={4}
                  placeholder="What does a typical day look like? What takes up most of your time? What do you wish you could hand off?"
                  className={inputCls + " resize-none"} />
              </div>
              <div>
                <label className={labelCls}>What are your biggest pain points right now?</label>
                <textarea name="pain_points" rows={3}
                  placeholder="e.g. Financial reports take too long, I miss client follow-ups, my inbox is unmanageable..."
                  className={inputCls + " resize-none"} />
              </div>
              <div>
                <label className={labelCls}>What goals are you working toward in the next 6–12 months?</label>
                <textarea name="goals" rows={3}
                  placeholder="e.g. Grow revenue 20%, land a summer internship, close my first real estate deal..."
                  className={inputCls + " resize-none"} />
              </div>
            </div>
          </div>

          {/* 03 — Tools */}
          <div className={cardCls}>
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-6">03 — Tools & Systems You Use</h2>
            <div className="space-y-5">
              {[
                { label: "Accounting / Finance", name: "tools_finance", opts: ["QuickBooks","Xero","FreshBooks","Wave","Excel/Sheets","None","Other"] },
                { label: "CRM / Sales",           name: "tools_crm",     opts: ["HubSpot","Salesforce","Pipedrive","Notion","Airtable","Spreadsheet","None","Other"] },
                { label: "Email",                  name: "tools_email",   opts: ["Gmail","Outlook","Apple Mail","Other"] },
              ].map((group) => (
                <div key={group.name}>
                  <label className={labelCls}>{group.label}</label>
                  <div className="flex flex-wrap gap-2">
                    {group.opts.map((opt) => (
                      <label key={opt} className={checkCls}>
                        <input type="checkbox" name={group.name} value={opt} className="accent-[#0f172a]" />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <label className={labelCls}>Any other tools we should know about?</label>
                <input type="text" name="tools_other" placeholder="e.g. Shopify, Buildium, Clio, custom software..." className={inputCls} />
              </div>
            </div>
          </div>

          {/* 04 — Automate */}
          <div className={cardCls}>
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-6">04 — What You Want to Automate</h2>
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Check everything you&apos;d like your assistant to handle</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Daily briefings (weather, news, calendar)",
                    "Email monitoring & priority filtering",
                    "Email drafting & replies",
                    "Financial reporting (P&L, cash flow)",
                    "KPI dashboards & weekly reports",
                    "Client follow-up reminders",
                    "Scheduling & calendar management",
                    "Research & competitive analysis",
                    "Vendor & invoice tracking",
                    "Deadline & task reminders",
                    "Document drafting & summarization",
                    "Web research on demand",
                    "Market/industry news monitoring",
                    "Social media monitoring",
                    "Health & personal goal tracking",
                    "Travel planning & logistics",
                  ].map((opt) => (
                    <label key={opt} className={checkCls + " items-start"}>
                      <input type="checkbox" name="automate" value={opt} className="accent-[#0f172a] mt-0.5 flex-shrink-0" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Anything else you want to automate?</label>
                <textarea name="automate_other" rows={4}
                  placeholder="Be as specific as possible — the more detail the better."
                  className={inputCls + " resize-none"} />
              </div>
            </div>
          </div>

          {/* 05 — Communication */}
          <div className={cardCls}>
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-6">05 — How You Want to Communicate</h2>
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Preferred messaging channel(s) *</label>
                <div className="flex flex-wrap gap-2">
                  {["WhatsApp","iMessage","Discord","Email","Telegram","Not sure yet"].map((opt) => (
                    <label key={opt} className={checkCls}>
                      <input type="checkbox" name="channels" value={opt} className="accent-[#0f172a]" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>What time do you typically start your day?</label>
                <input type="text" name="start_time" placeholder="e.g. 7:00 AM — I want my briefing before 8" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Personality preference for your assistant</label>
                <select name="personality" className={inputCls}>
                  <option value="">No preference</option>
                  <option>Direct and concise — just the facts, no filler</option>
                  <option>Warm and conversational — friendly, approachable</option>
                  <option>Formal and professional — always business-appropriate</option>
                  <option>A mix depending on context</option>
                </select>
              </div>
            </div>
          </div>

          {/* 06 — Plan */}
          <div className={cardCls}>
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-6">06 — Plan & Timeline</h2>
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Which plan are you leaning toward?</label>
                <select name="plan" className={inputCls}>
                  <option value="">Not sure — help me decide</option>
                  <option>Basic — $2,500 setup + $100/month</option>
                  <option>Pro — $2,500 setup + $250/month</option>
                  <option>Hourly work only — $125/hr</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>How soon do you want to get started?</label>
                <select name="timeline" className={inputCls}>
                  <option value="">Select one</option>
                  <option>As soon as possible</option>
                  <option>Within the next 2–4 weeks</option>
                  <option>Within the next 1–2 months</option>
                  <option>Just exploring for now</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Anything else you want us to know?</label>
                <textarea name="other" rows={4}
                  placeholder="Questions, concerns, specific requirements, referral info, or anything else on your mind."
                  className={inputCls + " resize-none"} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            {status === "error" && (
              <p className="text-red-500 text-sm mb-4">Something went wrong. Please try again or email us at jarvis@simpyhq.com</p>
            )}
            <button type="submit" disabled={status === "submitting"}
              className="inline-flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] disabled:bg-[#94a3b8] text-white px-12 py-4 rounded-lg font-medium text-[15px] transition-colors w-full sm:w-auto">
              {status === "submitting" ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting...</>
              ) : (
                <>Submit Intake Form <ArrowRight size={16} /></>
              )}
            </button>
            <p className="text-[#94a3b8] text-xs mt-4">We&apos;ll follow up within 24 hours at the email you provided.</p>
          </div>

        </form>
      </section>
    </div>
  );
}
