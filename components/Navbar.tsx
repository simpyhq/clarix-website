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
    <nav className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#2a2a2e]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-[58px]">

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#5E6AD2] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold tracking-tight">C</span>
            </div>
            <span className="font-semibold text-[#e8e8e8] text-[15px] tracking-tight">Clarix</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className={`text-[13px] font-medium transition-colors ${
                  path === l.href ? "text-[#e8e8e8]" : "text-[#6b6b72] hover:text-[#e8e8e8]"
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/intake"
              className="text-[13px] bg-[#5E6AD2] hover:bg-[#7c87e8] text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Get Started
            </Link>
          </div>

          <button className="md:hidden text-[#a0a0a8] p-1" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-5 border-t border-[#2a2a2e] flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-[14px] text-[#6b6b72] hover:text-[#e8e8e8] font-medium"
                onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/intake"
              className="text-[13px] bg-[#5E6AD2] text-white px-5 py-2.5 rounded-lg font-semibold text-center mt-1"
              onClick={() => setOpen(false)}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
