import objectPath from "object-path"
import { DataType, FieldType } from "../../../Constants/Form"
import {
  AggregationIntervalOptions,
  Duration,
  DurationOptions,
  getRecommendedInterval,
  InterpolationType,
  InterpolationTypeLineOptions,
  MetricFunctionType,
  MetricFunctionTypeOptions,
  RefreshIntervalTypeOptions,
} from "../../../Constants/Metric"
import { ResourceType, ResourceTypeOptions } from "../../../Constants/Resource"
import { ColorsSetBig } from "../../../Constants/Widgets/Color"
import { ChartType, ChartTypeOptions } from "../../../Constants/Widgets/UtilizationPanel"
import { getValue } from "../../../Util/Util"

// UtilizationPanel items
export const updateFormItemsUtilizationPanel = (rootObject, items = []) => {
  // update chart config items
  const chartType = getValue(rootObject, "config.chart.type", "")

  if (
    chartType === ChartType.CircleSize50 ||
    chartType === ChartType.CircleSize75 ||
    chartType === ChartType.CircleSize100
  ) {
    items.push({
      label: "column_display",
      fieldId: "config.chart.columnDisplay",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    })
  } else {
    objectPath.set(rootObject, "config.chart.columnDisplay", false, false)
  }

  items.push({
    label: "chart_type",
    fieldId: "config.chart.type",
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    value: "",
    options: ChartTypeOptions,
    isRequired: true,
    validator: { isNotEmpty: {} },
  })

  switch (chartType) {
    case ChartType.CircleSize50:
    case ChartType.CircleSize75:
    case ChartType.CircleSize100:
      const circleItems = getCircleAndTableItems(rootObject, chartType)
      items.push(...circleItems)
      break

    case ChartType.Table:
      const tableItems = getCircleAndTableItems(rootObject, chartType)
      items.push(...tableItems)
      break

    case ChartType.SparkArea:
    case ChartType.SparkLine:
    case ChartType.SparkBar:
      const sparkLineItems = getSparkLineItems(rootObject)
      items.push(...sparkLineItems)
      break

    default:
  }

  // set default values
  objectPath.set(rootObject, "config.resource.type", ResourceType.Field, true)
  objectPath.set(rootObject, "config.resource.displayName", true, true)
  objectPath.set(rootObject, "config.resource.nameKey", "name", true)
  objectPath.set(rootObject, "config.resource.valueKey", "current.value", true)
  objectPath.set(rootObject, "config.resource.valueTimestampKey", "current.timestamp", true)
  objectPath.set(rootObject, "config.resource.roundDecimal", 0, true)
  // objectPath.set(rootObject, "config.resource.limit", 1, true)

  items.push(
    {
      label: "resource",
      fieldId: "!resource",
      fieldType: FieldType.Divider,
    },
    {
      label: "type",
      fieldId: "config.resource.type",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: ResourceTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "display_name",
      fieldId: "config.resource.displayName",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
      isDisabled: chartType === ChartType.Table,
    }
  )

  if (objectPath.get(rootObject, "config.resource.displayName", false)) {
    items.push({
      label: "name_key",
      fieldId: "config.resource.nameKey",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_key",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    })
  }

  items.push(
    {
      label: "value_key",
      fieldId: "config.resource.valueKey",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_key",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "timestamp_key",
      fieldId: "config.resource.valueTimestampKey",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_key",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "round_decimal",
      fieldId: "config.resource.roundDecimal",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: false,
    },
    {
      label: "unit",
      fieldId: "config.resource.unit",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    }
  )

  if (
    chartType === ChartType.SparkArea ||
    chartType === ChartType.SparkLine ||
    chartType === ChartType.SparkBar
  ) {
    objectPath.set(rootObject, "config.resource.limit", 1, false)
  } else {
    items.push({
      label: "limit",
      fieldId: "config.resource.limit",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_limit",
      validated: "default",
      validator: { isInteger: {} },
    })
  }

  items.push(
    {
      label: "resource_filters",
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
}

const getCircleAndTableItems = (rootObject = {}, chartType = "") => {
  // set defaults
  objectPath.set(rootObject, "config.chart.thickness", 20, true)
  objectPath.set(rootObject, "config.chart.cornerSmoothing", 2, true)
  objectPath.set(rootObject, "config.chart.minimumValue", 0, true)
  objectPath.set(rootObject, "config.chart.maximumValue", 100, true)
  objectPath.set(rootObject, "config.chart.hideValueColumn", false, true)
  objectPath.set(rootObject, "config.resource.displayName", true, false)

  const items = [
    {
      label: "config",
      fieldId: "!config",
      fieldType: FieldType.Divider,
    },
    {
      label: "minimum_value",
      fieldId: "config.chart.minimumValue",
      fieldType: FieldType.Text,
      dataType: DataType.Number,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_value",
      validated: "default",
      validator: { isDecimal: { decimal_digits: 2 } },
    },
    {
      label: "maximum_value",
      fieldId: "config.chart.maximumValue",
      fieldType: FieldType.Text,
      dataType: DataType.Number,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_value",
      validated: "default",
      validator: { isDecimal: { decimal_digits: 2 } },
    },
  ]

  if (chartType === ChartType.Table) {
    items.push(
      {
        label: "display_percentage",
        fieldId: "config.chart.displayStatusPercentage",
        fieldType: FieldType.Switch,
        dataType: DataType.Boolean,
        value: false,
      },
      {
        label: "hide_value_column",
        fieldId: "config.chart.hideValueColumn",
        fieldType: FieldType.Switch,
        dataType: DataType.Boolean,
        value: false,
      },
      {
        label: "hide_border",
        fieldId: "config.hideBorder",
        fieldType: FieldType.Switch,
        dataType: DataType.Boolean,
        value: false,
      }
    )
  } else {
    items.push(
      {
        label: "thickness",
        fieldId: "config.chart.thickness",
        fieldType: FieldType.SliderSimple,
        dataType: DataType.Integer,
        value: "",
        min: 1,
        max: 99,
        step: 1,
      },
      {
        label: "corner_smoothing",
        fieldId: "config.chart.cornerSmoothing",
        fieldType: FieldType.SliderSimple,
        dataType: DataType.Integer,
        value: "",
        min: 0,
        max: 100,
        step: 1,
      }
    )
  }

  items.push(
    {
      label: "thresholds_color",
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

  return items
}

const getSparkLineItems = (rootObject) => {
  // set defaults:
  objectPath.set(rootObject, "config.chart.duration", Duration.LastHour, true)
  objectPath.set(
    rootObject,
    "config.chart.interval",
    getRecommendedInterval(getValue(rootObject, "config.chart.duration", "")),
    true
  )
  objectPath.set(rootObject, "config.chart.cornerSmoothing", 2, true)
  objectPath.set(rootObject, "config.chart.height", 70, true)
  objectPath.set(rootObject, "config.chart.refreshInterval", 0, true)
  objectPath.set(rootObject, "config.chart.metricFunction", MetricFunctionType.Percentile99, true)

  const items = [
    {
      label: "metric_config",
      fieldId: "!metric_config",
      fieldType: FieldType.Divider,
    },
    {
      label: "duration",
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
      label: "interval",
      fieldId: "config.chart.interval",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: AggregationIntervalOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "metric_function",
      fieldId: "config.chart.metricFunction",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: MetricFunctionTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "refresh_interval",
      fieldId: "config.chart.refreshInterval",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.Integer,
      value: "",
      options: RefreshIntervalTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "chart_config",
      fieldId: "!chart_config",
      fieldType: FieldType.Divider,
    },
  ]

  const chartType = getValue(rootObject, "config.chart.type", "")

  if (chartType !== ChartType.SparkBar) {
    objectPath.set(rootObject, "config.chart.interpolation", InterpolationType.Basis, true)
    items.push({
      label: "interpolation",
      fieldId: "config.chart.interpolation",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: InterpolationTypeLineOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    })
  }

  objectPath.set(rootObject, "config.chart.color", "#0066cc", true)
  items.push(
    {
      label: "height_px",
      fieldId: "config.chart.height",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_value",
      validated: "default",
      validator: { isNotEmpty: {} },
    },
    {
      label: "color",
      fieldId: "config.chart.color",
      fieldType: FieldType.ColorBox,
      dataType: DataType.String,
      value: "",
      colors: ColorsSetBig,
    }
  )

  if (chartType !== ChartType.SparkLine) {
    objectPath.set(rootObject, "config.chart.fillOpacity", 15, true)
    items.push({
      label: "fill_opacity_%",
      fieldId: "config.chart.fillOpacity",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 1,
      max: 100,
      step: 1,
    })
  }

  objectPath.set(rootObject, "config.chart.strokeWidth", 1.5, true)

  items.push(
    {
      label: "stroke_width_px",
      fieldId: "config.chart.strokeWidth",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Float,
      value: "",
      min: 0,
      max: 20,
      step: 0.5,
    },
    {
      label: "min_y_axis",
      fieldId: "config.chart.yAxisMinValue",
      fieldType: FieldType.Text,
      dataType: DataType.Float,
      value: "",
      isRequired: false,
    },
    {
      label: "max_y_axis",
      fieldId: "config.chart.yAxisMaxValue",
      fieldType: FieldType.Text,
      dataType: DataType.Float,
      value: "",
      isRequired: false,
    }
  )

  return items
}
