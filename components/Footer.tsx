import Link from "next/link";
import { Container } from "@/components/marketing/Frame";
import { supportEmail } from "@/lib/content";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/cash-desk", label: "Cash Desk" },
      { href: "/#how", label: "How it works" },
      { href: "/security", label: "Security" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/demo", label: "Book a demo" },
      { href: `mailto:${supportEmail}`, label: supportEmail },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy (draft)" },
      { href: "/terms", label: "Terms (draft)" },
      { href: "/security", label: "Security" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface pb-20 md:pb-0">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-[17px] font-semibold tracking-[-0.03em] text-ink">Clarix</p>
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">
            ClarixHQ builds Cash Desk, an AI finance desk for small businesses on QuickBooks Online.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-[13px] font-semibold text-ink">{column.title}</p>
            <ul className="mt-3 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[15px] text-muted hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="space-y-2 border-t border-line py-6 pb-8 text-[13px] leading-relaxed text-muted md:pb-6">
        <p>© {year} ClarixHQ. All rights reserved.</p>
        {/* TODO(owner): legal entity name and city */}
        <p>Legal entity name and city are not published yet.</p>
        {/* TODO(owner): LinkedIn company URL */}
        <p>LinkedIn profile is not linked yet.</p>
        <p>
          QuickBooks and Intuit are trademarks of Intuit Inc. Clarix is not affiliated with,
          endorsed by, or sponsored by Intuit.
        </p>
      </Container>
    </footer>
  );
}
