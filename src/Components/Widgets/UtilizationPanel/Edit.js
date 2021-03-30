import { ResourceTypeOptions } from "../../../Constants/Resource"
import { DataType, FieldType } from "../../../Constants/Form"
import { ChartType, ChartTypeOptions } from "../../../Constants/Widgets/UtilizationPanel"
import objectPath from "object-path"
import { getItem, getValue } from "../../../Util/Util"
import {
  AggregationIntervalOptions,
  DurationOptions,
  getRecommendedInterval,
  InterpolationType,
  InterpolationTypeLineOptions,
  MetricFunctionTypeOptions,
} from "../../../Constants/Metric"
import { ColorsSetBig } from "../../../Constants/Widgets/Color"

// UtilizationPanel items
export const updateFormItemsUtilizationPanel = (rootObject, items = []) => {
  items.push(
    {
      label: "Column Display",
      fieldId: "config.chart.columnDisplay",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
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
    }
  )

  // update chart config items
  const chartType = getValue(rootObject, "config.chart.type", "")

  switch (chartType) {
    case ChartType.CircleSize50:
    case ChartType.CircleSize75:
    case ChartType.CircleSize100:
      // set defaults:
      objectPath.set(rootObject, "config.chart.thickness", 20, true)
      objectPath.set(rootObject, "config.chart.cornerSmoothing", 2, true)
      const circleItems = getCircleItems(rootObject)
      items.push(...circleItems)
      break

    case ChartType.SparkArea:
    case ChartType.SparkLine:
    case ChartType.SparkBar:
      // set defaults:
      objectPath.set(rootObject, "config.chart.thickness", 20, true)
      objectPath.set(rootObject, "config.chart.cornerSmoothing", 2, true)
      const sparkLineItems = getSparkLineItems(rootObject)
      items.push(...sparkLineItems)
      break

    default:
  }

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
    }
  )
}

const getCircleItems = (_rootObject) => {
  return [
    {
      label: "Maximum Value",
      fieldId: "config.chart.maximumValue",
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
      label: "Thickness",
      fieldId: "config.chart.thickness",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 1,
      max: 99,
      step: 1,
    },
    {
      label: "Corner Smoothing",
      fieldId: "config.chart.cornerSmoothing",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 0,
      max: 100,
      step: 1,
    },
    {
      label: "Thresholds Color",
      fieldId: "!thresholds",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "config.chart.thresholds",
      fieldType: FieldType.ThresholdsColor,
      dataType: DataType.Object,
      value: "",
    },
  ]
}

const getSparkLineItems = (rootObject) => {
  const items = [
    {
      label: "Duration",
      fieldId: "config.chart.duration",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: DurationOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
      resetFields: {
        "config.chart.interval": (ro) => {
          return getRecommendedInterval(getValue(ro, "config.chart.duration", ""))
        },
      },
    },
    {
      label: "Interval",
      fieldId: "config.chart.interval",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: AggregationIntervalOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Metric Function",
      fieldId: "config.chart.metricFunction",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: MetricFunctionTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Color",
      fieldId: "config.chart.color",
      fieldType: FieldType.ColorBox,
      dataType: DataType.String,
      value: "",
      colors: ColorsSetBig,
    },
  ]

  const chartType = getValue(rootObject, "config.chart.type", "")

  if (chartType === ChartType.SparkLine || chartType === ChartType.SparkArea) {
    objectPath.set(rootObject, "config.chart.strokeWidth", 1, true)
    objectPath.set(rootObject, "config.chart.interpolation", InterpolationType.Basis, true)

    items.push(
      {
        label: "Stroke Width",
        fieldId: "config.chart.strokeWidth",
        fieldType: FieldType.SliderSimple,
        dataType: DataType.Integer,
        value: "",
        min: 1,
        max: 20,
        step: 1,
      },
      {
        label: "Interpolation",
        fieldId: "config.chart.interpolation",
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.String,
        value: "",
        options: InterpolationTypeLineOptions,
        isRequired: true,
        validator: { isNotEmpty: {} },
      }
    )
  }

  return items
}
