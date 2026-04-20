"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#F8F7F3]/95 backdrop-blur-sm border-b border-[#E2E0DA]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded bg-[#0F1B3C] flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-tight">C</span>
            </div>
            <span className="font-semibold text-[#0D0D0D] text-[15px] tracking-tight">Clarix</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13px] text-[#6B6B6B] hover:text-[#0D0D0D] font-medium tracking-wide uppercase"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="text-[13px] bg-[#0F1B3C] hover:bg-[#1a2d5a] text-white px-5 py-2 rounded font-medium tracking-wide"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile */}
          <button className="md:hidden text-[#0D0D0D]" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-[#E2E0DA] flex flex-col gap-5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-[#6B6B6B] hover:text-[#0D0D0D] font-medium tracking-widest uppercase"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="text-sm bg-[#0F1B3C] text-white px-5 py-2.5 rounded font-medium text-center"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
