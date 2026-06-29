import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import {
  Cloud,
  Trash2,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useFlow, type UploadedFile } from "@/lib/flow-context";
import { FileTypeIcon } from "@/components/printcloud/primitives";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/flow/upload")({
  head: () => ({
    meta: [
      { title: "Upload documents — PrintCloud" },
      { name: "description", content: "Upload PDF, DOC, images and more to print." },
    ],
  }),
  component: UploadStep,
});

const ACCEPTED = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp";
const MAX_MB = 50;

// Module-level blob URL cache — survives re-renders, cleared on removal
const blobCache = new Map<string, string>();

function detectKind(name: string): UploadedFile["kind"] {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "docx";
  return "img";
}

function estimatePages(file: File, kind: UploadedFile["kind"]): number {
  if (kind === "img") return 1;
  if (kind === "docx") return Math.max(1, Math.round(file.size / 2500));
  return Math.max(1, Math.round(file.size / 51200));
}

function processFiles(
  fileList: FileList,
): { added: UploadedFile[]; errors: string[] } {
  const added: UploadedFile[] = [];
  const errors: string[] = [];

  Array.from(fileList).forEach((file) => {
    const sizeMB = +(file.size / 1024 / 1024).toFixed(1);
    if (sizeMB > MAX_MB) {
      errors.push(`${file.name} exceeds ${MAX_MB} MB`);
      return;
    }
    const kind = detectKind(file.name);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    blobCache.set(id, URL.createObjectURL(file));
    added.push({
      id,
      name: file.name,
      sizeMB,
      pages: estimatePages(file, kind),
      kind,
    });
  });

  return { added, errors };
}

// ─── Preview modal ────────────────────────────────────────────────────────────

