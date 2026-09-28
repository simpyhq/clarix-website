import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { buildIntakeMessage } from "@/lib/intake-mail";
import { recordSecurityEvent } from "@/lib/qbo-audit";
import { clientIp, consumeRateLimit, RATE_LIMITS } from "@/lib/qbo-rate-limit";

const MAX_BODY = 64 * 1024;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const declared = Number(req.headers.get("content-length") || "0");
  if (Number.isFinite(declared) && declared > MAX_BODY) {
    console.warn("Intake rejected oversized body");
    return json({ error: "invalid" }, 413);
  }

  const limit = await consumeRateLimit({ ...RATE_LIMITS.intakeIp, id: ip });
  if (!limit.ok) {
    await recordSecurityEvent({ event: "rate_limited", ip, detail: "intake" });
    return json({ error: "rate_limited" }, 429);
  }

  try {
    const text = await req.text();
    if (text.length > MAX_BODY) {
      console.warn("Intake rejected oversized body");
      return json({ error: "invalid" }, 413);
    }
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return json({ error: "invalid" }, 400);
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return json({ error: "invalid" }, 400);
    }
    const message = buildIntakeMessage(data as Record<string, unknown>);
    if (!message) return json({ error: "invalid" }, 400);

    await transporter.sendMail({
      from: '"Clarix Intake" <support@clarixhq.ai>',
      to: "support@clarixhq.ai",
      cc: "christian.simpson.2018@outlook.com",
      subject: message.subject,
      text: message.text,
      html: message.html,
    });

    return json({ ok: true });
  } catch (err) {
    console.error("Intake route error", err instanceof Error ? err.name : "error");
    return json({ error: "Failed to send" }, 500);
  }
}
