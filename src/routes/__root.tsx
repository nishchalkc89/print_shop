import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LangProvider } from "@/lib/i18n";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function useServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failed — app still works, just no offline support
      });
    }
  }, []);
}

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PrintCloud — Print anything in seconds" },
      { name: "description", content: "Scan a QR code at any print shop, upload documents, pay securely and get your prints automatically — no WhatsApp." },
      { name: "theme-color", content: "#2563EB" },
      { property: "og:title", content: "PrintCloud — Print anything in seconds" },
      { property: "og:description", content: "Scan, upload, pay, print. The QR-based print portal built for Nepal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "PrintCloud" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// ─── PWA Install Banner ───────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Don't show if already installed (running in standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Don't show if user dismissed before
    if (sessionStorage.getItem("pwa_dismissed")) return;

    // Show banner after 3 seconds on first visit
    let timer: ReturnType<typeof setTimeout>;

    function onPrompt(e: Event) {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      timer = setTimeout(() => setVisible(true), 3000);
    }

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      clearTimeout(timer);
    };
  }, []);

  function handleInstall() {
    if (!prompt) return;
    prompt.prompt();
    prompt.userChoice.then(() => {
      setVisible(false);
      setPrompt(null);
    });
  }

  function handleDismiss() {
    setVisible(false);
    sessionStorage.setItem("pwa_dismissed", "1");
  }

  if (installed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-sm sm:left-auto sm:right-6 sm:max-w-[360px]"
        >
          <div className="overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_8px_40px_-8px_rgba(0,0,0,0.18)]">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand to-[#6D5BD0]" />

            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Smartphone className="h-6 w-6" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-extrabold text-ink">
                    Install PrintCloud
                  </div>
                  <div className="mt-0.5 text-[12.5px] leading-snug text-body">
                    Add to your home screen for faster access — works offline too.
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-subtle hover:bg-page"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={handleInstall}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-brand text-[13.5px] font-bold text-white shadow-cta transition hover:bg-brand-deep"
                >
                  <Download className="h-4 w-4" /> Install App
                </button>
                <button
                  onClick={handleDismiss}
                  className="h-10 rounded-xl border border-hairline px-4 text-[13.5px] font-semibold text-body hover:bg-page"
                >
                  Not now
                </button>
              </div>

              {/* iOS hint */}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useServiceWorker();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <Outlet />
        <PWAInstallBanner />
      </LangProvider>
    </QueryClientProvider>
  );
}
