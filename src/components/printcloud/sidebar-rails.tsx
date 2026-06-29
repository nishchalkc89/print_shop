import { Shield, Printer, Wallet, Headphones, Star, Lock, Activity, FileText } from "lucide-react";
import { SoftIconTile } from "./primitives";

export function ShopCard() {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#FFE6A7] to-[#D9A05B]">
          <div className="grid h-full w-full place-items-center text-[10px] font-bold text-[#6b3a14]">SHOP</div>
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold text-ink">Namaste Prints</div>
          <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-body">
            <Star className="h-3.5 w-3.5 fill-[#F5B400] text-[#F5B400]" />
            <span className="font-semibold text-ink">4.9</span>
            <span className="text-subtle">(120+)</span>
          </div>
          <div className="mt-0.5 text-[11.5px] text-body">
            <span className="font-semibold text-success">Open now</span> · Closes 8 PM
          </div>
        </div>
      </div>
      <button className="mt-4 w-full rounded-lg bg-brand-soft py-2.5 text-sm font-semibold text-brand hover:bg-brand-soft/70">
        View shop details
      </button>
    </div>
  );
}

type TrustItem = { icon: typeof Shield; tone: "blue" | "violet" | "green" | "orange"; title: string; sub: string };

export function TrustList({ items }: { items: TrustItem[] }) {
  return (
    <ul className="space-y-3.5 px-1">
      {items.map((it) => (
        <li key={it.title} className="flex items-center gap-3">
          <SoftIconTile tone={it.tone} size="sm">
            <it.icon className="h-4 w-4" />
          </SoftIconTile>
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-bold text-ink">{it.title}</div>
            <div className="truncate text-[12px] text-body">{it.sub}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export const defaultTrust: TrustItem[] = [
  { icon: Shield, tone: "blue", title: "Secure & Private", sub: "Your files are encrypted" },
  { icon: Printer, tone: "violet", title: "Auto Print", sub: "Printed automatically" },
  { icon: Wallet, tone: "green", title: "eSewa & Khalti", sub: "Secure payments" },
  { icon: Headphones, tone: "orange", title: "Support", sub: "We're here to help" },
];

export const printingTrust: TrustItem[] = [
  { icon: Printer, tone: "violet", title: "Auto Print", sub: "No shopkeeper interaction" },
  { icon: Activity, tone: "blue", title: "Live Tracking", sub: "Real-time order updates" },
  { icon: Shield, tone: "green", title: "Secure & Private", sub: "Your files are safe" },
  { icon: FileText, tone: "orange", title: "Digital Receipt", sub: "Download anytime" },
];

export function SslFooterBadge() {
  return (
    <div className="inline-flex items-center gap-2 text-xs text-body">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-page ring-1 ring-hairline">
        <Lock className="h-3.5 w-3.5 text-subtle" />
      </span>
      <span className="font-semibold text-ink">256-bit SSL Secured</span>
    </div>
  );
}