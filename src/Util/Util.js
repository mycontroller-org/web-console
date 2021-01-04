import { v4 as uuidv4 } from "uuid"
import clone from "lodash.clonedeep"

export const toString = (data) => {
  return JSON.stringify(data)
}

export const getRandomId = () => {
  return uuidv4()
}

export const cloneDeep = (obj) => clone(obj)

export const noop = () => { }

