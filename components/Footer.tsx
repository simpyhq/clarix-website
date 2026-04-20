import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E0DA] bg-[#F8F7F3] mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded bg-[#0F1B3C] flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
              <span className="font-semibold text-[#0D0D0D] text-[15px]">Clarix</span>
            </div>
            <p className="text-[#6B6B6B] text-sm leading-relaxed max-w-xs">
              Dedicated AI assistants for businesses, professionals, and high-performing individuals. Built, configured, and maintained by us.
            </p>
            <p className="text-[#6B6B6B] text-sm mt-4">
              <a href="mailto:hello@clarix.ai" className="hover:text-[#0D0D0D]">hello@clarix.ai</a>
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-4">Product</h4>
            <ul className="space-y-3">
              {[
                { href: "/services", label: "Services" },
                { href: "/pricing", label: "Pricing" },
                { href: "/contact", label: "Get Started" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#6B6B6B] hover:text-[#0D0D0D]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#6B6B6B] hover:text-[#0D0D0D]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E2E0DA] mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#ABABAB] text-xs">© {new Date().getFullYear()} Clarix. All rights reserved.</p>
          <p className="text-[#ABABAB] text-xs">Powered by Claude — Anthropic</p>
        </div>
      </div>
    </footer>
  );
}
