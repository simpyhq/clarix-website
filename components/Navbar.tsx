"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/services", label: "Services" },
  { href: "/pricing",  label: "Pricing" },
  { href: "/about",    label: "About" },
  { href: "/contact",  label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8e8e8]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#0a0a0a] flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-tight">C</span>
            </div>
            <span className="font-semibold text-[#0a0a0a] text-[15px] tracking-tight">Clarix</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className={`text-[13px] font-medium tracking-wide transition-colors ${
                  path === l.href ? "text-[#0a0a0a]" : "text-[#6b6b6b] hover:text-[#0a0a0a]"
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/intake"
              className="text-[13px] bg-[#0a0a0a] hover:bg-[#222] text-white px-4 py-2 rounded-lg font-semibold tracking-wide transition-colors">
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-[#0a0a0a] p-1" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-5 border-t border-[#e8e8e8] flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-[14px] text-[#6b6b6b] hover:text-[#0a0a0a] font-medium"
                onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/intake"
              className="text-[13px] bg-[#0a0a0a] text-white px-5 py-2.5 rounded-lg font-semibold text-center mt-1"
              onClick={() => setOpen(false)}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
