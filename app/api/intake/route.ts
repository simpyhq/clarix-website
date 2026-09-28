import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { volumeOptions } from "@/lib/content";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const volumes = new Set<string>(volumeOptions);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r/g, "").trim().slice(0, max);
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 140);
}

async function readBody(req: NextRequest): Promise<Record<string, unknown> | null> {
  const length = Number(req.headers.get("content-length") || 0);
  if (length > 20_000) return null;
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const parsed = await req.json();
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await req.formData();
    const data: Record<string, unknown> = {};
    for (const [key, value] of form.entries()) {
      if (typeof value === "string") data[key] = value;
    }
    return data;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const wantsJson = (req.headers.get("content-type") || "").includes("application/json");

  const fail = (message: string, status: number) => {
    if (wantsJson) return NextResponse.json({ error: message }, { status });
    return new NextResponse(
      `<!doctype html><meta charset="utf-8"><title>Could not send</title><p>${escapeHtml(message)}</p><p><a href="/demo">Back to the form</a></p>`,
      { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  };

  try {
    const data = await readBody(req);
    if (!data) return fail("That request could not be read.", 400);

    // Honeypot: pretend success so automated posts get no signal.
    if (clean(data.hp_field, 200).length > 0) {
      if (wantsJson) return NextResponse.json({ ok: true });
      return NextResponse.redirect(new URL("/demo?sent=1", req.url), 303);
    }

    const name = clean(data.name, 200);
    const email = clean(data.email, 200);
    const company = clean(data.company, 200);
    const role = clean(data.role, 200);
    const qbo = clean(data.qbo, 10);
    const volume = clean(data.volume, 40);
    const notes = clean(data.notes, 2000);

    if (!name || !company || !role) return fail("Name, company, and role are required.", 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Enter a work email.", 400);
    if (qbo !== "yes" && qbo !== "no") return fail("Tell us whether you use QuickBooks Online.", 400);
    if (!volumes.has(volume)) return fail("Choose a monthly transaction range.", 400);

    const fields: [string, string][] = [
      ["Name", name],
      ["Email", email],
      ["Company", company],
      ["Role", role],
      ["QuickBooks Online", qbo === "yes" ? "Yes" : "No"],
      ["Monthly transaction volume", volume],
      ["Notes", notes || "—"],
    ];

    const text = fields.map(([label, value]) => `${label}:\n  ${value}`).join("\n\n");
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0b1220;">
        <div style="background:#0b1220;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600;">New Clarix demo request</h1>
          <p style="margin:4px 0 0;color:#d5dae3;font-size:13px;">${escapeHtml(
            new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }),
          )} CT</p>
        </div>
        <div style="border:1px solid #e6e8ec;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
          ${fields
            .map(
              ([label, value]) => `
            <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #f1f3f5;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#475467;">${escapeHtml(label)}</p>
              <p style="margin:0;font-size:15px;color:#0b1220;">${escapeHtml(value).replace(/\n/g, "<br>")}</p>
            </div>`,
            )
            .join("")}
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Clarix Intake" <support@clarixhq.ai>',
      to: "support@clarixhq.ai",
      cc: "christian.simpson.2018@outlook.com",
      replyTo: email,
      subject: `Demo request: ${oneLine(name)} — ${oneLine(company)}`,
      text,
      html,
    });

    if (!wantsJson || clean(data.redirect, 4) === "1") {
      return NextResponse.redirect(new URL("/demo?sent=1", req.url), 303);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Intake route error:", err);
    return fail("Failed to send.", 500);
  }
}
