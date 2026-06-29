import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// ─── Translation strings ───────────────────────────────────────────────────────

export const translations = {
  en: {
    // Brand / nav
    shopOnline: "Shop is Online",
    online: "Online",
    help: "Help",
    backHome: "Back to Home",

    // Step labels
    stepUpload: "Upload",
    stepConfigure: "Configure",
    stepSummary: "Summary",
    stepPayment: "Payment",
    stepPrinting: "Printing",

    // Common buttons
    back: "Back",
    continue: "Continue",
    preview: "Preview",
    edit: "Edit",

    // Upload page
    uploadTitle: "Upload your documents",
    uploadSubtitle: "Upload the files you want to print",
    uploadDrag: "Drag & drop your files here",
    uploadOr: "or",
    uploadChoose: "Choose files",
    uploadFormats: "PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, PNG — Max 50 MB per file",
    uploadedFiles: "Uploaded Files",
    noFiles: "No files uploaded yet",
    uploadTip: "You can upload multiple files. They will all be printed in one order.",
    uploadDrop: "Drop files here",

    // Configure page
    configureTitle: "Configure print settings",
    configureSubtitle: "Choose how you want your documents printed",
    paperSize: "Paper Size",
    colorMode: "Color Mode",
    bw: "Black & White",
    color: "Color",
    orientation: "Orientation",
    portrait: "Portrait",
    landscape: "Landscape",
    copies: "Copies",
    printRange: "Print Range",
    allPages: "All Pages",
    customRange: "Custom Range",
    customRangePlaceholder: "e.g. 1–5, 8, 11–13",
    printType: "Print Type",
    singleSide: "Single Side",
    doubleSide: "Double Side",
    quality: "Quality",
    draft: "Draft",
    standard: "Standard",
    high: "High",
    collate: "Collate",
    collated: "Collated",
    uncollated: "Uncollated",
    bindingMargin: "Binding Margin",
    noMargin: "No Margin",
    small: "Small",
    large: "Large",
    priceBreakdown: "Price breakdown",
    pages: "Pages",
    totalPages: "Total pages",
    pricePerPage: "Price per page",
    subtotal: "Subtotal",
    serviceCharge: "Service Charge",
    secureAutomatic: "Secure & Automatic",
    secureDesc: "After successful payment, your document will be sent to the printer and printed automatically.",
    estimatedTime: "Estimated time",
    min: "2 – 4 min",

    // Summary page
    summaryTitle: "Summary & Payment",
    summarySubtitle: "Review your order before paying",
    orderSummary: "Order Summary",
    viewDetails: "View Details",
    colorModeLabel: "Color Mode",
    printRangeLabel: "Print Range",
    qualityLabel: "Quality",
    collateLabel: "Collate",
    printTypeLabel: "Print Type",
    bindingMarginLabel: "Binding Margin",
    copiesLabel: "Copies",
    totalAmount: "Total Amount",
    filesSecure: "Your files are secure and will be deleted automatically after printing.",
    payment: "Payment",
    paySecurely: "Pay securely via eSewa",
    esewaNepal: "Nepal's #1 digital wallet",
    esewaRecommended: "Recommended",
    esewaDesc: "You'll be redirected to eSewa to complete the payment. Comes right back after.",
    securePayment: "100% Secure Payment",
    securePaymentDesc: "Encrypted and processed by eSewa's secure gateway.",
    payButton: (amount: string) => `Pay NPR ${amount} with eSewa`,
    payingButton: "Redirecting to eSewa…",
    noFilesWarning: "Please upload files before proceeding.",
    termsText: "By continuing you agree to our",
    termsLink: "Terms of Service",
    privacyLink: "Privacy Policy",
    encryptedSafe: "Encrypted & Safe",
    encryptedSafeDesc: "Bank-level encryption protects your docs.",
    autoPrint: "Auto Print",
    autoPrintDesc: "Prints automatically — no shopkeeper needed.",
    liveTracking: "Live Tracking",
    liveTrackingDesc: "Track your order until it's done.",
    digitalReceipt: "Digital Receipt",
    digitalReceiptDesc: "Download your receipt anytime.",

    // Printing page
    printingTitle: "Your documents are printing",
    printingSubtitle: "Sit back and relax while we print your documents.",
    printingDemoNote: "Demo: printing completes automatically in production.",

    // Completed page
    completedTitle: "Printing Completed!",
    completedSubtitle: "Your documents have been printed successfully.",
    collectNote: "You can collect your prints from the counter.",
    completedAt: "Completed at",
    printedBy: "Printed by",
    autoPrintLabel: "Auto Print",
    noShopkeeper: "No shopkeeper interaction",
    securePrivate: "Secure & Private",
    filesDeleted: "Files deleted",
    filesDeletedAuto: "automatically",
    hardDeleteTitle: "Files permanently deleted ✓",
    hardDeleteSubtitle: "Deleting your files…",
    hardDeleteDesc: "Your uploaded documents have been hard-deleted from our servers and cannot be recovered.",
    downloadReceipt: "Download Receipt",
    downloadReceiptSub: "Save or share your receipt",
    printAgain: "Print Again",
    printAgainSub: "Reorder the same document",
    orderHistory: "View Order History",
    orderHistorySub: "See your past orders",
    rateExperience: "Rate Your Experience",
    rateExperienceSub: "Help us serve you better",
    thankYou: "Thank you for choosing PrintCloud 💙",
    tagline: "Fast. Secure. Automatic.",

    // Landing page
    heroTag: "Nepal's Smartest Print Service",
    heroTitle1: "Print Smarter,",
    heroTitle2: "Not Harder.",
    heroDesc: "Upload your documents from anywhere. Pay with eSewa. Get your prints — automatically, no queue, no hassle.",
    heroCta: "Start Printing — It's Free",
    heroSub: "No account needed · Works on mobile & desktop",
    howItWorksTitle: "How it Works",
    howItWorksSubtitle: "Four simple steps to get your documents printed — from anywhere, in minutes.",
    step1Title: "Upload Files",
    step1Desc: "Drop in your PDF, Word, Excel, or images. Up to 50 MB per file. Secure and private.",
    step2Title: "Configure",
    step2Desc: "Choose paper size, color, copies, and quality. See the price update instantly.",
    step3Title: "Pay with eSewa",
    step3Desc: "Pay securely in seconds. No cash needed. Your order goes straight to the printer.",
    step4Title: "Collect Prints",
    step4Desc: "Walk in, pick up your prints. Files are hard-deleted after printing for your privacy.",
    whyTitle: "Why PrintCloud?",
    whySubtitle: "We built what Nepali students, professionals, and businesses actually need.",
    forShopsTitle: "For Print Shops",
    forShopsSubtitle: "Modernize your shop. Accept orders 24/7 without lifting a finger.",
    navHowItWorks: "How it Works",
    navWhy: "Why PrintCloud",
    navForShops: "For Shops",
    navTryNow: "Try Now",
  },

  ne: {
    // Brand / nav
    shopOnline: "पसल अनलाइन छ",
    online: "अनलाइन",
    help: "सहायता",
    backHome: "गृहपृष्ठमा जानुहोस्",

    // Step labels
    stepUpload: "अपलोड",
    stepConfigure: "सेटिङ",
    stepSummary: "सारांश",
    stepPayment: "भुक्तानी",
    stepPrinting: "प्रिन्टिङ",

    // Common buttons
    back: "पछाडि",
    continue: "अगाडि",
    preview: "पूर्वावलोकन",
    edit: "सम्पादन",

    // Upload page
    uploadTitle: "कागजातहरू अपलोड गर्नुहोस्",
    uploadSubtitle: "प्रिन्ट गर्न चाहेका फाइलहरू यहाँ राख्नुहोस्",
    uploadDrag: "फाइलहरू यहाँ तान्नुहोस्",
    uploadOr: "वा",
    uploadChoose: "फाइल छान्नुहोस्",
    uploadFormats: "PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, PNG — अधिकतम ५० MB प्रति फाइल",
    uploadedFiles: "अपलोड गरिएका फाइलहरू",
    noFiles: "अहिलेसम्म कुनै फाइल अपलोड गरिएको छैन",
    uploadTip: "धेरै फाइलहरू अपलोड गर्न सकिन्छ। सबै एउटै अर्डरमा प्रिन्ट हुनेछ।",
    uploadDrop: "यहाँ छोड्नुहोस्",

    // Configure page
    configureTitle: "प्रिन्ट सेटिङ मिलाउनुहोस्",
    configureSubtitle: "कागजात कसरी प्रिन्ट गर्ने भनेर छान्नुहोस्",
    paperSize: "कागजको आकार",
    colorMode: "रङ मोड",
    bw: "कालो र सेतो",
    color: "रङीन",
    orientation: "दिशा",
    portrait: "ठाडो",
    landscape: "तेर्सो",
    copies: "प्रतिलिपि",
    printRange: "प्रिन्ट दायरा",
    allPages: "सबै पृष्ठ",
    customRange: "विशेष दायरा",
    customRangePlaceholder: "जस्तै १–५, ८, ११–१३",
    printType: "प्रिन्ट प्रकार",
    singleSide: "एकतर्फी",
    doubleSide: "दुईतर्फी",
    quality: "गुणस्तर",
    draft: "ड्राफ्ट",
    standard: "सामान्य",
    high: "उच्च",
    collate: "क्रमबद्ध",
    collated: "क्रमबद्ध",
    uncollated: "अक्रमबद्ध",
    bindingMargin: "बाइन्डिङ मार्जिन",
    noMargin: "मार्जिन छैन",
    small: "सानो",
    large: "ठूलो",
    priceBreakdown: "मूल्य विवरण",
    pages: "पृष्ठहरू",
    totalPages: "कुल पृष्ठ",
    pricePerPage: "प्रति पृष्ठ मूल्य",
    subtotal: "उपकुल",
    serviceCharge: "सेवा शुल्क",
    secureAutomatic: "सुरक्षित र स्वचालित",
    secureDesc: "भुक्तानी पछि कागजात प्रिन्टरमा पठाइनेछ र स्वचालित रूपमा प्रिन्ट हुनेछ।",
    estimatedTime: "अनुमानित समय",
    min: "२ – ४ मिनेट",

    // Summary page
    summaryTitle: "सारांश र भुक्तानी",
    summarySubtitle: "भुक्तानी गर्नु अघि अर्डर जाँच गर्नुहोस्",
    orderSummary: "अर्डर सारांश",
    viewDetails: "विवरण हेर्नुहोस्",
    colorModeLabel: "रङ मोड",
    printRangeLabel: "प्रिन्ट दायरा",
    qualityLabel: "गुणस्तर",
    collateLabel: "क्रमबद्ध",
    printTypeLabel: "प्रिन्ट प्रकार",
    bindingMarginLabel: "बाइन्डिङ मार्जिन",
    copiesLabel: "प्रतिलिपि",
    totalAmount: "कुल रकम",
    filesSecure: "तपाईंका फाइलहरू सुरक्षित छन् र प्रिन्ट पछि स्वचालित रूपमा मेटिनेछन्।",
    payment: "भुक्तानी",
    paySecurely: "eSewa मार्फत सुरक्षित भुक्तानी",
    esewaNepal: "नेपालको नम्बर १ डिजिटल वालेट",
    esewaRecommended: "सिफारिस",
    esewaDesc: "भुक्तानी पूरा गर्न eSewa मा पठाइनेछ। भुक्तानी पछि फिर्ता आउनुहोस्।",
    securePayment: "१००% सुरक्षित भुक्तानी",
    securePaymentDesc: "eSewa को सुरक्षित गेटवेद्वारा एन्क्रिप्ट गरिएको।",
    payButton: (amount: string) => `eSewa मार्फत NPR ${amount} तिर्नुहोस्`,
    payingButton: "eSewa मा पठाउँदैछ…",
    noFilesWarning: "अगाडि बढ्नु अघि फाइल अपलोड गर्नुहोस्।",
    termsText: "अगाडि बढ्दा तपाईं हाम्रो",
    termsLink: "सेवा सर्तहरू",
    privacyLink: "गोपनीयता नीति",
    encryptedSafe: "एन्क्रिप्टेड र सुरक्षित",
    encryptedSafeDesc: "बैंक-स्तरको सुरक्षाले तपाईंका कागजातहरू सुरक्षित राख्छ।",
    autoPrint: "स्वचालित प्रिन्ट",
    autoPrintDesc: "स्वचालित रूपमा प्रिन्ट हुन्छ — कुनै सहयोगी चाहिँदैन।",
    liveTracking: "लाइभ ट्र्याकिङ",
    liveTrackingDesc: "अर्डर सम्पन्न नहुँदासम्म ट्र्याक गर्नुहोस्।",
    digitalReceipt: "डिजिटल रसिद",
    digitalReceiptDesc: "जुनसुकै बेला रसिद डाउनलोड गर्नुहोस्।",

    // Printing page
    printingTitle: "तपाईंका कागजातहरू प्रिन्ट हुँदैछन्",
    printingSubtitle: "हामी तपाईंका कागजातहरू प्रिन्ट गर्दैछौं, कृपया प्रतीक्षा गर्नुहोस्।",
    printingDemoNote: "डेमो: उत्पादनमा प्रिन्ट स्वचालित रूपमा सम्पन्न हुन्छ।",

    // Completed page
    completedTitle: "प्रिन्टिङ सम्पन्न!",
    completedSubtitle: "तपाईंका कागजातहरू सफलतापूर्वक प्रिन्ट भयो।",
    collectNote: "काउन्टरबाट आफ्नो प्रिन्टहरू लिन सक्नुहुन्छ।",
    completedAt: "सम्पन्न भयो",
    printedBy: "प्रिन्ट गर्नेले",
    autoPrintLabel: "स्वचालित प्रिन्ट",
    noShopkeeper: "कुनै सहयोगीको संलग्नता छैन",
    securePrivate: "सुरक्षित र निजी",
    filesDeleted: "फाइलहरू मेटिए",
    filesDeletedAuto: "स्वचालित रूपमा",
    hardDeleteTitle: "फाइलहरू स्थायी रूपमा मेटिए ✓",
    hardDeleteSubtitle: "फाइलहरू मेट्दैछ…",
    hardDeleteDesc: "तपाईंका अपलोड गरिएका कागजातहरू हाम्रो सर्भरबाट स्थायी रूपमा मेटिएका छन् र पुनः प्राप्त गर्न सकिँदैन।",
    downloadReceipt: "रसिद डाउनलोड",
    downloadReceiptSub: "रसिद सेभ वा शेयर गर्नुहोस्",
    printAgain: "फेरि प्रिन्ट गर्नुहोस्",
    printAgainSub: "उही कागजात पुनः अर्डर गर्नुहोस्",
    orderHistory: "अर्डर इतिहास हेर्नुहोस्",
    orderHistorySub: "पुराना अर्डरहरू हेर्नुहोस्",
    rateExperience: "अनुभव रेट गर्नुहोस्",
    rateExperienceSub: "हामीलाई राम्रो सेवा दिन मद्दत गर्नुहोस्",
    thankYou: "PrintCloud रोज्नुभएकोमा धन्यवाद 💙",
    tagline: "छिटो। सुरक्षित। स्वचालित।",

    // Landing page
    heroTag: "नेपालको सबैभन्दा स्मार्ट प्रिन्ट सेवा",
    heroTitle1: "स्मार्ट तरिकाले प्रिन्ट गर्नुहोस्,",
    heroTitle2: "झन्झट बिना।",
    heroDesc: "जहाँबाट पनि कागजात अपलोड गर्नुहोस्। eSewa बाट भुक्तानी गर्नुहोस्। प्रिन्ट पाउनुहोस् — स्वचालित, लाइन छैन, झन्झट छैन।",
    heroCta: "प्रिन्टिङ सुरु गर्नुहोस् — निःशुल्क",
    heroSub: "खाता चाहिँदैन · मोबाइल र डेस्कटपमा काम गर्छ",
    howItWorksTitle: "कसरी काम गर्छ",
    howItWorksSubtitle: "चार सजिला चरणमा कागजात प्रिन्ट गर्नुहोस् — जहाँबाट पनि, मिनेटमा।",
    step1Title: "फाइल अपलोड गर्नुहोस्",
    step1Desc: "PDF, Word, Excel वा तस्वीर राख्नुहोस्। प्रति फाइल ५० MB सम्म। सुरक्षित र निजी।",
    step2Title: "सेटिङ मिलाउनुहोस्",
    step2Desc: "कागजको आकार, रङ, प्रतिलिपि र गुणस्तर छान्नुहोस्। मूल्य तुरुन्तै अपडेट हुन्छ।",
    step3Title: "eSewa बाट भुक्तानी",
    step3Desc: "सेकेन्डमा सुरक्षित भुक्तानी। नगद चाहिँदैन। अर्डर सिधै प्रिन्टरमा जान्छ।",
    step4Title: "प्रिन्ट लिनुहोस्",
    step4Desc: "आएर आफ्नो प्रिन्ट लिनुहोस्। तपाईंको गोपनीयताका लागि प्रिन्ट पछि फाइलहरू मेटिन्छन्।",
    whyTitle: "किन PrintCloud?",
    whySubtitle: "नेपाली विद्यार्थी, पेशेवर र व्यवसायहरूलाई वास्तवमा चाहिने कुरा हामीले बनाएका छौं।",
    forShopsTitle: "प्रिन्ट पसलका लागि",
    forShopsSubtitle: "आफ्नो पसल आधुनिक बनाउनुहोस्। २४/७ अर्डर स्वीकार गर्नुहोस्।",
    navHowItWorks: "कसरी काम गर्छ",
    navWhy: "किन PrintCloud",
    navForShops: "पसलका लागि",
    navTryNow: "अहिले प्रयास गर्नुहोस्",
  },
} as const;

export type Lang = keyof typeof translations;
export type T = typeof translations.en;

// ─── Context ───────────────────────────────────────────────────────────────────

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  // Start with "en" — safe for SSR. useEffect runs only on client and restores saved preference.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("pc_lang");
      if (stored === "ne") setLangState("ne");
    } catch { /* no localStorage in this environment */ }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try { window.localStorage.setItem("pc_lang", l); } catch {}
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
