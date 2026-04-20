export default function IntakePage() {
  return (
    <div>
      {/* Header */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 pb-10">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#B8902A] mb-3">Client Intake</p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#0D0D0D] mb-5">
          Tell us about your world.
        </h1>
        <p className="text-[#6B6B6B] text-lg leading-relaxed">
          The more detail you give us, the better we can configure your assistant. This takes about 5 minutes. We&apos;ll follow up within 24 hours with a tailored recommendation.
        </p>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">
        <form
          action="https://formspree.io/f/jarvis@simpyhq.com"
          method="POST"
          className="space-y-10"
        >
          {/* Section 1 — About You */}
          <div className="bg-white border border-[#E2E0DA] rounded-lg p-6 sm:p-8">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#0F1B3C] mb-6">01 — About You</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Full Name *</label>
                  <input type="text" name="name" required placeholder="Your full name"
                    className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C]" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Email Address *</label>
                  <input type="email" name="email" required placeholder="you@company.com"
                    className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C]" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Phone (optional)</label>
                  <input type="tel" name="phone" placeholder="(555) 000-0000"
                    className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C]" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Location / Timezone</label>
                  <input type="text" name="location" placeholder="e.g. Dallas, TX — Central"
                    className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C]" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">I am a... *</label>
                <select name="client_type" required
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] focus:outline-none focus:border-[#0F1B3C] appearance-none">
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

          {/* Section 2 — Your Business / Life */}
          <div className="bg-white border border-[#E2E0DA] rounded-lg p-6 sm:p-8">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#0F1B3C] mb-6">02 — Your Business or Life</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Company / Organization (if applicable)</label>
                <input type="text" name="company" placeholder="Company name and what it does"
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Describe your day-to-day in a few sentences *</label>
                <textarea name="day_to_day" required rows={4} placeholder="What does a typical day look like? What takes up most of your time? What do you wish you could hand off?"
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C] resize-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">What are your biggest pain points right now?</label>
                <textarea name="pain_points" rows={3} placeholder="e.g. Financial reports take too long, I miss client follow-ups, my inbox is unmanageable..."
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C] resize-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">What goals are you working toward in the next 6–12 months?</label>
                <textarea name="goals" rows={3} placeholder="e.g. Grow revenue 20%, land a summer internship, close my first real estate deal..."
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C] resize-none" />
              </div>
            </div>
          </div>

          {/* Section 3 — Tools & Systems */}
          <div className="bg-white border border-[#E2E0DA] rounded-lg p-6 sm:p-8">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#0F1B3C] mb-6">03 — Tools & Systems You Use</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">Accounting / Finance</label>
                <div className="flex flex-wrap gap-2">
                  {["QuickBooks", "Xero", "FreshBooks", "Wave", "Excel/Sheets", "None", "Other"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 bg-[#F8F7F3] border border-[#E2E0DA] rounded px-3 py-2 cursor-pointer hover:border-[#0F1B3C] text-sm text-[#444]">
                      <input type="checkbox" name="tools_finance" value={opt} className="accent-[#0F1B3C]" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widests uppercase text-[#6B6B6B] mb-3">CRM / Sales</label>
                <div className="flex flex-wrap gap-2">
                  {["HubSpot", "Salesforce", "Pipedrive", "Notion", "Airtable", "Spreadsheet", "None", "Other"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 bg-[#F8F7F3] border border-[#E2E0DA] rounded px-3 py-2 cursor-pointer hover:border-[#0F1B3C] text-sm text-[#444]">
                      <input type="checkbox" name="tools_crm" value={opt} className="accent-[#0F1B3C]" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">Email</label>
                <div className="flex flex-wrap gap-2">
                  {["Gmail", "Outlook", "Apple Mail", "Other"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 bg-[#F8F7F3] border border-[#E2E0DA] rounded px-3 py-2 cursor-pointer hover:border-[#0F1B3C] text-sm text-[#444]">
                      <input type="checkbox" name="tools_email" value={opt} className="accent-[#0F1B3C]" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Any other tools we should know about?</label>
                <input type="text" name="tools_other" placeholder="e.g. Shopify, Buildium, Clio, custom software..."
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C]" />
              </div>
            </div>
          </div>

          {/* Section 4 — What You Want to Automate */}
          <div className="bg-white border border-[#E2E0DA] rounded-lg p-6 sm:p-8">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#0F1B3C] mb-6">04 — What You Want to Automate</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">Check everything you&apos;d like your assistant to handle</label>
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
                    <label key={opt} className="flex items-start gap-2.5 bg-[#F8F7F3] border border-[#E2E0DA] rounded px-3 py-2.5 cursor-pointer hover:border-[#0F1B3C] text-sm text-[#444]">
                      <input type="checkbox" name="automate" value={opt} className="accent-[#0F1B3C] mt-0.5 flex-shrink-0" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Anything else you want to automate or have the AI help with?</label>
                <textarea name="automate_other" rows={4} placeholder="Be as specific as possible — the more detail the better. If you have a recurring task that drives you crazy, describe it here."
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C] resize-none" />
              </div>
            </div>
          </div>

          {/* Section 5 — Communication Preferences */}
          <div className="bg-white border border-[#E2E0DA] rounded-lg p-6 sm:p-8">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-[#0F1B3C] mb-6">05 — How You Want to Communicate</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">Preferred messaging channel(s) *</label>
                <div className="flex flex-wrap gap-2">
                  {["WhatsApp", "iMessage", "Discord", "Email", "Telegram", "Not sure yet"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 bg-[#F8F7F3] border border-[#E2E0DA] rounded px-3 py-2 cursor-pointer hover:border-[#0F1B3C] text-sm text-[#444]">
                      <input type="checkbox" name="channels" value={opt} className="accent-[#0F1B3C]" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">What time do you typically start your day?</label>
                <input type="text" name="start_time" placeholder="e.g. 7:00 AM — I want my briefing before 8"
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Personality preference for your assistant</label>
                <select name="personality" className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] focus:outline-none focus:border-[#0F1B3C] appearance-none">
                  <option value="">No preference</option>
                  <option>Direct and concise — just the facts, no filler</option>
                  <option>Warm and conversational — friendly, approachable</option>
                  <option>Formal and professional — always business-appropriate</option>
                  <option>A mix depending on context</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 6 — Plan & Budget */}
          <div className="bg-white border border-[#E2E0DA] rounded-lg p-6 sm:p-8">
            <h2 className="text-[11px] font-bold tracking-widests uppercase text-[#0F1B3C] mb-6">06 — Plan & Timeline</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Which plan are you leaning toward?</label>
                <select name="plan" className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] focus:outline-none focus:border-[#0F1B3C] appearance-none">
                  <option value="">Not sure — help me decide</option>
                  <option>Personal — $2,500 setup + $500/month</option>
                  <option>Professional — $3,500 setup + $750/month</option>
                  <option>Business Standard — $5,000 setup + $1,000/month</option>
                  <option>Business Premium — $5,000 setup + $1,500/month</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">How soon do you want to get started?</label>
                <select name="timeline" className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] focus:outline-none focus:border-[#0F1B3C] appearance-none">
                  <option value="">Select one</option>
                  <option>As soon as possible</option>
                  <option>Within the next 2–4 weeks</option>
                  <option>Within the next 1–2 months</option>
                  <option>Just exploring for now</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Anything else you want us to know?</label>
                <textarea name="other" rows={4} placeholder="Questions, concerns, specific requirements, referral info, or anything else on your mind."
                  className="w-full bg-[#F8F7F3] border border-[#E2E0DA] rounded px-4 py-2.5 text-sm text-[#0D0D0D] placeholder-[#ABABAB] focus:outline-none focus:border-[#0F1B3C] resize-none" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button type="submit"
              className="w-full sm:w-auto bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white px-12 py-4 rounded font-medium text-[15px] transition-colors">
              Submit Intake Form
            </button>
            <p className="text-[#ABABAB] text-xs mt-4">We&apos;ll review your submission and follow up within 24 hours at the email you provided.</p>
          </div>
        </form>
      </section>
    </div>
  );
}
