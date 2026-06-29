import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import {
  X,
  QrCode,
  Upload,
  Sliders,
  Printer,
  Shield,
  Wallet,
  MessageSquareOff,
  Cloud,
  ChevronRight,
  ArrowRight,
  Zap,
  Lock,
  Smartphone,
  Menu,
} from "lucide-react";
import { BrandLogo, Pill, SoftIconTile } from "@/components/printcloud/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrintCloud — Print anything in seconds" },
      {
        name: "description",
        content:
          "Scan a QR code at any print shop, upload documents, pay with eSewa and get your prints automatically. Built for Nepal.",
      },
    ],
  }),
  component: Landing,
});

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Why PrintCloud", href: "#why" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > threshold); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function Landing() {
  return (
    <div className="min-h-screen bg-page">
      <TopNav />
      <Hero />
      <HowItWorks />
      <WhyPrintCloud />
      <LandingFooter />
    </div>
  );
}

function TopNav() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-surface/95 shadow-[0_1px_0_0_var(--color-hairline)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        {/* Desktop links */}
        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((n) => (
            <button
              key={n.label}
              onClick={() => scrollTo(n.href.slice(1))}
              className="rounded-lg px-3 py-2 text-[14px] font-semibold text-body transition hover:text-ink"
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          to="/flow/upload"
          className="ml-auto hidden h-10 items-center gap-2 rounded-xl bg-brand px-5 text-[14px] font-semibold text-white shadow-cta transition hover:bg-brand-deep lg:inline-flex"
        >
          <Upload className="h-4 w-4" /> Try Now
        </Link>

        {/* Mobile: CTA + hamburger */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Link
            to="/flow/upload"
            className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-xl bg-brand px-4 text-[13.5px] font-semibold text-white shadow-cta"
          >
            <Upload className="h-3.5 w-3.5" /> Try Now
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-grid h-9 w-9 place-items-center rounded-xl border border-hairline bg-surface/80"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4.5 w-4.5 text-ink" /> : <Menu className="h-4.5 w-4.5 text-ink" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="border-t border-hairline bg-surface/95 backdrop-blur-md lg:hidden"
          >
            <div className="mx-auto flex max-w-[1320px] flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map((n) => (
                <button
                  key={n.label}
                  onClick={() => { scrollTo(n.href.slice(1)); setOpen(false); }}
                  className="rounded-xl px-4 py-3 text-left text-[15px] font-semibold text-ink transition hover:bg-page"
                >
                  {n.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-[1320px] gap-10 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:pb-16 lg:pt-14">
      <div className="flex min-w-0 flex-col">
        <Pill className="w-fit">
          Built for Nepal <span className="ml-0.5">🇳🇵</span>
        </Pill>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-5 text-[42px] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[64px]"
        >
          Print anything.
          <br />
          <span className="text-brand">In seconds.</span>
        </motion.h1>
        <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-body sm:text-base">
          Scan a QR code at any print shop, upload your documents, pay with eSewa and get your
          prints — automatically.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-4 max-w-xl">
          <FeatureChip icon={MessageSquareOff} tone="blue" title="No WhatsApp" sub="No manual steps" />
          <FeatureChip icon={Printer} tone="violet" title="Auto Print" sub="Zero interaction" />
          <FeatureChip icon={Shield} tone="green" title="Secure & Private" sub="Files auto-deleted" />
          <FeatureChip icon={Wallet} tone="orange" title="Pay via eSewa" sub="Quick & secure" />
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            to="/flow/upload"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-6 text-[15px] font-semibold text-white shadow-cta transition hover:bg-brand-deep"
          >
            <Upload className="h-5 w-5" /> Upload & Print Now
          </Link>
        </div>

        <div className="mt-7">
          <div className="text-[13px] text-body">Trusted by print shops across Nepal</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#E0A48F", "#C7B198", "#A1A8B5", "#7E6E5C"].map((c, i) => (
                <span
                  key={i}
                  className="h-8 w-8 rounded-full ring-2 ring-surface"
                  style={{ background: `linear-gradient(135deg, ${c}, #6b5443)` }}
                />
              ))}
            </div>
            <span className="rounded-full bg-page px-2.5 py-1 text-xs font-semibold text-body">
              +250 shops
            </span>
          </div>
        </div>
      </div>

      <HeroVisual />
    </section>
  );
}

