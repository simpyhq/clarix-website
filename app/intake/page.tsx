"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle } from "lucide-react";

const inputCls: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-2)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  padding: "10px 14px",
  fontSize: "14px",
  color: "var(--ink)",
  outline: "none",
  transition: "border-color 0.15s ease",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--ink-2)",
  marginBottom: "8px",
};

const cardStyle: React.CSSProperties = {
  background: "var(--bg-2)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "28px 28px",
};

const checkItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "var(--bg-3)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: "13px",
  color: "var(--ink-2)",
  userSelect: "none",
};

function StyledInput({ name, type = "text", placeholder, required }: {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      style={inputCls}
      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--gold-soft)"; }}
      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
    />
  );
}

function StyledTextarea({ name, rows, placeholder, required }: {
  name: string;
  rows: number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <textarea
      name={name}
      rows={rows}
      required={required}
      placeholder={placeholder}
      style={{ ...inputCls, resize: "none" }}
      onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--gold-soft)"; }}
      onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"; }}
    />
  );
}

function StyledSelect({ name, required, children }: {
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      required={required}
      style={{ ...inputCls, appearance: "auto" }}
      onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = "var(--gold-soft)"; }}
      onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = "var(--border)"; }}
    >
      {children}
    </select>
  );
}

export default function IntakePage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: Record<string, string | string[]> = {};

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
      <div
        style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "60vh" }}
        className="flex items-center justify-center px-6"
      >
        <div className="max-w-md text-center">
          <CheckCircle
            size={40}
            style={{ color: "var(--gold)", margin: "0 auto 20px" }}
            strokeWidth={1.5}
          />
          <h1
            className="font-serif"
            style={{ fontSize: "1.8rem", marginBottom: "12px", color: "var(--ink)" }}
          >
            We got it.
          </h1>
          <p style={{ color: "var(--ink-3)", fontSize: "15px", lineHeight: 1.7 }}>
            We&apos;ll review your submission and follow up within 24 hours at the email you provided.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <section className="max-w-3xl mx-auto px-6 sm:px-8 pt-20 pb-10">
        <p
          style={{
            color: "var(--gold)",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Access Request
        </p>
        <h1
          className="font-serif"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "16px", color: "var(--ink)" }}
        >
          Tell us about yourself and what you need.
        </h1>
        <p style={{ color: "var(--ink-3)", fontSize: "14px", lineHeight: 1.7 }}>
          The more detail you give us, the better we can configure your system. We&apos;ll follow up within 24 hours.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 sm:px-8 pb-24">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* 01 — About You */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: "24px",
              }}
            >
              01 — About You
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <StyledInput type="text" name="name" required placeholder="Your full name" />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <StyledInput type="email" name="email" required placeholder="you@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label style={labelStyle}>Phone (optional)</label>
                  <StyledInput type="tel" name="phone" placeholder="(555) 000-0000" />
                </div>
                <div>
                  <label style={labelStyle}>Location / Timezone</label>
                  <StyledInput type="text" name="location" placeholder="e.g. Dallas, TX — Central" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>I am a... *</label>
                <StyledSelect name="client_type" required>
                  <option value="">Select one</option>
                  <option>Individual — student, executive, creator, or high-performer</option>
                  <option>Professional — real estate, legal, finance, consulting, or healthcare</option>
                  <option>Business owner — $1M–$25M revenue</option>
                  <option>Business owner — $25M+ revenue</option>
                  <option>Other</option>
                </StyledSelect>
              </div>
            </div>
          </div>

          {/* 02 — Your Business / Life */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: "24px",
              }}
            >
              02 — Your Business or Life
            </h2>
            <div className="space-y-5">
              <div>
                <label style={labelStyle}>Company / Organization (if applicable)</label>
                <StyledInput type="text" name="company" placeholder="Company name and what it does" />
              </div>
              <div>
                <label style={labelStyle}>Describe your day-to-day in a few sentences *</label>
                <StyledTextarea
                  name="day_to_day"
                  required
                  rows={4}
                  placeholder="What does a typical day look like? What takes up most of your time? What do you wish you could hand off?"
                />
              </div>
              <div>
                <label style={labelStyle}>What are your biggest pain points right now?</label>
                <StyledTextarea
                  name="pain_points"
                  rows={3}
                  placeholder="e.g. Financial reports take too long, I miss client follow-ups, my inbox is unmanageable..."
                />
              </div>
              <div>
                <label style={labelStyle}>What goals are you working toward in the next 6–12 months?</label>
                <StyledTextarea
                  name="goals"
                  rows={3}
                  placeholder="e.g. Grow revenue 20%, land a summer internship, close my first real estate deal..."
                />
              </div>
            </div>
          </div>

          {/* 03 — Tools */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: "24px",
              }}
            >
              03 — Tools &amp; Systems You Use
            </h2>
            <div className="space-y-5">
              {[
                { label: "Accounting / Finance", name: "tools_finance", opts: ["QuickBooks","Xero","FreshBooks","Wave","Excel/Sheets","None","Other"] },
                { label: "CRM / Sales",          name: "tools_crm",     opts: ["HubSpot","Salesforce","Pipedrive","Notion","Airtable","Spreadsheet","None","Other"] },
                { label: "Email",                name: "tools_email",   opts: ["Gmail","Outlook","Apple Mail","Other"] },
              ].map((group) => (
                <div key={group.name}>
                  <label style={labelStyle}>{group.label}</label>
                  <div className="flex flex-wrap gap-2">
                    {group.opts.map((opt) => (
                      <label key={opt} style={checkItemStyle}>
                        <input
                          type="checkbox"
                          name={group.name}
                          value={opt}
                          style={{ accentColor: "var(--gold)" }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <label style={labelStyle}>Any other tools we should know about?</label>
                <StyledInput type="text" name="tools_other" placeholder="e.g. Shopify, Buildium, Clio, custom software..." />
              </div>
            </div>
          </div>

          {/* 04 — Automate */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: "24px",
              }}
            >
              04 — What You Want to Automate
            </h2>
            <div className="space-y-5">
              <div>
                <label style={labelStyle}>Check everything you&apos;d like your assistant to handle</label>
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
                    <label key={opt} style={{ ...checkItemStyle, alignItems: "flex-start" }}>
                      <input
                        type="checkbox"
                        name="automate"
                        value={opt}
                        style={{ accentColor: "var(--gold)", marginTop: "2px", flexShrink: 0 }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Anything else you want to automate?</label>
                <StyledTextarea
                  name="automate_other"
                  rows={4}
                  placeholder="Be as specific as possible — the more detail the better."
                />
              </div>
            </div>
          </div>

          {/* 05 — Communication */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: "24px",
              }}
            >
              05 — How You Want to Communicate
            </h2>
            <div className="space-y-5">
              <div>
                <label style={labelStyle}>Preferred messaging channel(s) *</label>
                <div className="flex flex-wrap gap-2">
                  {["WhatsApp","iMessage","Discord","Email","Telegram","Not sure yet"].map((opt) => (
                    <label key={opt} style={checkItemStyle}>
                      <input
                        type="checkbox"
                        name="channels"
                        value={opt}
                        style={{ accentColor: "var(--gold)" }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>What time do you typically start your day?</label>
                <StyledInput type="text" name="start_time" placeholder="e.g. 7:00 AM — I want my briefing before 8" />
              </div>
              <div>
                <label style={labelStyle}>Personality preference for your assistant</label>
                <StyledSelect name="personality">
                  <option value="">No preference</option>
                  <option>Direct and concise — just the facts, no filler</option>
                  <option>Warm and conversational — friendly, approachable</option>
                  <option>Formal and professional — always business-appropriate</option>
                  <option>A mix depending on context</option>
                </StyledSelect>
              </div>
            </div>
          </div>

          {/* 06 — Plan */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: "24px",
              }}
            >
              06 — Timeline &amp; Context
            </h2>
            <div className="space-y-5">
              <div>
                <label style={labelStyle}>How soon do you want to get started?</label>
                <StyledSelect name="timeline">
                  <option value="">Select one</option>
                  <option>As soon as possible</option>
                  <option>Within the next 2–4 weeks</option>
                  <option>Within the next 1–2 months</option>
                  <option>Just exploring for now</option>
                </StyledSelect>
              </div>
              <div>
                <label style={labelStyle}>Anything else you want us to know?</label>
                <StyledTextarea
                  name="other"
                  rows={4}
                  placeholder="Questions, concerns, specific requirements, referral info, or anything else on your mind."
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            {status === "error" && (
              <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px" }}>
                Something went wrong. Please try again or email us at jarvis@simpyhq.com
              </p>
            )}
            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                border: "1px solid var(--gold-soft)",
                color: status === "submitting" ? "var(--ink-3)" : "var(--gold)",
                background: "transparent",
                padding: "14px 40px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: status === "submitting" ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (status === "submitting") return;
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "var(--gold)";
                el.style.color = "var(--bg)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "transparent";
                el.style.color = status === "submitting" ? "var(--ink-3)" : "var(--gold)";
              }}
            >
              {status === "submitting" ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting...</>
              ) : (
                "Submit Inquiry"
              )}
            </button>
            <p style={{ color: "var(--ink-3)", fontSize: "12px", marginTop: "16px" }}>
              We&apos;ll follow up within 24 hours at the email you provided.
            </p>
          </div>

        </form>
      </section>
    </div>
  );
}
