import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";
import it from "./locales/it.json";

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  ar: { translation: ar }, // Darija marocain
  es: { translation: es },
  pt: { translation: pt },
  it: { translation: it },
};

const getDirForLanguage = (languageCode) =>
  LANGUAGES.find((l) => l.code === languageCode)?.dir || "ltr";

const syncHtmlLangDir = (languageCode) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = languageCode;
  document.documentElement.dir = getDirForLanguage(languageCode);
};

i18n
  .use(LanguageDetector) // Détecte la langue du navigateur
  .use(initReactI18next) // Passe i18n à react-i18next
  .init({
    resources,
    fallbackLng: "fr", // Langue par défaut
    debug: false,
    interpolation: {
      escapeValue: false, // React échappe déjà
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
  })
  .then(() => {
    syncHtmlLangDir(i18n.resolvedLanguage || i18n.language || "fr");
    i18n.on("languageChanged", (lng) => syncHtmlLangDir(lng));
  });

export default i18n;

export const LANGUAGES = [
  { code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "en", name: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", name: "دارجة مغربية", flag: "🇲🇦", dir: "rtl" },
  { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "pt", name: "Português", flag: "🇵🇹", dir: "ltr" },
  { code: "it", name: "Italiano", flag: "🇮🇹", dir: "ltr" },
];
