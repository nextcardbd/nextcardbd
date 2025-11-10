/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // 1. Loads translations from /public/locales/[lng]/translation.json
  .use(HttpApi)
  // 2. Detects user language from browser/localStorage
  .use(LanguageDetector)
  // 3. Passes i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    /*
      Supported Languages
      'en': English
      'bn': Bangla
    */
    supportedLngs: ['en', 'bn'],

    // Default language
    fallbackLng: 'en',

    // --- Configuration ---
    debug: process.env.NODE_ENV === 'development', // Show logs in console during development

    // Config for LanguageDetector
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },

    // Config for HttpApi backend
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    react: {
      useSuspense: true, // Use React Suspense for loading translations
    },
  });

export default i18n;