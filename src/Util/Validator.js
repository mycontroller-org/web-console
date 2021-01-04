import v from "validator"
import { t } from "typy"
import { isDate } from "moment"

export const isInDefaultValue = (item) => {
  switch (item.type) {
    case "text":
    case "password":
    case "textarea":
    case "neccRate":
    case "toolbar-select":
      return item.value === ""
    case "ahead-select":
      return item.value.length !== 0
    default:
      return true
  }
}

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

export const validate = (func, val, opts) => {
  switch (func) {
    case "isEmail":
      return v.isEmail(val, opts)
    case "isInt":
      return v.isInt(val, opts)
    case "isDecimal":
      return v.isDecimal(val, opts)
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
    default:
      return true
  }
}

export const validateItem = (item) => {
  const list = item.validator
  for (let index = 0; index < list.length; index++) {
    const valid = list[index]
    const func = Object.keys(valid)[0]
    if (!validate(func, item.value, valid[func])) {
      return false
    }
  }
  return true
}
