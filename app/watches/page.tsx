import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch Picks — Christian Simpson",
  description: "A curated list of watches worth buying for a first serious timepiece.",
};

const watches = [
  {
    brand: "Seiko",
    model: "Prospex SPB143",
    nickname: "The Alpinist",
    price: "$700–$900",
    where: "Seiko USA",
    link: "https://www.seikousa.com/products/spb143",
    image: "https://www.seikousa.com/cdn/shop/products/SPB143_1_2048x2048.jpg?v=1652121600",
    why: "One of the most respected watches under $1,000. A vintage-inspired Japanese field/dive watch that looks nothing like a typical 'starter watch.' The internal rotating bezel and compass dial give it a personality most luxury brands can't buy. Holds value well, wears daily, and watch people will always nod at it.",
    vibe: "Field / Adventure",
    verdict: "Best overall first watch",
  },
  {
    brand: "Tissot",
    model: "PRX Powermatic 80",
    nickname: "The PRX",
    price: "$650–$800",
    where: "Tissot Official",
    link: "https://www.tissotwatches.com/en-us/tissot-prx-powermatic-80.html",
    image: "https://www.tissotwatches.com/media/catalog/product/cache/4bad9d5b6b7e9278f2e88fe1ee84e5a3/T/1/T137.407.11.051.00_1.png",
    why: "Clean, integrated bracelet design that looks like it costs $3,000. Inspired by the Audemars Piguet Royal Oak shape — the watches people actually lust after. Swiss-made, 80-hour power reserve, and the bracelet finishing is genuinely impressive at this price. Blends into every setting from business to weekend.",
    vibe: "Dress / Everyday",
    verdict: "Looks twice the price",
  },
  {
    brand: "Grand Seiko",
    model: "SBGX261",
    nickname: "The Snowflake Quartz",
    price: "$2,000–$2,500",
    where: "Authorized Dealer",
    link: "https://www.grandseiko.com/en-us/collections/sbgx261",
    image: "https://www.grandseiko.com/uploads/SBGX261_01.jpg",
    why: "If he's got the budget, this is the move. Grand Seiko exists above most Swiss brands in finishing quality — the dial texture, the sharp case edges, the way it catches light. Japanese artisans hand-finish every surface. Most people who see it won't know what it is, which is exactly the point. Quartz movement means zero maintenance.",
    vibe: "Dress / Statement",
    verdict: "Best if budget allows",
  },
  {
    brand: "Tudor",
    model: "Black Bay 58",
    nickname: "The BB58",
    price: "$3,500–$4,000",
    where: "Tudor Official / AD",
    link: "https://www.tudorwatch.com/en/watches/black-bay/m79030n-0001",
    image: "https://www.tudorwatch.com/wp-content/uploads/M79030N-0001_1.jpg",
    why: "Tudor is owned by Rolex. The BB58 is the watch enthusiast community's answer to 'I want a Rolex Submariner but I'm not paying $10K on the secondary market.' Same DNA, better value, smaller 39mm case that wears on any wrist. Buy it at retail, wear it forever, sell it for close to what you paid. It's that simple.",
    vibe: "Dive / Daily",
    verdict: "The enthusiast favorite",
  },
  {
    brand: "Longines",
    model: "Spirit",
    nickname: "The Spirit",
    price: "$1,400–$1,800",
    where: "Longines Official",
    link: "https://www.longines.com/en-us/watches/spirit/l38204539",
    image: "https://www.longines.com/media/catalog/product/cache/2/image/9df78eab33525d08d6e5fb8d27136e95/L/3/L3.820.4.53.9_01.jpg",
    why: "Longines is quietly one of the best-value Swiss brands alive. The Spirit is a modern pilot-inspired watch with a clean dial, excellent in-house movement, and the kind of design that ages well. Feels substantial without being oversized. The Swatch Group movement inside is reliable and chronometer-certified.",
    vibe: "Pilot / Dress",
    verdict: "Underrated Swiss quality",
  },
  {
    brand: "Seiko",
    model: "5 Sports SRPD51",
    nickname: "The Seiko 5",
    price: "$200–$280",
    where: "Amazon / Seiko",
    link: "https://www.seikousa.com/products/srpd51",
    image: "https://www.seikousa.com/cdn/shop/products/SRPD51_1_2048x2048.jpg",
    why: "If he wants to learn about watches before spending real money — this is the answer. Automatic movement he can see through the caseback, field/military aesthetic, and a bracelet that punches above its price. The watch community universally respects this as the entry point. Start here, upgrade later, keep this one.",
    vibe: "Sport / Field",
    verdict: "Best under $300",
  },
];

export default function WatchesPage() {
  return (
    <div className="bg-white text-[#0f172a] min-h-screen">

      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-16 pb-24">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[#94a3b8] hover:text-[#0f172a] mb-10 transition-colors">
          <ArrowLeft size={13} />
          Back
        </Link>

        {/* Header */}
        <div className="mb-16">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0f172a] mb-4">
            Curated by Christian Simpson
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium leading-[1.08] tracking-tight mb-5">
            Watches worth buying.<br />
            <span className="text-[#94a3b8]">For someone just starting out.</span>
          </h1>
          <p className="text-[#64748b] text-[15px] leading-relaxed max-w-2xl">
            A first serious watch is a different kind of purchase — it should last decades, hold value, and mean something. This list skips the noise and goes straight to the pieces the watch community actually respects at each price point.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-10">
          {watches.map((w, i) => (
            <div key={w.model} className="border border-[#e2e8f0] rounded-xl overflow-hidden hover:border-[#94a3b8] transition-colors">
              <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-0">

                {/* Image */}
                <div className="bg-[#f8f9fa] border-b sm:border-b-0 sm:border-r border-[#e2e8f0] flex items-center justify-center p-8 min-h-[180px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.image}
                    alt={`${w.brand} ${w.model}`}
                    className="w-full max-w-[140px] h-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'text-[#94a3b8] text-[13px] font-mono text-center';
                        placeholder.textContent = `${w.brand}\n${w.model}`;
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                    <div>
                      <span className="text-[11px] font-semibold tracking-widest uppercase text-[#94a3b8]">{w.brand}</span>
                      <h2 className="text-[17px] font-semibold text-[#0f172a] mt-0.5">{w.model}</h2>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[17px] font-semibold text-[#0f172a]">{w.price}</p>
                      <span className="inline-block text-[11px] font-semibold tracking-wide bg-[#f1f3f5] text-[#334155] px-2.5 py-1 rounded-md mt-1">{w.vibe}</span>
                    </div>
                  </div>

                  <p className="text-[13px] font-medium text-green-600 mb-4">{w.verdict}</p>

                  <p className="text-[14px] text-[#64748b] leading-relaxed mb-6">
                    {w.why}
                  </p>

                  <a
                    href={w.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-2.5 rounded-lg font-semibold text-[13px] transition-colors"
                  >
                    View on {w.where} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-10 border-t border-[#e2e8f0]">
          <p className="text-[13px] text-[#94a3b8] leading-relaxed max-w-2xl">
            A few rules of thumb: buy from authorized dealers when possible. Avoid fashion brands (Michael Kors, Fossil, MVMT) — the movements are cheap and they hold no value. A $300 Seiko beats a $300 anything else. And the best watch is the one you&apos;ll actually wear.
          </p>
        </div>

      </div>
    </div>
  );
}
