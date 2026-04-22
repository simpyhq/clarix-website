"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/services",    label: "Services" },
  { href: "/pricing",     label: "Pricing" },
  { href: "/competition", label: "Competition" },
  { href: "/about",       label: "About" },
  { href: "/contact",     label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-[58px]">

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#0f172a] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold tracking-tight">C</span>
            </div>
            <span className="font-semibold text-[#0f172a] text-[15px] tracking-tight">Clarix</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className={`text-[13px] font-medium transition-colors ${
                  path === l.href ? "text-[#0f172a]" : "text-[#64748b] hover:text-[#0f172a]"
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/intake"
              className="text-[13px] bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Get Started
            </Link>
          </div>

          <button className="md:hidden text-[#334155] p-1" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-5 border-t border-[#e2e8f0] flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-[14px] text-[#64748b] hover:text-[#0f172a] font-medium"
                onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/intake"
              className="text-[13px] bg-[#0f172a] text-white px-5 py-2.5 rounded-lg font-semibold text-center mt-1"
              onClick={() => setOpen(false)}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
