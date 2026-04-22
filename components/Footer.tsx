import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a2e] bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-6 h-6 rounded bg-[#5E6AD2] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">C</span>
              </div>
              <span className="font-semibold text-[#e8e8e8] text-[15px] tracking-tight">Clarix</span>
            </div>
            <p className="text-[#6b6b72] text-[13px] leading-relaxed max-w-xs mb-4">
              Dedicated AI assistants for businesses, professionals, and high-performing individuals. Built, configured, and maintained by us.
            </p>
            <a href="mailto:jarvis@simpyhq.com" className="text-[13px] text-[#5E6AD2] hover:text-[#7c87e8]">
              jarvis@simpyhq.com
            </a>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#444449] mb-4">Product</h4>
            <ul className="space-y-3">
              {[
                { href: "/services",    label: "Services" },
                { href: "/pricing",     label: "Pricing" },
                { href: "/competition", label: "Competition" },
                { href: "/intake",      label: "Get Started" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-[#6b6b72] hover:text-[#e8e8e8] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-[#444449] mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                { href: "/about",   label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-[#6b6b72] hover:text-[#e8e8e8] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2a2a2e] mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#444449] text-[12px]">© {new Date().getFullYear()} Clarix. All rights reserved.</p>
          <p className="text-[#444449] text-[12px]">Powered by Claude — Anthropic</p>
        </div>
      </div>
    </footer>
  );
}
