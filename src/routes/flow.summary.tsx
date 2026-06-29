import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Edit3,
  FileType2,
  Palette,
  RotateCw,
  FileText,
  Layers,
  Copy as CopyIcon,
  Sliders,
  AlignJustify,
  Shield,
  ShieldCheck,
  Printer,
  Clock,
  Receipt,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useFlow } from "@/lib/flow-context";
import { FileTypeIcon } from "@/components/printcloud/primitives";
import { Card, Header } from "./flow.upload";
import { cn } from "@/lib/utils";
import { initiateEsewaPayment, generateTransactionUuid } from "@/lib/esewa";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/flow/summary")({
  head: () => ({
    meta: [
      { title: "Summary & payment — PrintCloud" },
      { name: "description", content: "Review your order and pay with eSewa." },
    ],
  }),
  component: SummaryStep,
});

function SummaryStep() {
  const { files, settings, totals } = useFlow();
  const { t } = useLang();
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  async function handlePay() {
    setPaying(true);
    try {
      const uuid = generateTransactionUuid();
      // Store transaction UUID so we can verify on return
      sessionStorage.setItem("pc_txn_uuid", uuid);

      await initiateEsewaPayment({
        amount: totals.total,
        transactionUuid: uuid,
        successUrl: `${window.location.origin}/flow/printing`,
        failureUrl: `${window.location.origin}/flow/summary`,
      });
    } catch {
      setPaying(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <Header title={t.summaryTitle} subtitle={t.summarySubtitle} />

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left */}
          <div className="flex flex-col gap-5">
            {/* Order summary */}
            <section className="rounded-2xl border border-hairline bg-surface p-5">
              <div className="flex items-center justify-between">
                <div className="text-[15.5px] font-extrabold text-ink">{t.orderSummary}</div>
                <button
                  onClick={() => navigate({ to: "/flow/configure" })}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand"
                >
                  <Edit3 className="h-3.5 w-3.5" /> {t.edit}
                </button>
              </div>

              {files.length === 0 ? (
                <div className="mt-3 text-[13px] text-body">No files uploaded.</div>
              ) : (
                <ul className="mt-3 space-y-2.5">
                  {files.map((f) => (
                    <li
                      key={f.id}
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-hairline bg-page/40 p-3"
                    >
                      <FileTypeIcon kind={f.kind} />
                      <div className="min-w-0">
                        <div className="truncate text-[14px] font-bold text-ink">{f.name}</div>
                        <div className="text-[12px] text-body">
                          {f.pages} pages · {f.sizeMB} MB
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <hr className="my-5 border-hairline" />
              <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                <Spec icon={FileType2} label={t.paperSize} value={settings.paper} />
                <Spec icon={FileText} label={t.printRangeLabel} value={settings.range === "all" ? t.allPages : settings.customRange || t.customRange} />
                <Spec icon={Palette} label={t.colorModeLabel} value={settings.color === "bw" ? t.bw : t.color} />
                <Spec icon={Sliders} label={t.qualityLabel} value={settings.quality === "draft" ? t.draft : settings.quality === "standard" ? t.standard : t.high} />
                <Spec icon={RotateCw} label={t.orientation} value={settings.orientation === "portrait" ? t.portrait : t.landscape} />
                <Spec icon={Layers} label={t.collateLabel} value={settings.collate === "collated" ? t.collated : t.uncollated} />
                <Spec icon={FileText} label={t.printTypeLabel} value={settings.side === "single" ? t.singleSide : t.doubleSide} />
                <Spec icon={AlignJustify} label={t.bindingMarginLabel} value={settings.margin === "none" ? t.noMargin : settings.margin === "small" ? t.small : t.large} />
                <Spec icon={CopyIcon} label={t.copiesLabel} value={String(settings.copies)} />
              </div>
            </section>

            {/* Price breakdown */}
            <section className="rounded-2xl border border-hairline bg-surface p-5">
              <div className="text-[15.5px] font-extrabold text-ink">{t.priceBreakdown}</div>
              <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                <PriceRow label={t.pages} value={String(totals.pages)} />
                <PriceRow label={t.totalPages} value={String(totals.totalPages)} />
                <PriceRow label={t.copiesLabel} value={String(settings.copies)} />
                <PriceRow label={t.subtotal} value={`NPR ${totals.subtotal.toFixed(2)}`} />
                <PriceRow
                  label={`${t.pricePerPage} (${settings.color === "bw" ? t.bw : t.color} ${settings.paper})`}
                  value={`NPR ${totals.pricePerPage.toFixed(2)}`}
                />
                <PriceRow label={t.serviceCharge} value="Free" />
              </div>
              <hr className="my-5 border-hairline" />
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-extrabold text-ink">{t.totalAmount}</div>
                <div className="text-[19px] font-extrabold text-brand">NPR {totals.total.toFixed(2)}</div>
              </div>
            </section>

            <div className="flex items-center gap-2.5 rounded-xl bg-brand-soft/60 p-3.5 text-[13px] text-ink">
              <Shield className="h-4 w-4 shrink-0 text-brand" />
              <span>{t.filesSecure}</span>
            </div>
          </div>

          {/* Right — eSewa payment panel */}
          <aside className="flex flex-col gap-4 rounded-2xl border border-hairline bg-surface p-5 lg:sticky lg:top-24 lg:h-fit">
            <div>
              <div className="text-[15.5px] font-extrabold text-ink">{t.payment}</div>
              <div className="text-[12.5px] text-body">{t.paySecurely}</div>
            </div>

            {/* eSewa card */}
            <div className="rounded-2xl border-2 border-success bg-success-soft/40 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-success/15 text-[18px] font-extrabold text-success">
                  e
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-extrabold text-ink">eSewa</div>
                  <div className="text-[12px] text-body">{t.esewaNepal}</div>
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
                  {t.esewaRecommended}
                </span>
              </div>
              <div className="mt-3 text-[12.5px] leading-relaxed text-body">{t.esewaDesc}</div>
            </div>

            <div className="rounded-xl bg-success-soft/60 p-3.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span className="text-[13px] font-extrabold text-ink">{t.securePayment}</span>
              </div>
              <p className="mt-1 text-[12px] text-body">{t.securePaymentDesc}</p>
            </div>

            <div className="flex items-center justify-between border-t border-hairline pt-4">
              <span className="text-[13px] font-semibold text-body">{t.totalAmount}</span>
              <span className="text-[17px] font-extrabold text-brand">NPR {totals.total.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePay}
              disabled={paying || files.length === 0}
              className={cn(
                "inline-flex h-13 items-center justify-center gap-2.5 rounded-xl px-6 text-[15px] font-bold text-white shadow-cta transition",
                paying || files.length === 0
                  ? "cursor-not-allowed bg-hairline text-subtle shadow-none"
                  : "bg-success hover:bg-[oklch(0.55_0.17_148)]",
              )}
            >
              {paying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> {t.payingButton}
                </>
              ) : (
                <>
                  <span className="text-[18px] font-extrabold leading-none">e</span>
                  {t.payButton(totals.total.toFixed(2))}
                </>
              )}
            </button>

            {files.length === 0 && (
              <p className="text-center text-[11.5px] text-danger">{t.noFilesWarning}</p>
            )}

            <p className="text-center text-[11.5px] text-body">
              {t.termsText}{" "}
              <a className="font-semibold text-brand underline">{t.termsLink}</a> and{" "}
              <a className="font-semibold text-brand underline">{t.privacyLink}</a>
            </p>
          </aside>
        </div>
      </Card>

      {/* Trust bar */}
      <section className="grid gap-5 rounded-2xl border border-hairline bg-surface p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4">
        <Trust icon={Shield} title={t.encryptedSafe} sub={t.encryptedSafeDesc} tone="green" />
        <Trust icon={Printer} title={t.autoPrint} sub={t.autoPrintDesc} tone="blue" />
        <Trust icon={Clock} title={t.liveTracking} sub={t.liveTrackingDesc} tone="orange" />
        <Trust icon={Receipt} title={t.digitalReceipt} sub={t.digitalReceiptDesc} tone="violet" />
      </section>

      {/* Back button */}
      <div className="flex">
        <button
          onClick={() => navigate({ to: "/flow/configure" })}
          className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 text-[14px] font-semibold text-ink hover:bg-page"
        >
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </button>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-[13.5px]">
      <span className="inline-flex min-w-0 items-center gap-2 text-body">
        <Icon className="h-3.5 w-3.5 shrink-0 text-subtle" />
        <span className="truncate">{label}</span>
      </span>
      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-[13.5px]">
      <span className="truncate text-body">{label}</span>
      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}

function Trust({
  icon: Icon,
  title,
  sub,
  tone,
}: {
  icon: any;
  title: string;
  sub: string;
  tone: "blue" | "green" | "violet" | "orange";
}) {
  const tones = {
    blue: "bg-brand-soft text-brand",
    green: "bg-success-soft text-success",
    violet: "bg-violet-soft text-[#6D5BD0]",
    orange: "bg-orange-soft text-[#E07A3C]",
  };
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[14px] font-extrabold text-ink">{title}</div>
        <div className="text-[12.5px] text-body">{sub}</div>
      </div>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