function FeatureChip({
  icon: Icon,
  tone,
  title,
  sub,
}: {
  icon: any;
  tone: "blue" | "violet" | "green" | "orange";
  title: string;
  sub: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <SoftIconTile tone={tone} size="sm">
          <Icon className="h-4 w-4" />
        </SoftIconTile>
        <span className="truncate text-[13px] font-bold text-ink">{title}</span>
      </div>
      <div className="ml-10 truncate text-[12px] text-body">{sub}</div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative isolate mx-auto h-[520px] w-full max-w-[560px] sm:h-[600px]">
      <div className="absolute -left-10 top-12 h-44 w-44 rounded-full bg-brand-soft blur-2xl" aria-hidden />
      <div className="absolute right-0 top-40 h-20 w-20 rounded-full bg-violet-soft blur-xl" aria-hidden />

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute left-1/2 top-2 z-20 w-[280px] -translate-x-1/2 sm:w-[320px]"
      >
        <PhoneMock />
      </motion.div>

      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="absolute right-0 top-10 z-10 w-[170px] rounded-2xl border border-hairline bg-surface p-4 shadow-card sm:right-2 sm:w-[190px]"
      >
        <div className="text-[13px] font-bold leading-tight text-ink">
          Scan this QR
          <div className="text-[11.5px] font-semibold text-body">to start printing</div>
        </div>
        <div className="mt-3 grid place-items-center rounded-xl bg-page p-2">
          <QrPattern />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="absolute -right-2 bottom-24 z-10 w-[200px] sm:w-[230px]"
      >
        <PrinterMock />
      </motion.div>

      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute bottom-6 right-2 z-30 w-[210px] rounded-xl border border-hairline bg-surface p-3 shadow-card"
      >
        <div className="flex items-center gap-2.5">
          <SoftIconTile tone="blue" size="sm">
            <Printer className="h-4 w-4" />
          </SoftIconTile>
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-ink">Printing...</div>
            <div className="text-[11px] text-body">Job #A45871</div>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-page">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "62%" }}
            transition={{ duration: 1.6, delay: 0.7, ease: "easeOut" }}
            className="h-full rounded-full bg-success"
          />
        </div>
      </motion.div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="rounded-[34px] border-[10px] border-[#15171c] bg-[#0f1115] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)]">
      <div className="overflow-hidden rounded-[24px] bg-surface">
        <div className="relative flex h-8 items-center justify-between px-5 pt-2 text-[10px] font-semibold text-ink">
          <span>9:41</span>
          <span className="absolute left-1/2 top-1.5 h-4 w-20 -translate-x-1/2 rounded-full bg-[#0f1115]" />
          <span>•••</span>
        </div>
        <div className="flex items-center gap-2 px-4 pb-3 pt-2">
          <span className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-200 to-amber-500" />
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-ink">Namaste Prints</div>
            <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
            </div>
          </div>
          <span className="ml-auto text-subtle">···</span>
        </div>
        <div className="mx-3 rounded-xl border border-hairline bg-surface p-3">
          <div className="text-[12px] font-bold text-ink">Upload Document</div>
          <div className="text-[10px] text-body">PDF, DOC, JPG, PNG and more</div>
          <div className="mt-2.5 grid place-items-center rounded-lg bg-page py-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand">
              <Cloud className="h-5 w-5" />
            </span>
            <div className="mt-2 text-[11px] font-bold text-ink">Tap to upload</div>
            <div className="text-[10px] text-body">or drag and drop</div>
          </div>
        </div>
        <div className="px-4 pb-2 pt-3 text-[11px] font-bold text-ink">Recent File</div>
        <div className="mx-3 flex items-center gap-2.5 rounded-lg bg-page px-3 py-2">
          <span className="grid h-7 w-7 place-items-center rounded bg-[#FEEAEA] text-[8px] font-bold text-[#D9342B]">
            PDF
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-bold text-ink">Project_Report.pdf</div>
            <div className="text-[10px] text-body">2.4 MB · 15 pages</div>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-subtle" />
        </div>
        <div className="px-3 pb-4 pt-3">
          <div className="grid h-9 place-items-center rounded-lg bg-brand text-[12px] font-semibold text-white">
            Continue
          </div>
        </div>
      </div>
    </div>
  );
}

function PrinterMock() {
  return (
    <div className="relative">
      <div className="mx-auto h-[120px] w-[160px] rounded-2xl bg-gradient-to-b from-[#f3f5f9] to-[#dde3ee] shadow-card">
        <div className="mx-auto mt-3 h-3 w-24 rounded-full bg-[#0f1115]" />
        <div className="mx-auto mt-2 h-12 w-32 rounded-md bg-[#1a1d23]" />
        <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-brand/60" />
      </div>
      <div className="absolute -bottom-10 left-1/2 w-32 -translate-x-1/2 rounded-md bg-surface p-2 shadow-card">
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

function QrPattern() {
  return (
    <svg viewBox="0 0 60 60" className="h-28 w-28">
      <rect width="60" height="60" fill="white" />
      {Array.from({ length: 12 }).map((_, r) =>
        Array.from({ length: 12 }).map((_c, c) => {
          const seed = (r * 31 + c * 17) % 7;
          return seed > 3 ? (
            <rect key={`${r}-${c}`} x={c * 5} y={r * 5} width="5" height="5" fill="#0f1115" />
          ) : null;
        }),
      )}
      {([
        [0, 0],
        [45, 0],
        [0, 45],
      ] as [number, number][]).map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="15" height="15" fill="white" />
          <rect x={x} y={y} width="15" height="15" fill="none" stroke="#0f1115" strokeWidth="3" />
          <rect x={x + 5} y={y + 5} width="5" height="5" fill="#0f1115" />
        </g>
      ))}
    </svg>
  );
}

