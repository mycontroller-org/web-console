import YAML from "js-yaml"

export const toString = (language = "", data = {}) => {
  if (data === undefined || data === "") {
    return ""
  }
  switch (language) {
    case "yaml":
    case "json":
      if (data === undefined || data === "" || Object.keys(data).length === 0) {
        return ""
      }
      if (language === "yaml") {
        return YAML.dump(data)
      } else if (language === "json") {
        return JSON.stringify(data)
      }

    case "javascript":
      return data

    default:
      return Object.toString(data)
  }
}

export const toObject = (language = "", data = "") => {
  switch (language) {
    case "yaml":
    case "json":
      if (data === undefined || data === "") {
        return {}
      }
      if (language === "yaml") {
        return YAML.load(data)
      } else if (language === "json") {
        return JSON.parse(data)
      }

    case "javascript":
      return data

    default:
      return { error: "language '" + language + "' not supported" }
  }
}
