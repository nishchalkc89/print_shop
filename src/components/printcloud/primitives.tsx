import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Cloud, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { useLang, type Lang } from "@/lib/i18n";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
        <Cloud className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="text-[20px] font-extrabold tracking-tight text-ink">PrintCloud</span>
    </Link>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-deep", className)}>
      {children}
    </span>
  );
}

export function SoftIconTile({
  children,
  tone = "blue",
  size = "md",
  className,
}: {
  children: ReactNode;
  tone?: "blue" | "violet" | "green" | "orange" | "muted";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const tones: Record<string, string> = {
    blue: "bg-brand-soft text-brand",
    violet: "bg-violet-soft text-[#6D5BD0]",
    green: "bg-success-soft text-success",
    orange: "bg-orange-soft text-[#E07A3C]",
    muted: "bg-page text-subtle",
  };
  const sizes = { sm: "h-9 w-9 rounded-lg", md: "h-11 w-11 rounded-xl", lg: "h-14 w-14 rounded-2xl" };
  return <span className={cn("inline-grid place-items-center", tones[tone], sizes[size], className)}>{children}</span>;
}

const LANGS: { code: Lang; label: string; full: string }[] = [
  { code: "en", label: "EN", full: "English" },
  { code: "ne", label: "नेपाली", full: "नेपाली" },
];

export function LangSelect() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 text-sm font-semibold text-ink hover:bg-page"
      >
        {current.label} <ChevronDown className={cn("h-4 w-4 text-subtle transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-36 overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className="flex w-full items-center justify-between px-4 py-2.5 text-[13.5px] font-semibold text-ink hover:bg-page"
            >
              {l.full}
              {l.code === lang && <Check className="h-3.5 w-3.5 text-brand" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTypeIcon({ kind, size = "md" }: { kind: "pdf" | "docx" | "img"; size?: "sm" | "md" }) {
  const palette = kind === "pdf"
    ? { bg: "bg-[#FEEAEA]", text: "text-[#D9342B]", label: "PDF" }
    : kind === "docx"
    ? { bg: "bg-[#E6EEFB]", text: "text-[#2563EB]", label: "DOC" }
    : { bg: "bg-violet-soft", text: "text-[#6D5BD0]", label: "IMG" };
  const dim = size === "sm" ? "h-8 w-8 text-[9px]" : "h-10 w-10 text-[10px]";
  return (
    <span className={cn("grid place-items-center rounded-lg font-bold tracking-wide", palette.bg, palette.text, dim)}>
      {palette.label}
    </span>
  );
}
