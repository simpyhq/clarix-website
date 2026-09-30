// Health-alert delivery. Resend's HTTP API is used only when RESEND_API_KEY
// is set. Otherwise the existing Gmail SMTP settings are used, which is how
// the app behaves when the new variables are absent. Intake mail is separate
// and always uses SMTP.

import nodemailer from "nodemailer";

export const DEFAULT_ALERT_FROM = "Clarix QBO Health <support@clarixhq.ai>";
const RESEND_EMAILS_URL = "https://api.resend.com/emails";

export type AlertProvider = "resend" | "smtp";

export type AlertMessage = {
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  text: string;
  html: string;
};

export type AlertDelivery =
  | { ok: true; provider: AlertProvider }
  | { ok: false; provider: AlertProvider; code: string };

type AlertMailEnv = {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  [key: string]: string | undefined;
};

export type AlertSendDeps = {
  env?: AlertMailEnv;
  fetchImpl?: typeof fetch;
  sendSmtp?: (message: AlertMessage) => Promise<void>;
};

class ResendHttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super("resend_failed");
    this.name = "ResendHttpError";
    this.status = status;
  }
}

class ResendFromError extends Error {
  constructor() {
    super("resend_from_invalid");
    this.name = "ResendFromError";
  }
}

let testDeps: AlertSendDeps | null = null;

export function setAlertMailTestDeps(deps: AlertSendDeps | null): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("alert mail test hooks cannot be used in production");
  }
  testDeps = deps;
}

export function selectAlertProvider(env: AlertMailEnv): AlertProvider {
  const key = env.RESEND_API_KEY;
  if (typeof key === "string" && key.trim().length > 0) return "resend";
  return "smtp";
}

export function resolveResendFrom(raw: string | undefined): string {
  if (raw === undefined || raw.trim() === "") return DEFAULT_ALERT_FROM;
  const from = raw.trim();
  if (from.length > 320 || /[\u0000\r\n]/.test(from) || !from.includes("@")) {
    throw new ResendFromError();
  }
  return from;
}

function smtpFailureCode(err: unknown): string {
  if (!err || typeof err !== "object") return "smtp_failed";
  const responseCode = (err as { responseCode?: unknown }).responseCode;
  if (
    typeof responseCode === "number" &&
    Number.isInteger(responseCode) &&
    responseCode >= 100 &&
    responseCode <= 599
  ) {
    return `smtp_${responseCode}`;
  }
  if ((err as { code?: unknown }).code === "EAUTH") return "smtp_auth";
  return "smtp_failed";
}

function resendFailureCode(err: unknown): string {
  if (err instanceof ResendHttpError && err.status >= 100 && err.status <= 599) {
    return `resend_http_${err.status}`;
  }
  return "resend_failed";
}

export async function postResendEmail(
  message: AlertMessage,
  apiKey: string,
  fetchImpl: typeof fetch,
): Promise<void> {
  let response: Response;
  try {
    response = await fetchImpl(RESEND_EMAILS_URL, {
      method: "POST",
      redirect: "manual",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: message.from,
        to: message.to,
        cc: message.cc,
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new ResendHttpError(0);
  }
  if (!response.ok) {
    await response.arrayBuffer().catch(() => undefined);
    throw new ResendHttpError(response.status);
  }
}

async function sendViaSmtp(message: AlertMessage): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: message.from,
    to: message.to,
    cc: message.cc,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}

export async function deliverAlertEmail(
  message: AlertMessage,
  deps: AlertSendDeps = {},
): Promise<AlertDelivery> {
  const env: AlertMailEnv = deps.env ?? testDeps?.env ?? process.env;
  const fetchImpl = deps.fetchImpl ?? testDeps?.fetchImpl ?? fetch;
  const sendSmtp = deps.sendSmtp ?? testDeps?.sendSmtp ?? sendViaSmtp;
  const provider = selectAlertProvider(env);
  try {
    if (provider === "resend") {
      const from = resolveResendFrom(env.RESEND_FROM);
      await postResendEmail({ ...message, from }, env.RESEND_API_KEY!.trim(), fetchImpl);
    } else {
      await sendSmtp(message);
    }
    return { ok: true, provider };
  } catch (err) {
    if (err instanceof ResendFromError) return { ok: false, provider, code: "resend_from_invalid" };
    return {
      ok: false,
      provider,
      code: provider === "resend" ? resendFailureCode(err) : smtpFailureCode(err),
    };
  }
}
