import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type UploadedFile = {
  id: string;
  name: string;
  sizeMB: number;
  pages: number;
  kind: "pdf" | "docx" | "img";
};

export type PrintSettings = {
  paper: "A4" | "A3" | "Letter" | "Legal";
  color: "bw" | "color";
  orientation: "portrait" | "landscape";
  copies: number;
  range: "all" | "custom";
  customRange: string;
  side: "single" | "double";
  quality: "draft" | "standard" | "high";
  collate: "collated" | "uncollated";
  margin: "none" | "small" | "large";
};

const defaultFiles: UploadedFile[] = [];

const defaultSettings: PrintSettings = {
  paper: "A4",
  color: "bw",
  orientation: "portrait",
  copies: 1,
  range: "all",
  customRange: "",
  side: "single",
  quality: "standard",
  collate: "collated",
  margin: "none",
};

function parseRangeCount(rangeStr: string, totalPages: number): number {
  let count = 0;
  for (const part of rangeStr.split(",")) {
    const t = part.trim();
    if (t.includes("-")) {
      const [a, b] = t.split("-").map((n) => parseInt(n.trim(), 10));
      if (!isNaN(a) && !isNaN(b)) count += Math.max(0, Math.min(b, totalPages) - Math.max(1, a) + 1);
    } else {
      const n = parseInt(t, 10);
      if (!isNaN(n) && n >= 1 && n <= totalPages) count++;
    }
  }
  return Math.max(1, count);
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined" || typeof window.sessionStorage?.getItem !== "function") return fallback;
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    if (typeof window === "undefined" || typeof window.sessionStorage?.setItem !== "function") return;
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — silently ignore
  }
}

type Ctx = {
  files: UploadedFile[];
  setFiles: (f: UploadedFile[]) => void;
  settings: PrintSettings;
  setSettings: (s: PrintSettings) => void;
  totals: {
    pages: number;
    totalPages: number;
    pricePerPage: number;
    subtotal: number;
    serviceCharge: number;
    total: number;
  };
};

const FlowCtx = createContext<Ctx | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [files, setFilesState] = useState<UploadedFile[]>(() =>
    readStorage("pc_files", defaultFiles),
  );
  const [settings, setSettingsState] = useState<PrintSettings>(() => ({
    ...defaultSettings,
    ...readStorage<Partial<PrintSettings>>("pc_settings", {}),
  }));

  function setFiles(f: UploadedFile[]) {
    setFilesState(f);
    writeStorage("pc_files", f);
  }

  function setSettings(s: PrintSettings) {
    setSettingsState(s);
    writeStorage("pc_settings", s);
  }

  const totals = useMemo(() => {
    const docPages = files.reduce((s, f) => s + f.pages, 0) || 1;
    const pages = settings.range === "custom" && settings.customRange.trim()
      ? parseRangeCount(settings.customRange, docPages)
      : docPages;
    const totalPages = pages * settings.copies;
    const pricePerPage = settings.color === "color" ? 10 : 4;
    const subtotal = totalPages * pricePerPage;
    const serviceCharge = 0;
    return { pages, totalPages, pricePerPage, subtotal, serviceCharge, total: subtotal + serviceCharge };
  }, [files, settings]);

  return (
    <FlowCtx.Provider value={{ files, setFiles, settings, setSettings, totals }}>
      {children}
    </FlowCtx.Provider>
  );
}

export function useFlow() {
  const ctx = useContext(FlowCtx);
  if (!ctx) throw new Error("useFlow must be used inside FlowProvider");
  return ctx;
}
