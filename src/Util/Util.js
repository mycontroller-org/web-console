import { v4 as uuidv4 } from "uuid"
import clone from "lodash.clonedeep"
import objectPath from "object-path"

export const toString = (data) => {
  return JSON.stringify(data)
}

export const getRandomId = (length = 0) => {
  const randomId = uuidv4()
  if (length !== 0 && randomId.length > length) {
    return randomId.substr(randomId.length - length)
  }
  return randomId
}

export const cloneDeep = (obj) => clone(obj)

export const noop = () => {}

export const getValue = (obj, fieldKey, defaultValue = "") => objectPath.get(obj, fieldKey, defaultValue)

export const splitWithTail = (str = "", separator, limit) => {
  const parts = str.split(separator)
  const tail = parts.slice(limit).join(separator)
  const result = parts.slice(0, limit)
  if (tail.length > 0) {
    result.push(tail)
  }
  return result
}

export const getItem = (value, options, defaultIndex = 0, key = "value") => {
  for (let index = 0; index < options.length; index++) {
    const item = options[index]
    if (value === item[key]) {
      return item
    }
  }
  if (defaultIndex >= 0 && defaultIndex < options.length) {
    return options[defaultIndex]
  }
  return null
}

export const capitalizeFirstLetter = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const getPercentage = (value, minimum = 0, maximum = 100, inRange = true) => {
  const result = ((value - minimum) * 100) / (maximum - minimum)
  if (inRange && result < 0) {
    return 0
  } else if (inRange && result > 100) {
    return 100
  }
  return result
}

export const getFieldValue = (value) => {
  const stringValue = String(value)
  if (stringValue.startsWith("data:image")) {
    return "CAMERA IMAGE"
  }
  return stringValue
}
