import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Minus, Plus, Eye, ShieldCheck, Clock, FileType2, Palette, RotateCw } from "lucide-react";
import { useFlow, type PrintSettings } from "@/lib/flow-context";
import { FileTypeIcon } from "@/components/printcloud/primitives";
import { Card, Header } from "./flow.upload";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

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

function ConfigureStep() {
  const { files, settings, setSettings, totals } = useFlow();
  const { t } = useLang();
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
            <Row label={t.pages} value={String(totals.pages)} />
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

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface p-4 shadow-card">
        <Link
          to="/flow/upload"
          className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 text-[14px] font-semibold text-ink hover:bg-page"
        >
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Link>
        <div className="flex items-center gap-2 text-[12px] text-body">
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