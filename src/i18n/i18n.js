import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      about: "About",
    },
  },
  fr: {
    translation: {
      dashboard: "tableau de bord",
    },
  },
  ta: {
    translation: {
      dashboard: "டாஷ்போர்டு",
      about: "என்னை பற்றி",
      forum: "மன்றம்",
      settings: "அமைப்புகள்",
      source_code: "மூல குறியீடு",
      documentation: "ஆவணங்கள்",
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "ta", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n

// flags unicode, https://emojipedia.org/flags/
export const languageList = [
  {
    lng: "en_gb",
    country_code: "UK",
    title: "English",
    flag: "🇬🇧",
  },
  {
    lng: "en_us",
    country_code: "US",
    title: "English",
    flag: "🇺🇸",
  },
  {
    lng: "de_de",
    country_code: "DE",
    title: "Deutsch",
    flag: "🇩🇪",
  },
  {
    lng: "es_es",
    country_code: "ES",
    title: "Español",
    flag: "🇪🇸",
  },
  {
    lng: "fr_fr",
    country_code: "FR",
    title: "Français",
    flag: "🇫🇷",
  },
  {
    lng: "he_il",
    country_code: "IL",
    title: "עִברִית",
    flag: "🇮🇱",
  },
  {
    lng: "it_it",
    country_code: "IT",
    title: "italiano",
    flag: "🇮🇹",
  },
  {
    lng: "nl_nl",
    country_code: "NL",
    title: "Nederlands",
    flag: "🇳🇱",
  },
  {
    lng: "pl_pl",
    country_code: "PL",
    title: "język polski",
    flag: "🇵🇱",
  },
  {
    lng: "pt_pt",
    country_code: "PT",
    title: "Português",
    flag: "🇵🇹",
  },
  {
    lng: "ro_ro",
    country_code: "RO",
    title: "Română",
    flag: "🇷🇴",
  },
  {
    lng: "ru_ru",
    country_code: "RU",
    title: "Русский",
    flag: "🇷🇺",
  },
  {
    lng: "ta_in",
    country_code: "IN",
    title: "தமிழ்",
    flag: "🇮🇳",
  },
  {
    lng: "zh_cn",
    country_code: "CN",
    title: "中文",
    flag: "🇨🇳",
  },
  {
    lng: "zh_tw",
    country_code: "TW",
    title: "中華民國國語",
    flag: "🇹🇼",
  },
]
