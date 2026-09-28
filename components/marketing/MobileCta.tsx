"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { btnPrimary } from "@/lib/ui";

export default function MobileCta() {
  const pathname = usePathname();
  if (pathname === "/demo") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <Link href="/demo" className={`${btnPrimary} w-full`}>
        Book a demo
      </Link>
    </div>
  );
}
