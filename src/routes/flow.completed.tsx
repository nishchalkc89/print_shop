import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Check, Printer, Clock, Shield, Download, RotateCw, History, Star, ChevronRight, ShieldCheck, Trash2, Home, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFlow } from "@/lib/flow-context";
import { Card, blobCache } from "./flow.upload";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/flow/completed")({
  head: () => ({
    meta: [
      { title: "Printing completed — PrintCloud" },
      { name: "description", content: "Your documents have been printed. Pick them up at the counter." },
    ],
  }),
  component: CompletedStep,
});

function hardDeleteFiles(setFiles: (f: []) => void) {
  // Revoke all blob URLs to free memory
  try {
    blobCache.forEach((url) => URL.revokeObjectURL(url));
    blobCache.clear();
  } catch { /* ignore */ }
  // Wipe all flow state from sessionStorage
  sessionStorage.removeItem("pc_files");
  sessionStorage.removeItem("pc_settings");
  sessionStorage.removeItem("pc_txn_uuid");
  setFiles([]);
}

function downloadReceipt(
  totals: { pages: number; totalPages: number; pricePerPage: number; subtotal: number; total: number },
  settings: { paper: string; color: string; copies: number; side: string; orientation: string; quality: string },
  orderId: string,
) {
  const lines = [
    "═══════════════════════════════════════",
    "          PrintCloud Receipt           ",
    "═══════════════════════════════════════",
    `Order ID   : ${orderId}`,
    `Date       : ${new Date().toLocaleString()}`,
    "───────────────────────────────────────",
    "  Print Settings",
    "───────────────────────────────────────",
    `Paper Size : ${settings.paper}`,
    `Color Mode : ${settings.color === "bw" ? "Black & White" : "Color"}`,
    `Orientation: ${settings.orientation.charAt(0).toUpperCase() + settings.orientation.slice(1)}`,
    `Copies     : ${settings.copies}`,
    `Print Type : ${settings.side === "single" ? "Single Side" : "Double Side"}`,
    `Quality    : ${settings.quality.charAt(0).toUpperCase() + settings.quality.slice(1)}`,
    "───────────────────────────────────────",
    "  Price Breakdown",
    "───────────────────────────────────────",
    `Pages      : ${totals.pages}`,
    `Total Pages: ${totals.totalPages}`,
    `Per Page   : NPR ${totals.pricePerPage.toFixed(2)}`,
    `Subtotal   : NPR ${totals.subtotal.toFixed(2)}`,
    `Service Fee: NPR 0.00`,
    `TOTAL      : NPR ${totals.total.toFixed(2)}`,
    "───────────────────────────────────────",
    `Payment    : eSewa  ✓ Paid`,
    "═══════════════════════════════════════",
    "  Thank you for choosing PrintCloud!   ",
    "  Fast. Secure. Automatic.             ",
    "═══════════════════════════════════════",
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `PrintCloud-Receipt-${orderId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Rating Modal ─────────────────────────────────────────────────────────────

function RatingModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const labels = ["Very Bad", "Bad", "Okay", "Good", "Excellent"];
  const colors = ["text-[#E04646]", "text-[#E48A3A]", "text-[#E0B146]", "text-[#7ABE5A]", "text-success"];

  function submit() {
    if (selected === 0) return;
    setSubmitted(true);
    setTimeout(onClose, 1800);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <div className="text-[15px] font-extrabold text-ink">Rate Your Experience</div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg border border-hairline hover:bg-page">
            <X className="h-4 w-4 text-ink" />
          </button>
        </div>
        <div className="p-6">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <span className="text-4xl">🙏</span>
              <div className="text-[15px] font-extrabold text-ink">Thank you for your feedback!</div>
              <div className="text-[13px] text-body">It helps us improve PrintCloud.</div>
            </div>
          ) : (
            <>
              <div className="text-center text-[13.5px] text-body">How was your printing experience today?</div>
              <div className="mt-5 flex justify-center gap-3">
                {labels.map((label, i) => {
                  const n = i + 1;
                  return (
                    <button key={n} onClick={() => setSelected(n)} className="flex flex-col items-center gap-1.5">
                      <span className={cn(
                        "grid h-12 w-12 place-items-center rounded-full border-2 text-[22px] transition-all",
                        selected === n ? "border-brand bg-brand-soft scale-110" : "border-hairline bg-page hover:scale-105",
                        colors[i],
                      )}>
                        {n <= 2 ? "😞" : n === 3 ? "😐" : n === 4 ? "😊" : "🤩"}
                      </span>
                      <span className="text-[10px] font-semibold text-body">{label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={submit}
                disabled={selected === 0}
                className="mt-6 w-full rounded-xl bg-brand py-3 text-[14px] font-bold text-white shadow-cta transition disabled:cursor-not-allowed disabled:bg-hairline disabled:text-subtle"
              >
                Submit Feedback
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CompletedStep() {
  const { totals, settings, setFiles } = useFlow();
  const { t } = useLang();
  const [deleted, setDeleted] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const navigate = useNavigate();
  const orderId = sessionStorage.getItem("pc_txn_uuid") ?? `PC-${Date.now()}`;

  // Snapshot totals/settings before wipe so the completed page can display them
  const snapshot = useRef({ totals: { ...totals }, settings: { ...settings } });

  // Auto hard-delete on mount — files are gone the moment printing is confirmed
  useEffect(() => {
    hardDeleteFiles(setFiles as any);
    setDeleted(true);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Use snapshot values so totals don't drop to 0 after wipe
  const displayTotals = snapshot.current.totals;
  const displaySettings = snapshot.current.settings;
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <div className="relative grid place-items-center py-4">
          <Confetti />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <span className="absolute inset-0 -m-6 rounded-full bg-success-soft/80 blur-xl" />
            <span className="relative grid h-24 w-24 place-items-center rounded-3xl bg-success-soft text-success">
              <Printer className="h-10 w-10" strokeWidth={2.2} />
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-success text-white ring-4 ring-surface">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
            </span>
          </motion.div>
          <h1 className="mt-5 text-center text-[28px] font-extrabold tracking-tight text-ink sm:text-[32px]">
            {t.completedTitle} <span>🎉</span>
          </h1>
          <p className="mt-2 max-w-md text-center text-[14px] text-body">
            {t.completedSubtitle}
            <br /> {t.collectNote}
          </p>
        </div>

        <div className="mt-2 grid gap-3 rounded-2xl bg-success-soft/40 p-4 sm:grid-cols-3">
          <Info icon={Clock} title={t.completedAt} lines={[new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), new Date().toLocaleDateString()]} />
          <Info icon={Printer} title={t.printedBy} lines={[t.autoPrintLabel, t.noShopkeeper]} />
          <Info icon={Shield} title={t.securePrivate} lines={[t.filesDeleted, t.filesDeletedAuto]} />
        </div>

        {/* Hard-delete confirmation banner */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-success/30 bg-success-soft/60 p-4"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success/15 text-success">
            {deleted ? <ShieldCheck className="h-5 w-5" /> : <Trash2 className="h-5 w-5" />}
          </span>
          <div className="min-w-0">
            <div className="text-[14px] font-extrabold text-ink">
              {deleted ? t.hardDeleteTitle : t.hardDeleteSubtitle}
            </div>
            <div className="mt-0.5 text-[12.5px] text-body">{t.hardDeleteDesc}</div>
          </div>
        </motion.div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-[15.5px] font-extrabold text-ink">{t.orderSummary}</div>
            <button className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand">
              {t.viewDetails} <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="mt-4 space-y-3 text-[13.5px]">
            <Row label={t.totalPages} value={`${displayTotals.totalPages} ${t.pages.toLowerCase()}`} />
            <Row label={t.copiesLabel} value={String(displaySettings.copies)} />
            <Row label={t.colorModeLabel} value={displaySettings.color === "bw" ? t.bw : t.color} />
            <Row label={t.paperSize} value={displaySettings.paper} />
            <Row label={t.printTypeLabel} value={displaySettings.side === "single" ? t.singleSide : t.doubleSide} />
          </ul>
          <hr className="my-4 border-hairline" />
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-extrabold text-ink">{t.totalAmount}</div>
            <div className="text-[18px] font-extrabold text-brand">NPR {displayTotals.total.toFixed(2)}</div>
          </div>
        </Card>

        <Card>
          <div className="text-[15.5px] font-extrabold text-ink">{t.whatsNext ?? "What's Next?"}</div>
          <ul className="mt-4 space-y-2.5">
            <Next icon={Download} title={t.downloadReceipt} sub={t.downloadReceiptSub} tone="blue" onClick={() => downloadReceipt(displayTotals, displaySettings, orderId)} />
            <Next icon={RotateCw} title={t.printAgain} sub={t.printAgainSub} tone="green" onClick={() => navigate({ to: "/flow/upload" })} />
            <Next icon={History} title={t.orderHistory} sub={t.orderHistorySub} tone="violet" onClick={() => alert("Order history coming soon!")} />
            <Next icon={Star} title={t.rateExperience} sub={t.rateExperienceSub} tone="orange" onClick={() => setShowRating(true)} />
          </ul>
        </Card>
      </div>

      <div className="rounded-2xl border border-hairline bg-surface px-6 py-8 text-center shadow-card">
        <div className="text-[16px] font-extrabold text-ink">
          {t.thankYou}
        </div>
        <div className="mt-1 text-[13px] text-body">{t.tagline}</div>
        <div className="mt-5 flex justify-center">
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-6 text-[14px] font-semibold text-white shadow-cta"
          >
            <Home className="h-4 w-4" /> {t.backHome}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showRating && <RatingModal onClose={() => setShowRating(false)} />}
      </AnimatePresence>
    </div>
  );
}

function Info({ icon: Icon, title, lines }: { icon: any; title: string; lines: string[] }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl bg-surface p-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-success/15 text-success">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-body">{title}</div>
        <div className="text-[14px] font-extrabold text-ink">{lines[0]}</div>
        <div className="text-[11.5px] text-body">{lines[1]}</div>
      </div>
    </div>
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

function Next({ icon: Icon, title, sub, tone, onClick }: { icon: any; title: string; sub: string; tone: "blue" | "green" | "violet" | "orange"; onClick?: () => void }) {
  const tones = {
    blue: "bg-brand-soft text-brand",
    green: "bg-success-soft text-success",
    violet: "bg-violet-soft text-[#6D5BD0]",
    orange: "bg-orange-soft text-[#E07A3C]",
  };
  return (
    <li>
      <button onClick={onClick} className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-hairline bg-surface p-3 text-left transition hover:bg-page">
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", tones[tone])}>
          <Icon className="h-4.5 w-4.5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-extrabold text-ink">{title}</span>
          <span className="block text-[12.5px] text-body">{sub}</span>
        </span>
        <ChevronRight className="h-4 w-4 text-subtle" />
      </button>
    </li>
  );
}

function Confetti() {
  const dots = Array.from({ length: 22 }).map((_, i) => i);
  const colors = ["#2563EB", "#22C55E", "#F59E0B", "#EF4444", "#A78BFA", "#06B6D4"];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {dots.map((i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const r = 90 + (i % 5) * 14;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r * 0.65;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x, y, opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.015, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-sm"
            style={{ backgroundColor: colors[i % colors.length] }}
          />
        );
      })}
    </div>
  );
}