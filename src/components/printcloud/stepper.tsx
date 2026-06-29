import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Upload, Sliders, FileText, CreditCard, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

function useActiveStep() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/flow/completed")) return 5;
  if (path.startsWith("/flow/printing")) return 5;
  if (path.startsWith("/flow/summary")) return 3;
  if (path.startsWith("/flow/configure")) return 2;
  return 1;
}

export function StepperDesktop() {
  const active = useActiveStep();
  const { t } = useLang();

  const STEPS = [
    { n: 1, title: t.stepUpload, sub: t.uploadSubtitle, to: "/flow/upload", icon: Upload },
    { n: 2, title: t.stepConfigure, sub: t.configureSubtitle, to: "/flow/configure", icon: Sliders },
    { n: 3, title: t.stepSummary, sub: t.summarySubtitle, to: "/flow/summary", icon: FileText },
    { n: 4, title: t.stepPayment, sub: t.paySecurely, to: "/flow/summary", icon: CreditCard },
    { n: 5, title: t.stepPrinting, sub: t.printingSubtitle, to: "/flow/printing", icon: Printer },
  ] as const;

  return (
    <nav aria-label="Progress" className="rounded-2xl border border-hairline bg-surface p-5 shadow-card">
      <ol className="relative space-y-1">
        {STEPS.map((s, i) => {
          const done = active > s.n;
          const current = active === s.n;
          const isLast = i === STEPS.length - 1;
          return (
            <li key={s.n} className="relative">
              {!isLast && (
                <span
                  className={cn(
                    "absolute left-[18px] top-10 h-[calc(100%-12px)] w-px",
                    done ? "bg-success/60" : "bg-hairline",
                  )}
                />
              )}
              <Link
                to={s.to}
                className={cn(
                  "relative flex items-start gap-3 rounded-xl p-2.5 transition-colors",
                  current ? "bg-brand-soft/70" : "hover:bg-page",
                )}
              >
                <motion.span
                  layout
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold",
                    done && "bg-success text-white",
                    current && "bg-brand text-white shadow-cta",
                    !done && !current && "bg-page text-subtle ring-1 ring-hairline",
                  )}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : s.n}
                </motion.span>
                <span className="min-w-0 pt-0.5">
                  <span className={cn("block text-[15px] font-bold leading-tight", current ? "text-brand" : "text-ink")}>
                    {s.title}
                  </span>
                  <span className="block text-[12.5px] text-body">{s.sub}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function StepperMobile() {
  const active = useActiveStep();
  const { t } = useLang();

  const STEPS = [
    { n: 1, title: t.stepUpload, to: "/flow/upload", icon: Upload },
    { n: 2, title: t.stepConfigure, to: "/flow/configure", icon: Sliders },
    { n: 3, title: t.stepSummary, to: "/flow/summary", icon: FileText },
    { n: 4, title: t.stepPayment, to: "/flow/summary", icon: CreditCard },
    { n: 5, title: t.stepPrinting, to: "/flow/printing", icon: Printer },
  ] as const;

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-3 shadow-card">
      <ol className="flex items-center justify-between gap-1">
        {STEPS.map((s) => {
          const done = active > s.n;
          const current = active === s.n;
          const Icon = s.icon;
          return (
            <li key={s.n} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold",
                  done && "bg-success text-white",
                  current && "bg-brand text-white",
                  !done && !current && "bg-page text-subtle ring-1 ring-hairline",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : current ? s.n : <Icon className="h-3.5 w-3.5" />}
              </span>
              <span className={cn("truncate text-[11px] font-semibold", current ? "text-brand" : done ? "text-ink" : "text-subtle")}>
                {s.title}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
