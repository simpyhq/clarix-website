"use client";

import { FormEvent, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { volumeOptions } from "@/lib/content";
import { btnPrimary } from "@/lib/ui";

type Errors = Partial<Record<"name" | "email" | "company" | "role" | "qbo" | "volume" | "form", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DemoForm() {
  const baseId = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);
  const search = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );
  const params = new URLSearchParams(search);
  const notesDefault = params.get("topic") === "monthly" ? "I would like to hear when monthly plans are ready." : "";
  const sentFromRedirect = params.get("sent") === "1";

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function validate(form: FormData): Errors {
    const next: Errors = {};
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const company = String(form.get("company") || "").trim();
    const role = String(form.get("role") || "").trim();
    const qbo = String(form.get("qbo") || "");
    const volume = String(form.get("volume") || "");

    if (!name) next.name = "Enter your name.";
    if (!email || !emailPattern.test(email)) next.email = "Enter a work email.";
    if (!company) next.company = "Enter your company.";
    if (!role) next.role = "Enter your role.";
    if (qbo !== "yes" && qbo !== "no") next.qbo = "Tell us whether you use QuickBooks Online.";
    if (!volumeOptions.includes(volume as (typeof volumeOptions)[number])) {
      next.volume = "Choose a monthly transaction range.";
    }
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      role: String(form.get("role") || ""),
      qbo: String(form.get("qbo") || ""),
      volume: String(form.get("volume") || ""),
      notes: String(form.get("notes") || ""),
      hp_field: String(form.get("hp_field") || ""),
    };

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setStatus("error");
        setServerMessage(body?.error || "Something went wrong. Email support@clarixhq.ai instead.");
        return;
      }
      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setServerMessage("We could not send that. Email support@clarixhq.ai instead.");
    }
  }

  if (status === "success" || sentFromRedirect) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8" role="status">
        <h2
          ref={successRef}
          tabIndex={-1}
          className="text-[1.5rem] font-semibold tracking-[-0.03em] text-ink outline-none"
        >
          Request received
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          Thanks. We reply within one business day. If it is urgent, email support@clarixhq.ai.
        </p>
      </div>
    );
  }

  const fieldClass =
    "mt-2 w-full rounded-[10px] border border-line bg-surface px-3 py-3 text-[16px] text-ink outline-none focus:border-accent-ink";

  return (
    <form
      onSubmit={onSubmit}
      action="/api/intake"
      method="post"
      noValidate
      className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${baseId}-hp`}>Leave this empty</label>
        <input
          id={`${baseId}-hp`}
          name="hp_field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input type="hidden" name="redirect" value="1" />

      {serverMessage ? (
        <p role="alert" className="mb-4 rounded-xl bg-danger-bg px-3 py-2 text-[14px] text-danger">
          {serverMessage}
        </p>
      ) : null}

      <div className="grid gap-5">
        <Field id={`${baseId}-name`} label="Name" error={errors.name}>
          <input id={`${baseId}-name`} name="name" autoComplete="name" required className={fieldClass} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${baseId}-name-error` : undefined} />
        </Field>
        <Field id={`${baseId}-email`} label="Work email" error={errors.email}>
          <input id={`${baseId}-email`} name="email" type="email" autoComplete="email" required className={fieldClass} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${baseId}-email-error` : undefined} />
        </Field>
        <Field id={`${baseId}-company`} label="Company" error={errors.company}>
          <input id={`${baseId}-company`} name="company" autoComplete="organization" required className={fieldClass} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? `${baseId}-company-error` : undefined} />
        </Field>
        <Field id={`${baseId}-role`} label="Role" error={errors.role}>
          <input
            id={`${baseId}-role`}
            name="role"
            autoComplete="organization-title"
            placeholder="Owner, bookkeeper, controller"
            required
            className={fieldClass}
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? `${baseId}-role-error` : undefined}
          />
        </Field>

        <fieldset aria-describedby={errors.qbo ? `${baseId}-qbo-error` : undefined}>
          <legend className="text-[14px] font-semibold text-ink">Do you use QuickBooks Online?</legend>
          <div className="mt-2 flex flex-wrap gap-4">
            {[
              ["yes", "Yes"],
              ["no", "No"],
            ].map(([value, label]) => (
              <label key={value} className="inline-flex min-h-11 items-center gap-2 text-[16px] text-ink">
                <input type="radio" name="qbo" value={value} required className="h-4 w-4 accent-[#0B7F58]" />
                {label}
              </label>
            ))}
          </div>
          {errors.qbo ? (
            <p id={`${baseId}-qbo-error`} className="mt-1 text-[13px] text-danger">
              {errors.qbo}
            </p>
          ) : null}
        </fieldset>

        <Field id={`${baseId}-volume`} label="Monthly transaction volume" error={errors.volume}>
          <select
            id={`${baseId}-volume`}
            name="volume"
            required
            defaultValue=""
            className={fieldClass}
            aria-invalid={Boolean(errors.volume)}
            aria-describedby={errors.volume ? `${baseId}-volume-error` : undefined}
          >
            <option value="" disabled>
              Choose a range
            </option>
            {volumeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field id={`${baseId}-notes`} label="Notes (optional)">
          <textarea
            id={`${baseId}-notes`}
            name="notes"
            rows={4}
            defaultValue={notesDefault}
            key={notesDefault}
            className={fieldClass}
          />
        </Field>
      </div>

      <button type="submit" className={`${btnPrimary} mt-6 w-full`} disabled={status === "submitting"} aria-busy={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request demo"}
      </button>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        We reply within one business day. No newsletter.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[14px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
