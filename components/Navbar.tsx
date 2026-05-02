"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/about",    label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing",  label: "Pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <nav
      style={{
        background: "var(--bg)",
        borderBottom: "1px solid var(--gold-border)",
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-[58px]">

          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "var(--gold)",
              letterSpacing: "0.18em",
              fontSize: "17px",
              fontWeight: 500,
            }}
          >
            CLARIX
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: path === l.href ? "var(--ink)" : "var(--ink-3)",
                  fontSize: "13px",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = path === l.href ? "var(--ink)" : "var(--ink-3)"; }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/intake"
              style={{
                border: "1px solid var(--gold-soft)",
                color: "var(--gold)",
                background: "transparent",
                fontSize: "13px",
                padding: "8px 18px",
                borderRadius: "6px",
                transition: "all 0.15s ease",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "var(--gold)";
                el.style.color = "var(--bg)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.color = "var(--gold)";
              }}
            >
              Request Access
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-xl"
            style={{ color: "var(--ink-3)" }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            style={{
              background: "var(--bg)",
              borderTop: "1px solid var(--gold-border)",
            }}
            className="md:hidden py-6 flex flex-col gap-5"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: "var(--ink-3)", fontSize: "15px" }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/intake"
              style={{
                border: "1px solid var(--gold-soft)",
                color: "var(--gold)",
                background: "transparent",
                fontSize: "14px",
                padding: "10px 18px",
                borderRadius: "6px",
                textAlign: "center",
                marginTop: "4px",
              }}
              onClick={() => setOpen(false)}
            >
              Request Access
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
