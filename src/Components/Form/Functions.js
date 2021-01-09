import objectPath from "object-path"
import { DataType, FieldType } from "./Constants"
import v from "validator"

export const updateRootObject = (rootObject, item, data) => {
  const value = getValue(item, data)
  objectPath.set(rootObject, item.fieldId, value, false)
}

const getValue = (item, data) => {
  switch (item.dataType) {
    case DataType.String:
      return String(data)
    case DataType.Boolean:
      return Boolean(data)
    case DataType.Number:
      return Number(data)
    case DataType.Integer:
      return v.toInt(data)
    case DataType.Float:
      return v.toFloat(data)
    case DataType.ArrayString:
      return data.map((d) => {
        String(d)
      })
    case DataType.ArrayNumber:
      return data.map((d) => {
        Number(d)
      })
    case DataType.ArrayBoolean:
      return data.map((d) => {
        Boolean(d)
      })
    case DataType.ArrayObject:
      return data
    default:
      return data
  }
}

export const updateItems = (rootObject, items) => {
  items.forEach((item) => {
    switch (item.fieldType) {
      case FieldType.Labels:
        item.value = objectPath.get(rootObject, item.fieldId, {})
        break

      case FieldType.Switch:
      case FieldType.Checkbox:
        item.value = objectPath.get(rootObject, item.fieldId, false)
        break

      // case FieldType.Select:
      // case FieldType.SelectTypeAhead:
      //   item.value = String(objectPath.get(rootObject, item.fieldId, ""))
      //   if (item.isRequired && item.value === "" && item.options.length === 1) {
      //     item.value = item.options[0].value
      //   }
      //   break

      default:
        item.value = String(objectPath.get(rootObject, item.fieldId, ""))
    }
  })
}
