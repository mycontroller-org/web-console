import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import YAML from "js-yaml"
import backend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import { reduxLanguageDetector } from "./languageDetector"

const languageDetector = new LanguageDetector()
languageDetector.addDetector(reduxLanguageDetector)

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(languageDetector)
  .use(backend)
  .init({
    ns: "translation",
    fallbackLng: "en_GB",
    // lng: "en_GB",
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
