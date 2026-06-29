## Goal

Recreate the PrintCloud reference screens (landing + 5-step flow: Upload → Configure → Summary/Payment → Printing → Completed) as a polished, responsive PWA. Match spacing, type, color, hierarchy, and layout proportions in the mockups exactly. UI-only first pass — mock data, no backend yet.

## Stack notes

The project is on **TanStack Start + Vite + React 19 + TS + Tailwind v4 + shadcn/ui** (not Next.js). I will use this stack with the same DX you described: shadcn components, Framer Motion for animation, Lucide icons, React Hook Form where forms appear. No backend / Stripe / Lovable Cloud wiring in this pass — happy to layer those after the UI is approved.

## Design system (derived from references)

Tokens added to `src/styles.css` (`@theme` + `:root`):

- **Brand**: primary blue `#2563EB` (CTA), primary-deep `#1D4ED8`, primary-soft `#EFF4FF` (chip/pill bg)
- **Surfaces**: page `#F7F9FC` (very light blue-gray), card `#FFFFFF`, subtle border `#E6EAF2`
- **Text**: heading `#0B1220`, body `#475569`, muted `#94A3B8`
- **Status**: success `#16A34A` + soft `#E8F7EE`, warning amber, danger
- **Accents per "How it works" tiles**: blue / indigo / green / orange soft tints
- **Radius**: `--radius: 14px` (cards), `10px` (buttons/inputs), `999px` (pills)
- **Shadows**: `--shadow-card: 0 1px 2px rgba(15,23,42,.04), 0 8px 24px -12px rgba(15,23,42,.08)`; `--shadow-cta` for primary buttons
- **Typography**: Plus Jakarta Sans (display + body) via `<link>` in `__root.tsx` head — closest match to references. Weights 400/500/600/700/800.
- **Spacing**: 8px scale (Tailwind defaults)

## Routes (file-based)

```
src/routes/
  __root.tsx              (head: fonts, manifest, theme-color, og defaults)
  index.tsx               Landing page
  flow.tsx                Layout: shared shell (header + left stepper + right rail) with <Outlet />
  flow.upload.tsx         Step 1
  flow.configure.tsx      Step 2
  flow.summary.tsx        Step 3 (Summary & Payment)
  flow.printing.tsx       Step 4 (Order in progress)
  flow.completed.tsx      Step 5 (Done)
```

Flow state (uploaded files mock, settings, totals) lives in a `FlowContext` provider mounted in `flow.tsx` so steps share data without a backend.

## Component inventory (`src/components/printcloud/`)

Reusable, typed, prop-driven:

- `BrandLogo`, `TopNav` (landing), `FlowHeader` (in-flow header w/ Back, Shop status, Help, lang dropdown)
- `Stepper` desktop (vertical, numbered, check states) + `StepperMobile` (horizontal icon row)
- `FeatureChip`, `FeaturePill` (the No-WhatsApp / Auto Print / Secure / eSewa row)
- `HowItWorksCard` (numbered tile with tinted icon)
- `UploadDropzone`, `UploadedFileRow` (PDF/DOCX icon, size, pages, preview, delete)
- `SettingToggleGroup` (segmented A4/A3/Letter/Legal, B&W/Color, etc.)
- `CounterInput` (copies − / value / +)
- `PriceBreakdown`, `SecureNoteCard`
- `OrderSummaryCard`, `PaymentMethodList` (eSewa/Khalti/IME/Fonepay/Other)
- `StatusTimeline` (horizontal pill row with connecting line, animated progress)
- `StatusListMobile` (rows w/ time stamps)
- `NotifyBanner`, `FeedbackEmojiRow`, `WhatsNextList`
- `ShopCard` (sidebar shop info), `TrustList` (Secure/Auto Print/eSewa/Support)
- `SslFooterBadge`
- Primitives wrapped on shadcn: `Button` (default/secondary/ghost/cta-blue), `Card`, `Badge`, `Input`, `Select`, `Dialog`, `Toast` (sonner)

## Responsive strategy

Breakpoints in CSS: 360 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440.

- **Landing**: 2-col hero on ≥1024; phone mockup stacks below copy on tablet; mobile stacks copy → feature chips (2-col grid) → CTAs → trust row → phone preview. Use a polished SVG/CSS phone frame for the hero illustration (no image gen — pure CSS so it stays crisp at any size) showing a miniature "Upload Document" card.
- **Flow**: ≥1024 three-column (`280px | 1fr | 320px`); 768 collapses right rail under main, stepper stays left; <768 left stepper becomes top horizontal `StepperMobile`, sticky bottom CTA bar with the primary button.
- All flex/grid rows containing text + widget follow the `grid-cols-[minmax(0,1fr)_auto]` + `min-w-0` + `shrink-0` rule from the responsive guide.

## Animations (Framer Motion)

Restrained, premium feel — not every element animates.

- Route transitions: 200ms fade + 6px Y on `<Outlet />` via `AnimatePresence` in `flow.tsx`
- Stepper check fills with scale-in + color tween on advance
- Upload dropzone: border pulse on dragover; uploaded rows slide-in
- Status timeline: progress line draws (`pathLength`), printer icon gentle float
- Completed screen: confetti burst (lightweight CSS particles, no heavy lib) + scale-in check badge
- Buttons: subtle `whileTap` scale 0.98; hover shadow lift
- Skeletons for any async-feeling areas (file rows on first paint)

## Other

- PWA: manifest-only (installable, theme color, icons). No service worker this pass per the PWA skill default.
- SEO: per-route `head()` with title, description, og:title/description. og:image only added later when we have a real share asset.
- Accessibility: focus rings on all interactives, semantic landmarks, ARIA for stepper (`aria-current="step"`), color contrast verified against tokens.
- Dark mode ready: tokens defined in `.dark` block but not toggled in UI yet (references are light-only).

## Out of scope (this pass — flag for follow-up)

- Real file upload + storage (Lovable Cloud)
- Real payment integration (Stripe / eSewa / Khalti)
- Auth / Login / Try Demo flows
- Order history, shop directory, ratings backend
- PWA offline / service worker
- Real QR scanner

Tell me if you want any of the out-of-scope items pulled into this build, or if the typography pick (Plus Jakarta Sans) should be something else — otherwise I'll proceed exactly as above.