function PreviewModal({
  file,
  onClose,
}: {
  file: UploadedFile;
  onClose: () => void;
}) {
  const url = blobCache.get(file.id);
  const [zoom, setZoom] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
        style={{ maxHeight: "92dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
          <FileTypeIcon kind={file.kind} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-bold text-ink">{file.name}</div>
            <div className="text-[12px] text-body">
              {file.sizeMB} MB · ~{file.pages} {file.pages === 1 ? "page" : "pages"}
            </div>
          </div>
          {file.kind === "img" && (
            <div className="hidden items-center gap-1 sm:flex">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                className="grid h-8 w-8 place-items-center rounded-lg border border-hairline hover:bg-page"
              >
                <ZoomOut className="h-4 w-4 text-body" />
              </button>
              <span className="w-12 text-center text-[12px] font-semibold text-body">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                className="grid h-8 w-8 place-items-center rounded-lg border border-hairline hover:bg-page"
              >
                <ZoomIn className="h-4 w-4 text-body" />
              </button>
            </div>
          )}
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-hairline hover:bg-page"
          >
            <X className="h-4 w-4 text-ink" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-page">
          {!url ? (
            <div className="grid place-items-center py-20 text-[14px] text-body">
              Preview not available — file data was lost on page refresh.
            </div>
          ) : file.kind === "img" ? (
            <div className="flex min-h-[300px] items-center justify-center p-4">
              <img
                src={url}
                alt={file.name}
                className="max-w-full rounded-xl object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}
              />
            </div>
          ) : file.kind === "pdf" ? (
            <iframe
              src={url}
              title={file.name}
              className="h-[70dvh] w-full"
            />
          ) : (
            <div className="grid place-items-center py-20">
              <div className="text-center">
                <FileTypeIcon kind={file.kind} size="md" />
                <p className="mt-4 text-[14px] text-body">
                  Preview not available for .{file.name.split(".").pop()} files.
                </p>
                <p className="mt-1 text-[13px] text-subtle">
                  Your file is uploaded and ready to print.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Upload step ──────────────────────────────────────────────────────────────

function UploadStep() {
  const { files, setFiles } = useFlow();
  const { t } = useLang();
  const [drag, setDrag] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileList(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const { added, errors: errs } = processFiles(fileList);
    setFiles([...files, ...added]);
    setErrors(errs);
  }

  function removeFile(id: string) {
    const url = blobCache.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      blobCache.delete(id);
    }
    setFiles(files.filter((f) => f.id !== id));
  }

  const canContinue = files.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <Header title={t.uploadTitle} subtitle={t.uploadSubtitle} />

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          className="sr-only"
          onChange={(e) => handleFileList(e.target.files)}
          onClick={(e) => { (e.currentTarget as HTMLInputElement).value = ""; }}
        />

        {/* Drop zone */}
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFileList(e.dataTransfer.files);
          }}
          animate={{ borderColor: drag ? "var(--color-brand)" : "var(--color-hairline)" }}
          className="mt-5 cursor-pointer rounded-2xl border-2 border-dashed bg-page/60 px-6 py-14 text-center transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <motion.span
            animate={{ scale: drag ? 1.1 : 1 }}
            className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand"
          >
            <Cloud className="h-7 w-7" />
          </motion.span>
          <div className="mt-4 text-[17px] font-bold text-ink">
            {drag ? t.uploadDrop : t.uploadDrag}
          </div>
          <div className="mt-1 text-[13px] text-body">{t.uploadOr}</div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            className="mt-3 inline-flex h-11 items-center rounded-lg bg-brand px-6 text-[14px] font-semibold text-white shadow-cta transition hover:bg-brand-deep active:scale-[0.98]"
          >
            {t.uploadChoose}
          </button>
          <div className="mt-5 text-[12px] text-body">{t.uploadFormats}</div>
        </motion.div>

        {/* Errors */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex flex-col gap-1.5 rounded-xl bg-danger-soft p-3.5"
            >
              {errors.map((e) => (
                <div key={e} className="flex items-center gap-2 text-[13px] text-danger">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {e}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* File list */}
        <div className="mt-7">
          <div className="text-[15px] font-bold text-ink">
            {t.uploadedFiles} ({files.length})
          </div>
          <ul className="mt-3 space-y-2.5">
            <AnimatePresence initial={false}>
              {files.map((f) => (
                <motion.li
                  key={f.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.22 }}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-hairline bg-surface p-3"
                >
                  <FileTypeIcon kind={f.kind} />
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-bold text-ink">{f.name}</div>
                    <div className="text-[12px] text-body">
                      {f.sizeMB} MB · ~{f.pages} {f.pages === 1 ? "page" : "pages"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewFile(f)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 text-[12.5px] font-semibold text-ink hover:bg-page"
                    >
                      <Eye className="h-4 w-4 text-body" />
                      <span className="hidden sm:inline">{t.preview}</span>
                    </button>
                    <button
                      onClick={() => removeFile(f.id)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-hairline text-body hover:bg-page hover:text-danger"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {files.length === 0 && (
            <div className="rounded-xl border border-dashed border-hairline bg-page/40 py-8 text-center text-[13px] text-body">
              {t.noFiles}
            </div>
          )}

          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-brand-soft/60 p-3.5 text-[13px] text-ink">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#E0A412]" />
            <span>{t.uploadTip}</span>
          </div>
        </div>
      </Card>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface p-4 shadow-card">
        <Link
          to="/"
          className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 text-[14px] font-semibold text-ink hover:bg-page"
        >
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Link>
        {canContinue ? (
          <Link
            to="/flow/configure"
            className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand px-5 text-[14px] font-semibold text-white shadow-cta transition hover:bg-brand-deep"
          >
            {t.continue} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex h-11 cursor-not-allowed items-center gap-1.5 rounded-xl bg-hairline px-5 text-[14px] font-semibold text-subtle"
          >
            {t.continue} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewFile && (
          <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Shared layout primitives ─────────────────────────────────────────────────

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface p-5 shadow-card sm:p-6 lg:p-7">
      {children}
    </section>
  );
}

export function Header({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <div className="min-w-0">
        <h1 className="text-[24px] font-extrabold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[14px] text-body">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export function Footer({
  leftHelper,
  primary,
  secondary,
}: {
  leftHelper?: React.ReactNode;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-hairline bg-surface p-4 shadow-card sm:p-5">
      <div className="min-w-0 truncate">{secondary ?? leftHelper}</div>
      <div className="flex items-center gap-3">
        {secondary && leftHelper}
        {primary}
      </div>
    </div>
  );
}
