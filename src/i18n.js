// src/i18n.js

// ✅ All imports must be at the top
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// ✅ Initialize i18next
i18n
  .use(Backend) // Load translations from /locales/{{lng}}/{{ns}}.json
  .use(LanguageDetector) // Detect language from localStorage, cookies, etc.
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    // ✅ Fallback language if detection fails
    fallbackLng: 'fr',

    // ✅ Explicitly supported languages
    supportedLngs: ['fr', 'ht'],

    // ✅ Handle region codes (fr-FR → fr, ht-HT → ht)
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    lowerCaseLng: true,

    // ✅ Detection order
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng', // key in localStorage
      lookupCookie: 'i18nextLng',       // key in cookies
    },

    // ✅ Translation file path
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // ✅ Default namespace
    defaultNS: 'common',

    // ✅ All namespaces
    ns: [
      'common', 'home', 'contact', 'about', 'procedures', 
      'actualites', 'archives', 'decisions', 'galerie', 
      'chantiers', 'rapports', 'sidebar'
    ],

    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;