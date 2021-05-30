import { DataType, FieldType } from "../../../Constants/Form"
import objectPath from "object-path"
import {
  ChartGroupType,
  ChartGroupTypeOptions,
  LegendPositionTypeOptions,
  LegendOrientationTypeOptions,
} from "../../../Constants/Widgets/ChartsPanel"
import {
  AggregationIntervalOptions,
  DurationOptions,
  getRecommendedInterval,
  InterpolationTypeLineOptions,
  MetricFunctionTypeOptions,
  RefreshIntervalTypeOptions,
} from "../../../Constants/Metric"
import { getValue } from "../../../Util/Util"

// Charts Panel items
export const updateFormItemsChartsPanel = (rootObject, items = []) => {
  items.push({
    label: "Sub Type",
    fieldId: "config.subType",
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    value: "",
    options: ChartGroupTypeOptions.filter((opt) => opt.value === ChartGroupType.MixedChart),
    isRequired: true,
    validator: { isNotEmpty: {} },
    // resetFields: { "config.fieldIds": {}, "config.abc": "" },
  })

  const selectedSubType = objectPath.get(rootObject, "config.subType", "")

  switch (selectedSubType) {
    case ChartGroupType.GroupChart:
    case ChartGroupType.MixedChart:
      const metricConfigItems = getMetricConfigItems(rootObject)
      items.push(...metricConfigItems)

      const globalConfigItems = getGlobalConfigItems(rootObject)
      items.push(...globalConfigItems)

      if (selectedSubType === ChartGroupType.MixedChart) {
        const axisConfigItems = getAxisYConfigItems(rootObject)
        items.push(...axisConfigItems)

        const resources = getResourceConfigItems(rootObject)
        items.push(...resources)
      }

      const chartConfigItems = getChartConfigItems(rootObject)
      items.push(...chartConfigItems)

      break

    default:
    //noop
  }

  // const selectedChartType = objectPath.get(rootObject, "config.chartType", "")
  //
  // switch (selectedChartType) {
  //   case ChartType.AreaChart:
  //     const areaChartItems = getAreaChartItems(rootObject)
  //     items.push(...areaChartItems)
  //     break
  //
  //   default:
  //   // noop
  // }
}

const getGlobalConfigItems = (_rootObject) => {
  const items = [
    {
      label: "Global Config",
      fieldId: "!global_config",
      fieldType: FieldType.Divider,
    },
    {
      label: "Fill Opacity (%)",
      fieldId: "config.chart.fillOpacity",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 1,
      max: 100,
      step: 1,
    },
    {
      label: "Stroke Width",
      fieldId: "config.chart.strokeWidth",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Float,
      value: "",
      min: 0.5,
      max: 20,
      step: 0.5,
    },
    {
      label: "Round Decimal",
      fieldId: "config.chart.roundDecimal",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 0,
      max: 10,
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
    },
  ]

  return items
}

const getMetricConfigItems = (_rootObject) => {
  const items = [
    {
      label: "Metric Config",
      fieldId: "!metric_config",
      fieldType: FieldType.Divider,
    },
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
      label: "Refresh Interval",
      fieldId: "config.chart.refreshInterval",
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

const getChartConfigItems = (_rootObject) => {
  const items = [
    {
      label: "Chart Config",
      fieldId: "!chart_config",
      fieldType: FieldType.Divider,
    },
    {
      label: "Show Grid X",
      fieldId: "config.chart.showGridX",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Show Grid Y",
      fieldId: "config.chart.showGridY",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Cursor Tooltip",
      fieldId: "config.chart.cursorTooltip",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Stack Charts",
      fieldId: "config.chart.stackCharts",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Height (px)",
      fieldId: "config.chart.height",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid height",
      validated: "default",
      validator: { isNotEmpty: {}, isInteger: { min: 1 } },
    },
    {
      label: "Legend Position",
      fieldId: "config.chart.legendPosition",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: LegendPositionTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Legend Orientation",
      fieldId: "config.chart.legendOrientation",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: LegendOrientationTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Padding Top (px)",
      fieldId: "config.chart.padding.top",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 1,
      max: 250,
      step: 1,
    },
    {
      label: "Padding Right (px)",
      fieldId: "config.chart.padding.right",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 1,
      max: 250,
      step: 1,
    },
    {
      label: "Padding Bottom (px)",
      fieldId: "config.chart.padding.bottom",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 1,
      max: 250,
      step: 1,
    },
    {
      label: "Padding Left (px)",
      fieldId: "config.chart.padding.left",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 1,
      max: 250,
      step: 1,
    },
  ]

  return items
}

const getAxisYConfigItems = (rootObject) => {
  updateYAxisConfig(rootObject)

  const items = [
    {
      label: "Y Axis Config",
      fieldId: "!y_axis_config",
      fieldType: FieldType.Divider,
    },
    {
      label: "Number of Axis",
      fieldId: "config.axisYCount",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 1,
      max: 10,
      step: 1,
      onChangeFunc: updateYAxisConfig,
    },
    {
      label: "",
      fieldId: "config.axisY",
      fieldType: FieldType.ChartYAxisConfigMap,
      dataType: DataType.Object,
      value: "",
      saveButtonText: "Update",
      updateButtonText: "Update",
      language: "yaml",
      minimapEnabled: true,
      isRequired: false,
    },
  ]

  return items
}

const getResourceConfigItems = (rootObject) => {
  const yAxisConfig = getValue(rootObject, "config.axisY", {})
  const items = [
    {
      label: "Resources",
      fieldId: "!resources",
      fieldType: FieldType.Divider,
    },
    {
      label: "Config",
      fieldId: "config.resources",
      fieldType: FieldType.ChartMixedResourceConfig,
      dataType: DataType.ArrayObject,
      value: "",
      saveButtonText: "Update",
      updateButtonText: "Update",
      language: "yaml",
      minimapEnabled: true,
      isRequired: false,
      yAxisConfig: yAxisConfig,
    },
  ]

  return items
}

// helper functions

const axisColors = [
  "#4f5255", // 0  color: rgb(79, 82, 85)
  "#4f5255", // 1
  "#4f5255", // 2
  "#4f5255", // 3
  "#4f5255", // 4
  "#4f5255", // 5
  "#4f5255", // 6
  "#4f5255", // 7
  "#4f5255", // 8
  "#4f5255", // 9
]
const axisOffset = [0, 100, 10, 20, 30, 40, 50, 60, 70, 80]

const updateYAxisConfig = (rootObject) => {
  objectPath.set(rootObject, "config.axisYCount", 1, true)
  objectPath.set(rootObject, "config.axisY", {}, true)

  const configMap = getValue(rootObject, "config.axisY", {})
  const axisYCount = getValue(rootObject, "config.axisYCount", 1)

  const keys = Object.keys(configMap).sort()
  let newMap = {}

  if (keys.length > axisYCount) {
    keys.forEach((key) => {
      if (key < axisYCount) {
        newMap[key] = { ...configMap[key] }
      }
    })
  } else if (keys.length < axisYCount) {
    for (let index = 0; index < axisYCount; index++) {
      if (index >= keys.length) {
        newMap[index] = {
          color: axisColors[index],
          offsetY: axisOffset[index],
          roundDecimal: 0,
          unit: "",
        }
      } else {
        newMap[index] = { ...configMap[index] }
      }
    }
  }

  if (Object.keys(newMap).length > 0) {
    objectPath.set(rootObject, "config.axisY", newMap, false)
  }
}
