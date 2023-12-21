import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n

  // Enables the i18next backend
  .use(Backend)

  // Enable automatic language detection
  //   .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    lng: 'ru',
    backend: {
      /* translation file path */
      loadPath: `${process.env.NEXT_PUBLIC_DOMAIN}/translate/{{lng}}/`
    },
    fallbackLng: 'ru',
    debug: false,
    keySeparator: false,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  })

export default i18n
