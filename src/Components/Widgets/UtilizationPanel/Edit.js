import { ResourceTypeOptions } from "../../../Constants/Resource"
import { DataType, FieldType } from "../../../Constants/Form"
import objectPath from "object-path"

// UtilizationPanel items
export const updateFormItemsUtilizationPanel = (rootObject, items = []) => {
  // set defaults:
  // ....
  // ....
  items.push(
    {
      label: "Column Display",
      fieldId: "config.columnDisplay",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Resource",
      fieldId: "!resource",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "config.resourceType",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: ResourceTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Display Name",
      fieldId: "config.resourceDisplayName",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    }
  )

  if (objectPath.get(rootObject, "config.resourceDisplayName", false)) {
    items.push({
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
    })
  }

  items.push(
    {
      label: "Value Key",
      fieldId: "config.resourceValueKey",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Value Key. chars: min=1 and max=100",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Maximum Value",
      fieldId: "config.resourceMaximumValue",
      fieldType: FieldType.Text,
      dataType: DataType.Number,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Maximum Value.",
      validated: "default",
      validator: { isDecimal: { decimal_digits: 2 } },
    },
    {
      label: "Unit",
      fieldId: "config.resourceUnit",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
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
    },
    {
      label: "Thresholds",
      fieldId: "!thresholds",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "config.thresholds",
      fieldType: FieldType.ThresholdsColor,
      dataType: DataType.Object,
      value: "",
    }
  )
}
