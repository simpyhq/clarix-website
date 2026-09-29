// Builds the intake email without putting raw form text into HTML or headers.

import { escapeHtml } from "@/lib/qbo-html";

const MAX_FIELD = 4000;
const MAX_ITEMS = 40;

export type IntakeMessage = {
  subject: string;
  text: string;
  html: string;
};

function asText(value: unknown): { ok: true; text: string | null } | { ok: false } {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return { ok: true, text: null };
    if (trimmed.length > MAX_FIELD) return { ok: false };
    return { ok: true, text: trimmed };
  }
  if (Array.isArray(value)) {
    if (value.length > MAX_ITEMS) return { ok: false };
    const parts: string[] = [];
    for (const item of value) {
      if (typeof item !== "string") return { ok: false };
      const trimmed = item.trim();
      if (!trimmed) continue;
      if (trimmed.length > MAX_FIELD) return { ok: false };
      parts.push(trimmed);
    }
    return { ok: true, text: parts.length ? parts.join(", ") : null };
  }
  return { ok: false };
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 160);
}

export function buildIntakeMessage(data: Record<string, unknown>, sentAt = new Date()): IntakeMessage | null {
  const fields: [string, string][] = [];
  const spec: [string, unknown][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Location", data.location],
    ["Client Type", data.client_type],
    ["Company", data.company],
    ["Day-to-Day", data.day_to_day],
    ["Pain Points", data.pain_points],
    ["Goals", data.goals],
    ["Finance Tools", data.tools_finance],
    ["CRM Tools", data.tools_crm],
    ["Email Tools", data.tools_email],
    ["Other Tools", data.tools_other],
    ["Automate", data.automate],
    ["Other Tasks", data.automate_other],
    ["Channels", data.channels],
    ["Start Time", data.start_time],
    ["Personality", data.personality],
    ["Plan", data.plan],
    ["Timeline", data.timeline],
    ["Other Notes", data.other],
  ];

  for (const [label, value] of spec) {
    if (value === undefined || value === null || value === "") continue;
    const text = asText(value);
    if (!text.ok) return null;
    if (!text.text) continue;
    fields.push([label, text.text]);
  }
  if (!fields.length) return null;

  const text = fields.map(([label, value]) => `${label}:\n  ${value}`).join("\n\n");
  const stamp = sentAt.toLocaleString("en-US", { timeZone: "America/Chicago" });
  const html = `<!DOCTYPE html>
<html><body>
<p>${escapeHtml(stamp)} CT</p>
${fields
  .map(
    ([label, value]) =>
      `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`,
  )
  .join("")}
</body></html>`;

  const name = oneLine(fields.find(([label]) => label === "Name")?.[1] || "Unknown");
  const kind = oneLine(fields.find(([label]) => label === "Client Type")?.[1] || "");
  return {
    subject: oneLine(`New Intake: ${name}${kind ? ` — ${kind}` : ""}`),
    text,
    html,
  };
}
