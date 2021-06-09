import objectPath from "object-path"
import { DataType, FieldType } from "../../../Constants/Form"
import { ResourceType, ResourceTypeOptions } from "../../../Constants/ResourcePicker"
import {
  ControlType,
  ControlTypeOptions,
  ButtonType,
  ButtonTypeOptions,
} from "../../../Constants/Widgets/ControlPanel"

// Control Panel items
export const updateFormItemsControlPanel = (rootObject = {}, items = []) => {
  // add default filter at first time
  objectPath.set(rootObject, "config.resource.type", ResourceType.Field, true)
  const resourceType = objectPath.get(rootObject, "config.resource.type", ResourceType.Field)
  if (resourceType === ResourceType.Field) {
    const filters = objectPath.get(rootObject, "config.resource.filters", undefined)
    if (filters === undefined) {
      objectPath.set(rootObject, "config.resource.filters", { metricType: "binary" }, false)
    }
  }
  objectPath.set(rootObject, "config.tableView", true, true)
  const tableView = objectPath.get(rootObject, "config.tableView", true)

  items.push(
    {
      label: "Control Config",
      fieldId: "!control_config",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "config.type",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: ControlTypeOptions,
      isRequired: true,
    },
    {
      label: "Table View",
      fieldId: "config.tableView",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    }
  )

  if (tableView) {
    items.push({
      label: "Hide Header",
      fieldId: "config.hideHeader",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    })
  }

  items.push({
    label: "Hide Border",
    fieldId: "config.hideBorder",
    fieldType: FieldType.Switch,
    dataType: DataType.Boolean,
    value: false,
  })

  const controlType = objectPath.get(rootObject, "config.type", "")

  switch (controlType) {
    case ControlType.SwitchButton:
    case ControlType.SwitchToggle:
      const switchItems = getToggleSwitchItems(rootObject)
      items.push(...switchItems)
      break

    case ControlType.MixedControl:
      const mixedControlItems = getMixedControlItems(rootObject)
      items.push(...mixedControlItems)
      break

    default:
  }
}

const getToggleSwitchItems = (rootObject) => {
  const items = []
  const controlType = objectPath.get(rootObject, "config.type", "")
  if (controlType === ControlType.SwitchButton) {
    objectPath.set(rootObject, "config.onButtonType", ButtonType.Primary, true)
    objectPath.set(rootObject, "config.onText", "ON", true)
    objectPath.set(rootObject, "config.offText", "OFF", true)
    objectPath.set(rootObject, "config.minWidth", 70, true)

    items.push(
      {
        label: "ON Button",
        fieldId: "config.onButtonType",
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.String,
        value: "",
        options: ButtonTypeOptions,
        isRequired: true,
      },
      {
        label: "ON Text",
        fieldId: "config.onText",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "Invalid text. chars: min=1 and max=100",
        validated: "default",
        validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
      },
      {
        label: "OFF Text",
        fieldId: "config.offText",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "Invalid text. chars: min=1 and max=100",
        validated: "default",
        validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
      },
      {
        label: "Minimum Width",
        fieldId: "config.minWidth",
        fieldType: FieldType.Text,
        dataType: DataType.Integer,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "Invalid width",
        validated: "default",
        validator: { isInteger: { min: 1 } },
      }
    )
  }

  objectPath.set(rootObject, "config.resource.type", ResourceType.Field, true)
  objectPath.set(rootObject, "config.resource.nameKey", "name", true)
  objectPath.set(rootObject, "config.resource.limit", 10, true)
  items.push(
    {
      label: "Resource Config",
      fieldId: "!resource_config",
      fieldType: FieldType.Divider,
    },
    {
      label: "Resource Type",
      fieldId: "config.resource.type",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: false,
      helperText: "",
      helperTextInvalid: "Invalid type",
      validated: "default",
      options: ResourceTypeOptions.filter((r) => r.value !== ResourceType.Source),
      validator: { isNotEmpty: {} },
      resetFields: { "config.resource.filters": {} },
    },
    {
      label: "Name Key",
      fieldId: "config.resource.nameKey",
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
      label: "Limit",
      fieldId: "config.resource.limit",
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
      label: "Resource Filters",
      fieldId: "!resource_filters",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "config.resource.filters",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.Object,
      value: "",
    }
  )
  return items
}

const getMixedControlItems = (_rootObject) => {
  const items = []

  items.push(
    {
      label: "Resources",
      fieldId: "!resources",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "config.resources",
      fieldType: FieldType.MixedControlList,
      dataType: DataType.ArrayObject,
      value: [],
    }
  )

  return items
}
