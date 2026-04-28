import { useEffect, useState } from "react";

const detectLanguageByCountry = (country?: string) => {
  switch (country) {
    case "IL":
      return "he";
    case "US":
      return "en";
    case "ES":
      return "es";
    case "FR":
      return "fr";
    case "SA":
    case "AE":
      return "ar";
    default:
      return "en";
  }
};

export function useLanguageSystem(userCountry?: string) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("app_language") || "AUTO"
  );

  const resolvedLanguage =
    language === "AUTO" ? detectLanguageByCountry(userCountry) : language.toLowerCase();

  useEffect(() => {
    const isRTL = resolvedLanguage === "he" || resolvedLanguage === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = resolvedLanguage;
    localStorage.setItem("app_language", language);
  }, [language, resolvedLanguage]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  return {
    language,
    resolvedLanguage,
    changeLanguage,
    isRTL: resolvedLanguage === "he" || resolvedLanguage === "ar",
  };
}
