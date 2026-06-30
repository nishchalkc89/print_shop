import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Printer, FileText, ClipboardCheck, Clock, Bell, Smile, Frown, Meh, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useFlow } from "@/lib/flow-context";
import { Card } from "./flow.upload";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/flow/printing")({
  head: () => ({
    meta: [
      { title: "Your order is being printed — PrintCloud" },
      { name: "description", content: "Track your print order in real time." },
      { property: "og:title", content: "Your order is being printed — PrintCloud" },
      { property: "og:description", content: "Watch your print job progress live." },
    ],
  }),
  component: PrintingStep,
});

const STAGES = [
  { key: "uploaded", label: "Uploaded", time: "10:32 AM", icon: Check, status: "done" as const },
  { key: "payment", label: "Payment", time: "10:34 AM", icon: Check, status: "done" as const },
  { key: "printing", label: "Printing", time: "In progress", icon: Printer, status: "current" as const },
  { key: "finishing", label: "Finishing", time: "Pending", icon: FileText, status: "pending" as const },
  { key: "completed", label: "Completed", time: "Pending", icon: ClipboardCheck, status: "pending" as const },
];

function PrintingStep() {
  const { totals, settings, files } = useFlow();
  const { t } = useLang();
  const navigate = useNavigate();
  const orderId = sessionStorage.getItem("pc_txn_uuid") ?? "#PC-DEMO";

  // Guard: must have paid (txn uuid set) — else back to summary
  useEffect(() => {
    if (!sessionStorage.getItem("pc_txn_uuid")) navigate({ to: "/flow/summary" });
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-extrabold tracking-tight text-ink sm:text-[28px]">
              Your order is being printed <span>🎉</span>
            </h1>
            <p className="mt-1 text-[13.5px] text-body">
              Order ID: <span className="font-bold text-ink">{orderId}</span>{" "}
              <span className="mx-1.5 text-subtle">•</span> {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 rounded-2xl border border-hairline bg-page/40 p-5">
          <div className="hidden sm:block">
            <div className="relative grid grid-cols-5 gap-2">
              <motion.div
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 0.5 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="pointer-events-none absolute left-[10%] right-[10%] top-7 h-0.5 origin-left rounded-full bg-success"
                style={{ transformOrigin: "left" }}
              />
              <div className="pointer-events-none absolute left-[10%] right-[10%] top-7 -z-0 h-0.5 rounded-full bg-hairline" />
              {STAGES.map((s) => (
                <Stage key={s.key} s={s} />
              ))}
            </div>
          </div>
          <ul className="space-y-3 sm:hidden">
            {STAGES.map((s) => (
              <li
                key={s.key}
                className={cn(
                  "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-surface p-3",
                  s.status === "current" && "bg-brand-soft/60",
                )}
              >
                <StageIcon status={s.status} Icon={s.icon} />
                <span className="text-[14px] font-bold text-ink">{s.label}</span>
                <span className={cn("text-[12px] font-semibold", s.status === "current" ? "text-brand" : "text-body")}>{s.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <div className="text-[15.5px] font-extrabold text-ink">{t.orderSummary}</div>
          <ul className="mt-4 space-y-3 text-[13.5px]">
            <Row label="Documents" value={`${files.length} file${files.length !== 1 ? "s" : ""}`} />
            <Row label={t.totalPages} value={`${totals.totalPages} ${t.pages.toLowerCase()}`} />
            <Row label={t.copiesLabel} value={String(settings.copies)} />
            <Row label={t.colorModeLabel} value={settings.color === "bw" ? t.bw : t.color} />
            <Row label={t.paperSize} value={settings.paper} />
            <Row label={t.printTypeLabel} value={settings.side === "single" ? t.singleSide : t.doubleSide} />
          </ul>
          <hr className="my-4 border-hairline" />
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-extrabold text-ink">{t.totalAmount}</div>
            <div className="text-[18px] font-extrabold text-brand">NPR {totals.total.toFixed(2)}</div>
          </div>
          <hr className="my-4 border-hairline" />
          <Row label="Payment Method" value={<span className="inline-flex items-center gap-1.5 font-bold text-success"><span className="grid h-5 w-5 place-items-center rounded-full bg-success/15 text-[10px] font-extrabold">e</span> eSewa</span>} />
          <div className="mt-3"><Row label="Payment Status" value={<span className="font-bold text-success">Paid</span>} /></div>
        </Card>

        <Card>
          <div className="text-[15.5px] font-extrabold text-ink">Printing in Progress</div>
          <div className="mt-4 grid place-items-center">
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
              <PrinterIllu />
            </motion.div>
            <p className="mt-4 max-w-xs text-center text-[13.5px] leading-relaxed text-body">
              Your documents are at the front of the queue and being printed.
            </p>
          </div>
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-brand-soft/60 p-3.5">
            <span className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink">
              <Clock className="h-4 w-4 text-brand" /> Estimated time remaining
            </span>
            <span className="text-[13.5px] font-extrabold text-brand">1 – 2 min</span>
          </div>
        </Card>
      </div>

      <Card>
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
          <NotifyMockPhone />
          <div className="min-w-0">
            <div className="text-[15px] font-extrabold text-ink">We'll notify you when it's ready!</div>
            <div className="mt-1 text-[13px] text-body">You can leave and come back. We'll notify you here when your prints are completed.</div>
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-soft px-4 text-[13px] font-semibold text-brand hover:bg-brand-soft/70">
            <Bell className="h-4 w-4" /> Enable notifications
          </button>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <div className="text-[15px] font-extrabold text-ink">How was your experience?</div>
            <div className="text-[13px] text-body">Your feedback helps us improve.</div>
          </div>
          <FeedbackRow />
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-[12px] text-body italic">Demo: printing completes automatically in production.</p>
        <Link
          to="/flow/completed"
          className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-success px-5 text-[14px] font-semibold text-white shadow-cta transition hover:bg-[oklch(0.55_0.17_148)]"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Stage({ s }: { s: (typeof STAGES)[number] }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-2">
      <StageIcon status={s.status} Icon={s.icon} />
      <div className={cn("text-[13px] font-bold", s.status === "current" ? "text-brand" : s.status === "done" ? "text-ink" : "text-body")}>
        {s.label}
      </div>
      <div className={cn("text-[11.5px]", s.status === "current" ? "text-brand font-semibold" : "text-body")}>{s.time}</div>
    </div>
  );
}

function StageIcon({ status, Icon }: { status: "done" | "current" | "pending"; Icon: any }) {
  return (
    <span
      className={cn(
        "grid h-12 w-12 place-items-center rounded-full",
        status === "done" && "bg-success text-white shadow-[0_8px_18px_-8px_rgba(34,160,90,0.6)]",
        status === "current" && "bg-brand text-white shadow-cta",
        status === "pending" && "bg-surface text-subtle ring-1 ring-hairline",
      )}
    >
      {status === "done" ? <Check className="h-5 w-5" strokeWidth={3} /> : <Icon className="h-5 w-5" />}
    </span>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <span className="text-body">{label}</span>
      <span className="font-bold text-ink">{value}</span>
    </li>
  );
}

function PrinterIllu() {
  return (
    <div className="relative">
      <div className="h-[110px] w-[160px] rounded-2xl bg-gradient-to-b from-[#f3f5f9] to-[#dde3ee] shadow-card">
        <div className="mx-auto mt-3 h-2.5 w-24 rounded-full bg-[#0f1115]" />
        <div className="mx-auto mt-2 h-12 w-32 rounded-md bg-[#1a1d23]" />
      </div>
      <div className="mx-auto -mt-2 w-28 rounded-md bg-surface p-2 shadow-card">
        <div className="h-1 w-2/3 rounded bg-page" />
        <div className="mt-1 h-1 w-1/2 rounded bg-page" />
        <div className="mt-2 grid grid-cols-3 gap-1">
          {[6, 10, 4].map((h, i) => (
            <div key={i} className="rounded-sm bg-brand/50" style={{ height: h }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NotifyMockPhone() {
  return (
    <div className="relative hidden h-20 w-14 shrink-0 rounded-[10px] border-[3px] border-[#15171c] bg-[#0f1115] sm:block">
      <div className="absolute inset-1 rounded-[6px] bg-gradient-to-b from-brand to-brand-deep">
        <Bell className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white" />
      </div>
    </div>
  );
}

function FeedbackRow() {
  const items = [
    { Icon: Frown, label: "Very Bad", color: "text-[#E04646]" },
    { Icon: Meh, label: "Bad", color: "text-[#E48A3A]" },
    { Icon: Smile, label: "Okay", color: "text-[#E0B146]" },
    { Icon: Smile, label: "Good", color: "text-[#7ABE5A]" },
    { Icon: Smile, label: "Excellent", color: "text-success" },
  ];
  return (
    <div className="flex items-end gap-2 sm:gap-3">
      {items.map((it) => (
        <button key={it.label} className="group flex flex-col items-center gap-1">
          <span className={cn("grid h-10 w-10 place-items-center rounded-full bg-page transition group-hover:scale-110", it.color)}>
            <it.Icon className="h-5 w-5" />
          </span>
          <span className="text-[11px] font-semibold text-body">{it.label}</span>
        </button>
      ))}
    </div>
  );
}