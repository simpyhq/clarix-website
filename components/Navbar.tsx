"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/about",    label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing",  label: "Pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setOpen(false), [path]);

  return (
    <nav
      className="sticky top-0 z-50 animate-fade-in-down"
      style={{
        background: scrolled ? "rgba(8,10,15,0.96)" : "var(--bg)",
        borderBottom: "1px solid var(--gold-border)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-[58px]">

          {/* Logo */}
          <Link
            href="/"
            className="font-serif"
            style={{
              color: "var(--gold)",
              letterSpacing: "0.22em",
              fontSize: "16px",
              fontWeight: 500,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.75"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            CLARIX
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-9">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link ${path === l.href ? "active" : ""}`}
                style={{
                  color: path === l.href ? "var(--ink)" : "var(--ink-3)",
                  fontSize: "13px",
                  letterSpacing: "0.04em",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    path === l.href ? "var(--ink)" : "var(--ink-3)";
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <Link href="/intake" className="btn-gold" style={{ padding: "8px 18px", fontSize: "13px" }}>
              Request Access
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded"
            style={{
              color: "var(--ink-3)",
              fontSize: "18px",
              transition: "color 0.2s ease",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span style={{ display: "inline-block", transition: "transform 0.2s ease", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className="md:hidden mobile-menu-open"
            style={{
              background: "var(--bg)",
              borderTop: "1px solid var(--gold-border)",
              paddingTop: "20px",
              paddingBottom: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: path === l.href ? "var(--ink)" : "var(--ink-3)",
                  fontSize: "15px",
                  letterSpacing: "0.04em",
                  animationDelay: `${i * 40}ms`,
                }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/intake"
              className="btn-gold"
              style={{ textAlign: "center", marginTop: "8px", fontSize: "14px" }}
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
