import v from "validator"
import { t } from "typy"
import { isDate } from "moment"

const isLengthDualList = (val, opts) => {
  if (t(opts, "min").isNumber && val.right.length < opts.min) {
    return false
  }
  if (t(opts, "max").isNumber && val.right.length > opts.max) {
    return false
  }
  return true
}

const isLengthArray = (val, opts) => {
  if (t(val).isArray) {
    if (t(opts, "min").isNumber && val.length < opts.min) {
      return false
    }
    if (t(opts, "max").isNumber && val.length > opts.max) {
      return false
    }
    return true
  }
  return false
}

const baudRates = [
  50,
  75,
  110,
  134,
  150,
  200,
  300,
  600,
  1200,
  1800,
  2400,
  4800,
  9600,
  19200,
  38400,
  57600,
  115200,
  230400,
  460800,
  500000,
  576000,
  921600,
  1000000,
  1152000,
  1500000,
  2000000,
  2500000,
  3000000,
  3500000,
  4000000,
]

const isBaudRate = (val) => {
  const value = v.toInt(val)
  return baudRates.includes(value)
}

const isLabelKey = (val) => {
  const regexIsLabelKey = /^[a-z0-9_/-]+$/
  return regexIsLabelKey.test(val)
}

export const validate = (func, val, opts) => {
  switch (func) {
    case "isEmail":
      return v.isEmail(val, opts)

    case "isInt":
      return v.isInt(val, opts)

    case "isDecimal":
      return v.isDecimal(val, opts)

    case "isFloat":
      return v.isFloat(val, opts)

    case "isCurrency":
      if (parseFloat(val) === 0.0) {
        // workaround for currency should not be zero
        return false
      }
      return v.isCurrency(val, opts)

    case "isEmpty":
      return v.isEmpty(val, opts)

    case "isNotEmpty":
      return !v.isEmpty(val, opts)

    case "isAlphanumeric":
      return v.isAlphanumeric(val)

    case "isLength":
      return v.isLength(val, opts)

    case "isLengthDualList":
      return isLengthDualList(val, opts)

    case "isObject":
      return t(val).isObject

    case "isDate":
      return isDate(val)

    case "isLengthArray":
      return isLengthArray(val, opts)

    case "isURL":
      return v.isURL(val, opts)

    case "isBaudRate":
      return isBaudRate(val)

    case "isLabel":
      if (val === undefined || val === null) {
        return false
      }
      const keys = Object.keys(val)
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index]
        const isValid = isLabelKey(key)
        if (!isValid) {
          return false
        }
        // if (val[key] === ""){
        //   return false
        // }
      }
      return true

    case "isID":
      const regexIsID = /^[a-zA-Z0-9_-]+$/
      return regexIsID.test(val)

    case "isLabelKey":
      return isLabelKey(val)

    case "isKey":
      const regexIsKey = /^[a-zA-Z0-9\._\/-]+$/
      return regexIsKey.test(val)

    case "isVersion":
      const regexIsVersion = /^[a-z0-9\._-]+$/
      return regexIsVersion.test(val)

    default:
      return true
  }
}

export const validateItem = (item, value) => {
  if (!item.validator) {
    return true
  }
  const funcs = Object.keys(item.validator)
  for (let index = 0; index < funcs.length; index++) {
    const func = funcs[index]
    if (!validate(func, value, item.validator[func])) {
      return false
    }
  }
  return true
}
