import { useEffect, useState } from "react";
import { HelpCircle, MapPin } from "lucide-react";
import { BrandLogo, LangSelect } from "./primitives";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

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

export function FlowHeader() {
  const scrolled = useScrolled();
  const { t } = useLang();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-all duration-300",
        scrolled
          ? "border-b border-hairline bg-surface/90 shadow-card backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        {/* Desktop extras */}
        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
              <span className="relative h-2 w-2 rounded-full bg-success" />
            </span>
            {t.shopOnline}
          </span>
          <div className="text-right leading-tight">
            <div className="text-sm font-bold text-ink">Namaste Prints</div>
            <div className="inline-flex items-center gap-1 text-xs text-body">
              <MapPin className="h-3 w-3" /> New Baneshwor, Kathmandu
            </div>
          </div>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 text-sm font-semibold text-ink hover:bg-page">
            <HelpCircle className="h-4 w-4 text-brand" /> {t.help}
          </button>
          <LangSelect />
        </div>

        {/* Mobile extras */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-success-soft px-2.5 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> {t.online}
          </span>
          <LangSelect />
        </div>
      </div>
    </header>
  );
}
