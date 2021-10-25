import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import YAML from "js-yaml"
import Backend from "i18next-http-backend"

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(Backend)
  .init({
    ns: "translation",
    fallbackLng: "en_GB",
    lng: "en_GB",
    // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.yaml",
      parse: function (data) {
        return YAML.load(data)
      },
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n

// flags unicode, https://emojipedia.org/flags/
export const languageList = [
  {
    lng: "en_GB",
    country_code: "UK",
    title: "English",
    flag: "🇬🇧",
  },
  {
    lng: "en_US",
    country_code: "US",
    title: "English",
    flag: "🇺🇸",
  },
  {
    lng: "de_DE",
    country_code: "DE",
    title: "Deutsch",
    flag: "🇩🇪",
  },
  {
    lng: "es_ES",
    country_code: "ES",
    title: "Español",
    flag: "🇪🇸",
  },
  {
    lng: "fr_FR",
    country_code: "FR",
    title: "Français",
    flag: "🇫🇷",
  },
  {
    lng: "he_IL",
    country_code: "IL",
    title: "עִברִית",
    flag: "🇮🇱",
  },
  {
    lng: "it_IT",
    country_code: "IT",
    title: "italiano",
    flag: "🇮🇹",
  },
  {
    lng: "nl_NL",
    country_code: "NL",
    title: "Nederlands",
    flag: "🇳🇱",
  },
  {
    lng: "pl_PL",
    country_code: "PL",
    title: "język polski",
    flag: "🇵🇱",
  },
  {
    lng: "pt_PT",
    country_code: "PT",
    title: "Português",
    flag: "🇵🇹",
  },
  {
    lng: "ro_RO",
    country_code: "RO",
    title: "Română",
    flag: "🇷🇴",
  },
  {
    lng: "ru_RU",
    country_code: "RU",
    title: "Русский",
    flag: "🇷🇺",
  },
  {
    lng: "ta_IN",
    country_code: "IN",
    title: "தமிழ்",
    flag: "🇮🇳",
  },
  {
    lng: "zh_CN",
    country_code: "CN",
    title: "中文",
    flag: "🇨🇳",
  },
  {
    lng: "zh_TW",
    country_code: "TW",
    title: "中華民國國語",
    flag: "🇹🇼",
  },
]