// ─── How it Works ──────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    n: "01",
    title: "Scan Shop QR",
    desc: "At any PrintCloud-enabled shop, scan the QR code on the counter to open your print session instantly.",
    icon: QrCode,
    color: "#2563EB",
    glow: "rgba(37,99,235,0.20)",
    soft: "rgba(37,99,235,0.12)",
  },
  {
    n: "02",
    title: "Upload Your Files",
    desc: "Upload PDF, Word docs, images or any file straight from your phone. No cables, no USB drives needed.",
    icon: Upload,
    color: "#7C3AED",
    glow: "rgba(124,58,237,0.20)",
    soft: "rgba(124,58,237,0.12)",
  },
  {
    n: "03",
    title: "Configure & Pay",
    desc: "Choose paper size, color, copies and range. See the live price, then pay securely with eSewa in seconds.",
    icon: Sliders,
    color: "#059669",
    glow: "rgba(5,150,105,0.20)",
    soft: "rgba(5,150,105,0.12)",
  },
  {
    n: "04",
    title: "Auto Print",
    desc: "Your document is sent directly to the printer and prints automatically. Zero shopkeeper interaction.",
    icon: Printer,
    color: "#D97706",
    glow: "rgba(217,119,6,0.20)",
    soft: "rgba(217,119,6,0.12)",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden border-t border-hairline bg-page">
      <div className="relative mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-brand-soft px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand"
          >
            Simple · Fast · Secure
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 text-[38px] font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[52px]"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-4 max-w-lg text-[15px] leading-relaxed text-body"
          >
            From upload to printed paper in under 5 minutes. No app download, no account needed.
          </motion.p>
        </div>

        {/* Steps grid */}
        <div className="relative mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-hairline bg-surface p-6 shadow-card transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]"
            >
              {/* Giant background number */}
              <span
                className="pointer-events-none absolute -right-3 -top-5 select-none text-[90px] font-extrabold leading-none opacity-[0.05] transition-opacity group-hover:opacity-[0.09]"
                style={{ color: s.color }}
              >
                {s.n}
              </span>

              {/* Icon + Step badge — stacked vertically */}
              <div className="flex flex-col items-start gap-4">
                <span
                  className="inline-grid h-14 w-14 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
                  style={{ background: s.soft, color: s.color }}
                >
                  <s.icon className="h-7 w-7" strokeWidth={2} />
                </span>
                <div
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider"
                  style={{ background: s.soft, color: s.color }}
                >
                  Step {s.n}
                </div>
              </div>

              <h3 className="mt-2.5 text-[20px] font-extrabold leading-tight text-ink">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-body">{s.desc}</p>

              {/* Connector arrow — desktop only, not last */}
              {i < HOW_STEPS.length - 1 && (
                <span className="pointer-events-none absolute -right-[18px] top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M4 11H18M18 11L13 6M18 11L13 16"
                      stroke="var(--color-hairline)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-14 flex flex-col items-center gap-3"
        >
          <Link
            to="/flow/upload"
            className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-brand px-8 text-[15px] font-bold text-white shadow-cta transition hover:bg-brand-deep"
          >
            <Upload className="h-5 w-5" /> Start Printing Now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-[13px] text-body">
            No account needed · Works on mobile &amp; desktop
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Why PrintCloud ────────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    icon: Smartphone,
    tone: "blue" as const,
    title: "Works on any phone",
    desc: "No app download. Open directly in your browser by scanning a QR code.",
  },
  {
    icon: Zap,
    tone: "orange" as const,
    title: "Prints in minutes",
    desc: "From uploading to printed paper — the whole process takes under 5 minutes.",
  },
  {
    icon: Lock,
    tone: "green" as const,
    title: "Files auto-deleted",
    desc: "Your documents are permanently deleted from our servers after printing.",
  },
  {
    icon: Wallet,
    tone: "violet" as const,
    title: "Pay with eSewa",
    desc: "Secure, instant payments via eSewa — no cash, no waiting for change.",
  },
];

function WhyPrintCloud() {
  return (
    <section id="why" className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[28px] font-extrabold tracking-tight text-ink sm:text-[34px]">
            Why PrintCloud?
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-body">
            The smarter way to print in Nepal. Built for shoppers and shop owners alike.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col gap-4 rounded-2xl border border-hairline bg-page p-6"
            >
              <SoftIconTile tone={item.tone} size="lg">
                <item.icon className="h-6 w-6" strokeWidth={2.2} />
              </SoftIconTile>
              <div>
                <div className="text-[17px] font-extrabold text-ink">{item.title}</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-body">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function LandingFooter() {
  return (
    <footer id="for-shops" className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <BrandLogo />
          <div className="text-[13px] text-body">
            © {new Date().getFullYear()} PrintCloud Nepal. Built with ❤️ for Nepal.
          </div>
          <div className="flex items-center gap-4 text-[13px] font-semibold text-body">
            <a className="hover:text-ink">Privacy</a>
            <a className="hover:text-ink">Terms</a>
            <a className="hover:text-ink">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
