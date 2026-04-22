import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const fields = [
      ["Name",           data.name],
      ["Email",          data.email],
      ["Phone",          data.phone],
      ["Location",       data.location],
      ["Client Type",    data.client_type],
      ["Company",        data.company],
      ["Day-to-Day",     data.day_to_day],
      ["Pain Points",    data.pain_points],
      ["Goals",          data.goals],
      ["Finance Tools",  Array.isArray(data.tools_finance)  ? data.tools_finance.join(", ")  : data.tools_finance],
      ["CRM Tools",      Array.isArray(data.tools_crm)      ? data.tools_crm.join(", ")      : data.tools_crm],
      ["Email Tools",    Array.isArray(data.tools_email)    ? data.tools_email.join(", ")    : data.tools_email],
      ["Other Tools",    data.tools_other],
      ["Automate",       Array.isArray(data.automate)       ? data.automate.join("\n  - ")   : data.automate],
      ["Other Tasks",    data.automate_other],
      ["Channels",       Array.isArray(data.channels)       ? data.channels.join(", ")       : data.channels],
      ["Start Time",     data.start_time],
      ["Personality",    data.personality],
      ["Plan",           data.plan],
      ["Timeline",       data.timeline],
      ["Other Notes",    data.other],
    ].filter(([, v]) => v);

    const text = fields.map(([k, v]) => `${k}:\n  ${v}`).join("\n\n");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;">
        <div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600;">New Clarix Intake Form</h1>
          <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT</p>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
          ${fields.map(([k, v]) => `
            <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #f1f3f5;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;">${k}</p>
              <p style="margin:0;font-size:14px;color:#334155;white-space:pre-wrap;">${String(v).replace(/\n  - /g, "<br>&nbsp;&nbsp;• ")}</p>
            </div>
          `).join("")}
        </div>
        <p style="font-size:12px;color:#94a3b8;margin-top:12px;">Submitted via clarix website intake form</p>
      </div>
    `;

    await transporter.sendMail({
      from: '"Clarix Intake" <jarvis@simpyhq.com>',
      to: "jarvis@simpyhq.com",
      cc: "christian.simpson.2018@outlook.com",
      subject: `New Intake: ${data.name || "Unknown"} — ${data.client_type || ""}`,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Intake route error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
