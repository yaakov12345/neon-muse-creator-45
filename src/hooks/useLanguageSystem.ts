import { useState, useEffect } from "react";

export type Language = "he" | "en" | "es" | "fr" | "ar" | "de" | "pt" | "ru" | "ja" | "zh";

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
  rtl: boolean;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸", rtl: false },
  { code: "he", label: "Hebrew", nativeLabel: "עברית", flag: "🇮🇱", rtl: true },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦", rtl: true },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸", rtl: false },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷", rtl: false },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪", rtl: false },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇧🇷", rtl: false },
  { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "🇷🇺", rtl: false },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵", rtl: false },
  { code: "zh", label: "Chinese", nativeLabel: "中文", flag: "🇨🇳", rtl: false },
];

function detectLanguageFromBrowser(): Language {
  const saved = localStorage.getItem("viralyx_language") as Language | null;
  if (saved && LANGUAGES.find((l) => l.code === saved)) return saved;

  const nav = navigator.language || (navigator as any).userLanguage || "en";
  const primary = nav.split("-")[0].toLowerCase();
  const countryCode = nav.split("-")[1]?.toUpperCase();

  const langMap: Record<string, Language> = {
    he: "he", iw: "he", ar: "ar", es: "es", fr: "fr",
    de: "de", pt: "pt", ru: "ru", ja: "ja", zh: "zh", en: "en",
  };

  const countryMap: Record<string, Language> = {
    IL: "he", SA: "ar", AE: "ar", EG: "ar", MA: "ar",
    MX: "es", AR: "es", CO: "es", CL: "es",
    FR: "fr", BE: "fr", CH: "fr",
    DE: "de", AT: "de",
    BR: "pt", PT: "pt",
    RU: "ru", JP: "ja",
    CN: "zh", TW: "zh", HK: "zh",
  };

  if (countryCode && countryMap[countryCode]) return countryMap[countryCode];
  if (langMap[primary]) return langMap[primary];

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes("Jerusalem") || tz.includes("Tel_Aviv")) return "he";
    if (tz.includes("Riyadh") || tz.includes("Dubai") || tz.includes("Cairo")) return "ar";
    if (tz.includes("Paris") || tz.includes("Lyon")) return "fr";
    if (tz.includes("Berlin") || tz.includes("Vienna")) return "de";
    if (tz.includes("Sao_Paulo") || tz.includes("Lisbon")) return "pt";
    if (tz.includes("Moscow")) return "ru";
    if (tz.includes("Tokyo")) return "ja";
    if (tz.includes("Shanghai") || tz.includes("Beijing")) return "zh";
    if (
      tz.startsWith("America/") &&
      !["America/New_York","America/Chicago","America/Denver","America/Los_Angeles",
        "America/Anchorage","America/Honolulu","America/Toronto","America/Vancouver"].includes(tz)
    ) return "es";
  } catch {}

  return "en";
}

export function useLanguageSystem() {
  const [language, setLanguage] = useState<Language>(() => detectLanguageFromBrowser());

  const langOption = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];
  const isRTL = langOption.rtl;

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  function changeLanguage(lang: Language) {
    setLanguage(lang);
    localStorage.setItem("viralyx_language", lang);
  }

  return {
    language,
    resolvedLanguage: language,
    changeLanguage,
    isRTL,
    langOption,
    allLanguages: LANGUAGES,
  };
}
