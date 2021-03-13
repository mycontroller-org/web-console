import { ResourceTypeOptions } from "../../../Constants/Resource"
import { DataType, FieldType } from "../../../Constants/Form"
import { ChartTypeOptions } from "../../../Constants/Widgets/UtilizationPanel"
import objectPath from "object-path"

// UtilizationPanel items
export const updateFormItemsUtilizationPanel = (rootObject, items = []) => {
  // set defaults:
  // ....
  // ....

  items.push(
    {
      label: "Chart",
      fieldId: "!chart",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "config.chart.type",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: ChartTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Thickness",
      fieldId: "config.chart.thickness",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperTextInvalid: "Invalid value. allowed range: 1-99",
      validated: "default",
      validator: { isNotEmpty: {}, isInt: { gt: 0, lt: 100 } },
    },
    {
      label: "Column Display",
      fieldId: "config.chart.columnDisplay",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    }
  )

  items.push(
    {
      label: "Resource",
      fieldId: "!resource",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "config.resource.type",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: ResourceTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Display Name",
      fieldId: "config.resource.displayName",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    }
  )

  if (objectPath.get(rootObject, "config.resource.displayName", false)) {
    items.push({
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
    })
  }

  items.push(
    {
      label: "Value Key",
      fieldId: "config.resource.valueKey",
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
      label: "Round Decimal",
      fieldId: "config.resource.roundDecimal",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: false,
    },
    {
      label: "Maximum Value",
      fieldId: "config.resource.maximumValue",
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
      fieldId: "config.resource.unit",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Limit",
      fieldId: "config.resource.limit",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid limit.",
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
      fieldId: "config.resource.selectors",
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
      fieldId: "config.chart.thresholds",
      fieldType: FieldType.ThresholdsColor,
      dataType: DataType.Object,
      value: "",
    }
  )
}
