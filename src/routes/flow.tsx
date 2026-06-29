import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { FlowProvider } from "@/lib/flow-context";
import { FlowHeader } from "@/components/printcloud/flow-header";
import { StepperDesktop, StepperMobile } from "@/components/printcloud/stepper";
import { ShopCard, TrustList, SslFooterBadge, defaultTrust, printingTrust } from "@/components/printcloud/sidebar-rails";
import { Headphones } from "lucide-react";

export const Route = createFileRoute("/flow")({
  component: FlowLayout,
});

function FlowLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isPrinting = path.startsWith("/flow/printing") || path.startsWith("/flow/completed");
  const trust = isPrinting ? printingTrust : defaultTrust;

  return (
    <FlowProvider>
      <div className="min-h-screen bg-page">
        <FlowHeader />
        <div className="mx-auto max-w-[1320px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
            {/* Left rail */}
            <aside className="hidden flex-col gap-5 lg:flex">
              <StepperDesktop />
              <ShopCard />
              <div className="rounded-2xl border border-hairline bg-surface p-4 shadow-card">
                <TrustList items={trust} />
              </div>
              <div className="mt-auto flex items-center justify-between px-1 pt-4">
                <SslFooterBadge />
              </div>
              {isPrinting && (
                <div className="-mt-2 flex items-center gap-3 px-1">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-page ring-1 ring-hairline">
                    <Headphones className="h-4 w-4 text-subtle" />
                  </span>
                  <div>
                    <div className="text-[13px] font-bold text-ink">Need help?</div>
                    <div className="text-[12px] text-body">Contact Support</div>
                  </div>
                </div>
              )}
            </aside>

            {/* Mobile stepper */}
            <div className="lg:hidden">
              <StepperMobile />
            </div>

            {/* Main */}
            <main className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={path}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </FlowProvider>
  );
}