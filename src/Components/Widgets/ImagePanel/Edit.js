import { DataType, FieldType } from "../../../Constants/Form"
import objectPath from "object-path"
import { api } from "../../../Service/Api"
import { getQuickId, ResourceType } from "../../../Constants/ResourcePicker"
import {
  ImageRotationTypeOptions,
  ImageSourceType,
  ImageSourceTypeOptions,
} from "../../../Constants/Widgets/ImagePanel"
import { RefreshIntervalTypeOptions } from "../../../Constants/Metric"

// Image Panel items
export const updateFormItemsImagePanel = (rootObject, items = []) => {
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
      // resetFields: { "config.fieldIds": {}, "config.rgbComponent": "" },
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
    case ImageSourceType.CameraSimple:
      const simpleCameraItems = getSimpleCameraItems(rootObject)
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

const getSimpleCameraItems = (_rootObject) => {
  const items = [
    {
      label: "Image Field",
      fieldId: "config.fields.image",
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
  ]
  return items
}

const getURLItems = (_rootObject) => {
  const items = [
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
  ]
  return items
}

const getDiskItems = (_rootObject) => {
  const items = [
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
  ]
  return items
}

// helper functions

const getFiltersFunc = (value) => {
  return [{ k: "name", o: "regex", v: value }]
}

const getOptionsDescriptionFuncImpl = (item) => {
  return item.name
}

const getResourceOptionValueFunc = (item) => {
  return getQuickId(ResourceType.Field, item)
}
