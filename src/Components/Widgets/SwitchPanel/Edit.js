import objectPath from "object-path"
import { DataType, FieldType } from "../../../Constants/Form"
import { ResourceType, ResourceTypeOptions } from "../../../Constants/ResourcePicker"

// Switch Panel items
export const updateFormItemsSwitchPanel = (rootObject, items) => {
  // add default filter at first time
  objectPath.set(rootObject, "config.resourceType", ResourceType.SensorField, true)
  const resourceType = objectPath.get(rootObject, "config.resourceType", ResourceType.SensorField)
  if (resourceType === ResourceType.SensorField) {
    const selectors = objectPath.get(rootObject, "config.resourceSelectors", undefined)
    if (selectors === undefined) {
      objectPath.set(rootObject, "config.resourceSelectors", { metricType: "binary" }, false)
    }
  }

  items.push(
    {
      label: "Limit",
      fieldId: "config.itemsLimit",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Items limit.",
      validated: "default",
      validator: { isInteger: {} },
    },
    {
      label: "Name Key",
      fieldId: "config.resourceNameKey",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Name Key. chars: min=1 and max=100",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Resource Type",
      fieldId: "config.resourceType",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: false,
      helperText: "",
      helperTextInvalid: "Invalid type",
      validated: "default",
      options: ResourceTypeOptions.filter((r) => r.value !== ResourceType.Sensor),
      validator: { isNotEmpty: {} },
      resetFields: { "config.resourceSelectors": {} },
    },
    {
      label: "Selectors",
      fieldId: "!selectors",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "config.resourceSelectors",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.Object,
      value: "",
    }
  )
}
