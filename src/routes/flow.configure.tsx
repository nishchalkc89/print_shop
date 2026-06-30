import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Minus, Plus, Eye, ShieldCheck, Clock, FileType2, Palette, RotateCw, X, Printer } from "lucide-react";
import { useFlow, type PrintSettings } from "@/lib/flow-context";
import { FileTypeIcon } from "@/components/printcloud/primitives";
import { Card, Header, blobCache } from "./flow.upload";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/flow/configure")({
  head: () => ({
    meta: [
      { title: "Configure print settings — PrintCloud" },
      { name: "description", content: "Choose paper, color, copies and quality. See the price live." },
      { property: "og:title", content: "Configure print settings — PrintCloud" },
      { property: "og:description", content: "Tune every print option and see the total update instantly." },
    ],
  }),
  component: ConfigureStep,
});

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-[13.5px] font-semibold transition",
              active
                ? "border-brand bg-brand-soft text-brand"
                : "border-hairline bg-surface text-ink hover:bg-page",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="mb-2.5 text-[13px] font-bold text-ink">{label}</div>
      {children}
    </div>
  );
}

// ─── Print Preview Modal ──────────────────────────────────────────────────────

function PrintPreviewModal({
  files,
  orientation,
  paper,
  color,
  onClose,
}: {
  files: ReturnType<typeof useFlow>["files"];
  orientation: "portrait" | "landscape";
  paper: string;
  color: "bw" | "color";
  onClose: () => void;
}) {
  const isLandscape = orientation === "landscape";
  const isBW = color === "bw";

  // Paper aspect ratios
  const ratio = paper === "A5" ? (148 / 210) : paper === "Letter" ? (8.5 / 11) : (210 / 297); // A4 default
  const paperStyle = isLandscape
    ? { aspectRatio: `${1 / ratio}`, maxWidth: "100%", width: "min(620px, 100%)" }
    : { aspectRatio: `${ratio}`, maxWidth: "100%", width: "min(420px, 100%)" };

  // CSS filter that simulates physical print output
  const printFilter = isBW
    ? "grayscale(1) contrast(1.15) brightness(0.93)"
    : "contrast(1.05) brightness(0.97) saturate(0.85)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-[#1a1d23] shadow-2xl sm:rounded-3xl"
        style={{ maxHeight: "94dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
              <Printer className="h-4 w-4 text-white" />
            </span>
            <div>
              <div className="text-[15px] font-extrabold text-white">Print Preview</div>
              <div className="text-[12px] text-white/50">
                {paper} · {isLandscape ? "Landscape" : "Portrait"} · {isBW ? "Black & White" : "Color"}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 hover:bg-white/10"
          >
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        {/* Info strip */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-5 py-2.5">
          <div
            className="shrink-0 rounded border border-white/30 bg-white/20"
            style={{ width: isLandscape ? 30 : 18, height: isLandscape ? 18 : 30 }}
          />
          <span className="text-[12px] font-semibold text-white/60">
            This is how your document will look when printed
            {isBW ? " — in black & white" : " — in color"}
          </span>
        </div>

        {/* Simulated print tray — dark room, paper on table */}
        <div
          className="flex flex-1 flex-col items-center gap-6 overflow-auto px-5 py-8"
          style={{ background: "radial-gradient(ellipse at 50% 30%, #2a2d35 0%, #0f1115 100%)" }}
        >
          {files.map((f) => {
            const url = blobCache.get(f.id);
            return (
              <div key={f.id} className="flex flex-col items-center gap-3">
                {/* File label */}
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30">{f.name}</div>

                {/* Physical paper sheet */}
                <div
                  style={{
                    ...paperStyle,
                    // Paper texture: warm white with subtle grain
                    background: "#f4f1ec",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.06)",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "3px",
                  }}
                >
                  {/* Subtle paper grain overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />

                  {!url ? (
                    <div className="grid h-full w-full place-items-center text-[13px] text-gray-400">
                      Preview lost — re-upload to view
                    </div>
                  ) : f.kind === "pdf" ? (
                    <embed
                      src={url}
                      type="application/pdf"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        filter: printFilter,
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                  ) : f.kind === "img" ? (
                    <img
                      src={url}
                      alt={f.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: printFilter,
                        display: "block",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[13px] text-gray-400">
                      Preview not available for this file type
                    </div>
                  )}
                </div>

                {/* B&W badge */}
                {isBW && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/50">
                    <span className="h-2 w-2 rounded-full bg-white/40" /> Black & White print
                  </div>
                )}
              </div>
            );
          })}

          <p className="pb-2 text-[11px] text-white/25">
            Colors may vary slightly from actual print output
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Configure Step ───────────────────────────────────────────────────────────

function ConfigureStep() {
  const { files, settings, setSettings, totals } = useFlow();
  const { t } = useLang();
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  // Guard: must have uploaded files to reach this page
  useEffect(() => {
    if (files.length === 0) navigate({ to: "/flow/upload" });
  }, [files.length]);

  const file = files[0];
  const s = settings;
  const upd = <K extends keyof PrintSettings>(k: K, v: PrintSettings[K]) => setSettings({ ...s, [k]: v });

  return (
    <div className="flex flex-col gap-5">
      <Card>
        {/* Title — full width, no float */}
        <div className="min-w-0">
          <h1 className="text-[22px] font-extrabold tracking-tight text-ink sm:text-[26px]">
            {t.configureTitle}
          </h1>
          <p className="mt-1 text-[13.5px] text-body">{t.configureSubtitle}</p>
        </div>

        {/* File chip — always below title, never beside it */}
        {file && (
          <div className="mt-3 flex w-full items-center gap-3 rounded-xl border border-hairline bg-page/60 p-2.5">
            <FileTypeIcon kind={file.kind} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-bold text-ink">{file.name}</div>
              <div className="text-[11.5px] text-body">
                {file.pages} {file.pages === 1 ? "page" : "pages"} · {file.sizeMB} MB
              </div>
            </div>
            {files.length > 1 && (
              <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand">
                +{files.length - 1} more
              </span>
            )}
          </div>
        )}

        <div className="mt-6 grid gap-7 lg:grid-cols-3">
          <Field label={t.paperSize}>
            <Segmented
              value={s.paper}
              onChange={(v) => upd("paper", v)}
              options={[
                { value: "A4", label: (<><FileType2 className="h-3.5 w-3.5" /> A4</>) },
                { value: "A3", label: "A3" },
                { value: "Letter", label: "Letter" },
                { value: "Legal", label: "Legal" },
              ]}
            />
          </Field>
          <Field label={t.colorMode}>
            <Segmented
              value={s.color}
              onChange={(v) => upd("color", v)}
              options={[
                { value: "bw", label: (<><span className="h-3 w-3 rounded-full bg-ink" /> {t.bw}</>) },
                { value: "color", label: (<><Palette className="h-3.5 w-3.5 text-[#e84c4c]" /> {t.color}</>) },
              ]}
            />
          </Field>
          <Field label={t.orientation}>
            <Segmented
              value={s.orientation}
              onChange={(v) => upd("orientation", v)}
              options={[
                { value: "portrait", label: (<><FileType2 className="h-3.5 w-3.5" /> {t.portrait}</>) },
                { value: "landscape", label: (<><RotateCw className="h-3.5 w-3.5" /> {t.landscape}</>) },
              ]}
            />
          </Field>
        </div>

        <hr className="my-7 border-hairline" />

        <div className="grid gap-7 lg:grid-cols-3">
          <Field label={t.copies}>
            <div className="inline-flex h-10 items-stretch overflow-hidden rounded-lg border border-hairline bg-surface">
              <button
                onClick={() => upd("copies", Math.max(1, s.copies - 1))}
                className="grid w-10 place-items-center text-ink hover:bg-page"
                aria-label="Decrease copies"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="grid w-16 place-items-center border-x border-hairline text-[14px] font-bold text-ink">
                {s.copies}
              </div>
              <button
                onClick={() => upd("copies", s.copies + 1)}
                className="grid w-10 place-items-center text-ink hover:bg-page"
                aria-label="Increase copies"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </Field>
          <Field label={t.printRange}>
            <Segmented
              value={s.range}
              onChange={(v) => upd("range", v)}
              options={[
                { value: "all", label: t.allPages },
                { value: "custom", label: t.customRange },
              ]}
            />
            <input
              disabled={s.range !== "custom"}
              value={s.customRange}
              onChange={(e) => upd("customRange", e.target.value)}
              placeholder={t.customRangePlaceholder}
              className="mt-3 h-10 w-full rounded-lg border border-hairline bg-surface px-3 text-[13.5px] text-ink placeholder:text-subtle focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:bg-page disabled:text-subtle"
            />
          </Field>
          <Field label={t.printType}>
            <Segmented
              value={s.side}
              onChange={(v) => upd("side", v)}
              options={[
                { value: "single", label: t.singleSide },
                { value: "double", label: t.doubleSide },
              ]}
            />
          </Field>
        </div>

        <hr className="my-7 border-hairline" />

        <div className="grid gap-7 lg:grid-cols-3">
          <Field label={t.quality}>
            <Segmented
              value={s.quality}
              onChange={(v) => upd("quality", v)}
              options={[
                { value: "draft", label: t.draft },
                { value: "standard", label: t.standard },
                { value: "high", label: t.high },
              ]}
            />
          </Field>
          <Field label={t.collate}>
            <Segmented
              value={s.collate}
              onChange={(v) => upd("collate", v)}
              options={[
                { value: "collated", label: t.collated },
                { value: "uncollated", label: t.uncollated },
              ]}
            />
          </Field>
          <Field label={t.bindingMargin}>
            <Segmented
              value={s.margin}
              onChange={(v) => upd("margin", v)}
              options={[
                { value: "none", label: t.noMargin },
                { value: "small", label: t.small },
                { value: "large", label: t.large },
              ]}
            />
          </Field>
        </div>
      </Card>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <div className="text-[15.5px] font-extrabold text-ink">{t.priceBreakdown}</div>
          <div className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            <Row label={s.range === "custom" ? "Pages to print" : t.pages} value={String(totals.pages)} />
            <Row label={t.pricePerPage} value={`NPR ${totals.pricePerPage.toFixed(2)}`} />
            <Row label={t.copies} value={String(settings.copies)} />
            <Row label={t.totalPages} value={`${totals.pages} × ${settings.copies} = ${totals.totalPages}`} />
            <Row label={t.colorMode} value={settings.color === "bw" ? t.bw : t.color} />
            <Row label={t.subtotal} value={`NPR ${totals.subtotal.toFixed(2)}`} />
            <Row label={t.paperSize} value={settings.paper} />
            <Row label={t.serviceCharge} value={`NPR ${totals.serviceCharge.toFixed(2)}`} />
            <Row label={t.printType} value={settings.side === "single" ? t.singleSide : t.doubleSide} />
          </div>
          <hr className="my-5 border-hairline" />
          <div className="flex items-center justify-between">
            <div className="text-[15px] font-extrabold text-ink">{t.totalAmount}</div>
            <div className="text-[18px] font-extrabold text-brand">NPR {totals.total.toFixed(2)}</div>
          </div>
        </Card>

        <div className="rounded-2xl border border-success/30 bg-success-soft/60 p-5 shadow-card">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-success/15 text-success">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="text-[14.5px] font-extrabold text-ink">{t.secureAutomatic}</div>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-body">{t.secureDesc}</p>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[13px] text-body">{t.estimatedTime}</span>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-success">
              <Clock className="h-4 w-4" /> {t.min}
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface p-4 shadow-card">
        <Link
          to="/flow/upload"
          className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 text-[14px] font-semibold text-ink hover:bg-page"
        >
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Link>
        <button
          onClick={() => setShowPreview(true)}
          className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-brand/40 bg-brand-soft px-4 text-[14px] font-semibold text-brand hover:bg-brand/15"
        >
          <Eye className="h-4 w-4" /> Print Preview
        </button>
        <div className="hidden items-center gap-2 text-[12px] text-body sm:flex">
          <span className="font-bold text-ink">NPR {totals.total.toFixed(2)}</span>
          <span>·</span>
          <span>{totals.totalPages} {t.pages.toLowerCase()}</span>
        </div>
        <Link
          to="/flow/summary"
          className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand px-5 text-[14px] font-semibold text-white shadow-cta transition hover:bg-brand-deep"
        >
          {t.continue} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <AnimatePresence>
        {showPreview && (
          <PrintPreviewModal
            files={files}
            orientation={settings.orientation}
            paper={settings.paper}
            color={settings.color}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-[13.5px]">
      <span className="truncate text-body">{label}</span>
      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}