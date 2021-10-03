import { DataType, FieldType } from "../../../Constants/Form"
import objectPath from "object-path"
import { api } from "../../../Service/Api"
import { getQuickId, ResourceType } from "../../../Constants/ResourcePicker"
import {
  ImageRotationType,
  ImageRotationTypeOptions,
  ImageSourceType,
  ImageSourceTypeOptions,
  ImageType,
  ImageTypeOptions,
} from "../../../Constants/Widgets/ImagePanel"
import { RefreshIntervalType, RefreshIntervalTypeOptions } from "../../../Constants/Metric"
import { getDynamicFilter } from "../../../Util/Filter"

// Image Panel items
export const updateFormItemsImagePanel = (rootObject, items = []) => {
  objectPath.set(rootObject, "config.rotation", ImageRotationType.Rotate_0, true)
  items.push(
    {
      label: "Image Source",
      fieldId: "!source_type",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "config.sourceType",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: ImageSourceTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
      resetFields: { "config.field": {} },
    },
    {
      label: "Rotation",
      fieldId: "config.rotation",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: ImageRotationTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    }
  )

  const imageSourceType = objectPath.get(rootObject, "config.sourceType", "")

  switch (imageSourceType) {
    case ImageSourceType.Field:
      const simpleCameraItems = getFieldItems(rootObject)
      items.push(...simpleCameraItems)
      break

    case ImageSourceType.URL:
      const urlItems = getURLItems(rootObject)
      items.push(...urlItems)
      break

    case ImageSourceType.Disk:
      const diskItems = getDiskItems(rootObject)
      items.push(...diskItems)
      break

    default:
    // noop
  }
}

const getFieldItems = (rootObject) => {
  const items = [
    {
      label: "Field",
      fieldId: "config.field.id",
      fieldType: FieldType.SelectTypeAheadAsync,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
      apiOptions: api.field.list,
      getFiltersFunc: getFiltersFunc,
      optionValueFunc: getResourceOptionValueFunc,
      getOptionsDescriptionFunc: getOptionsDescriptionFuncImpl,
    },
    {
      label: "Image Type",
      fieldId: "config.field.type",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: ImageTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
      resetFields: { "config.field.custom_mapping": {} },
    },
    {
      label: "Show Timestamp",
      fieldId: "config.field.showTimestamp",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
  ]

  const fieldType = objectPath.get(rootObject, "config.field.type", "")

  if (fieldType === ImageType.CustomMapping) {
    items.push(
      {
        label: "Custom Mapping",
        fieldId: "!custom_mapping",
        fieldType: FieldType.Divider,
      },
      {
        label: "",
        fieldId: "config.field.custom_mapping",
        fieldType: FieldType.KeyValueMap,
        dataType: DataType.ArrayObject,
        value: "",
        keyLabel: "Value",
        valueLabel: "Image Location",
      }
    )
  }
  return items
}

const getURLItems = (rootObject) => {
  objectPath.set(rootObject, "config.refreshInterval", RefreshIntervalType.None, true)
  const items = [
    {
      label: "Refresh Interval",
      fieldId: "config.refreshInterval",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.Integer,
      value: "",
      options: RefreshIntervalTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "URL",
      fieldId: "config.imageURL",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid url.",
      validated: "default",
      validator: { isURL: {}, isNotEmpty: {} },
    },
  ]
  return items
}

const getDiskItems = (rootObject) => {
  objectPath.set(rootObject, "config.refreshInterval", RefreshIntervalType.None, true)
  const items = [
    {
      label: "Refresh Interval",
      fieldId: "config.refreshInterval",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.Integer,
      value: "",
      options: RefreshIntervalTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Location",
      fieldId: "config.imageLocation",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid location.",
      validated: "default",
      validator: { isNotEmpty: {} },
    },
  ]
  return items
}

// helper functions

const getFiltersFunc = (value) => {
  return getDynamicFilter("name", value, [])
}

const getOptionsDescriptionFuncImpl = (item) => {
  return item.name
}

const getResourceOptionValueFunc = (item) => {
  return getQuickId(ResourceType.Field, item)
}
