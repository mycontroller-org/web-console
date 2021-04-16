import React from "react"
import {
  ChartArea,
  ChartBar,
  ChartGroup,
  ChartLine,
  ChartThemeColor,
  ChartVoronoiContainer,
} from "@patternfly/react-charts"
import { capitalizeFirstLetter, getValue } from "../../../Util/Util"
import { ChartType } from "../../../Constants/Widgets/UtilizationPanel"
import { Stack, StackItem } from "@patternfly/react-core"
import "./UtilizationPanel.scss"
import { InterpolationType, MetricType } from "../../../Constants/Metric"
import v from "validator"
import { LastSeen } from "../../Time/Time"

const SparkLine = ({ config = {}, resource = {}, metric = {}, dimensions = {}, isMetricsLoading }) => {
  const chartType = getValue(config, "chart.type", ChartType.SparkLine)
  const chartColor = getValue(config, "chart.color", ChartThemeColor.blue)
  const strokeWidth = getValue(config, "chart.strokeWidth", 2)
  const chartInterpolation = getValue(config, "chart.interpolation", InterpolationType.Basis)
  const metricFunction = getValue(config, "chart.metricFunction", "")
  const unit = getValue(config, "resource.unit", "")
  const roundDecimal = getValue(config, "resource.roundDecimal", 2)
  const chartHeight = getValue(config, "chart.height", 100)
  const yAxisMinValue = getValue(config, "chart.yAxisMinValue", "")
  const chartWidth = dimensions.width + 20 // include padding px to put the char till edge of the container

  const displayValueFloat = parseFloat(resource.value)
  let displayValue = resource.value

  if (v.isFloat(String(displayValue), {})) {
    displayValue = displayValueFloat.toFixed(roundDecimal)
  }

  const isMetricDataAvailable = getValue(metric, "data.length", 0)

  let metricsChart = null

  if (isMetricDataAvailable) {
    let chart = null
    let padding = 0

    switch (chartType) {
      case ChartType.SparkArea:
        chart = (
          <ChartArea
            style={{
              data: {
                fill: chartColor,
                fillOpacity: 0.3,
                stroke: chartColor,
                strokeWidth: strokeWidth,
              },
            }}
            interpolation={chartInterpolation}
            animate={false}
            data={metric.data}
          />
        )
        // padding = { bottom: -5, left: -2, right: -2 }
        break

      case ChartType.SparkLine:
        chart = (
          <ChartLine
            style={{ data: { strokeWidth: strokeWidth } }}
            interpolation={chartInterpolation}
            animate={false}
            data={metric.data}
          />
        )
        break

      case ChartType.SparkBar:
        chart = <ChartBar animate={false} data={metric.data} />
        break

      default:
    }

    const minValue = metric.minValue !== undefined ? metric.minValue - metric.minValue * 0.05 : 0
    metricsChart = (
      <div className="metrics-chart" style={{ height: `${chartHeight}px`, width: `${chartWidth}px` }}>
        <ChartGroup
          // ariaTitle="hello"
          standalone={true}
          height={chartHeight}
          width={chartWidth}
          domainPadding={{ y: 9 }}
          minDomain={{ y: yAxisMinValue !== "" ? yAxisMinValue : minValue }}
          containerComponent={
            <ChartVoronoiContainer
              labels={({ datum }) => {
                if (datum.y || datum.y === 0) {
                  // round decimal number
                  const yValue = datum.y % 1 === 0 ? datum.y : datum.y.toFixed(roundDecimal)
                  return `${yValue} ${unit} at ${datum.x}`
                }
                return null
              }}
              constrainToVisibleArea
            />
          }
          padding={padding}
          color={chartColor}
          scale={{ x: "time", y: "linear" }}
        >
          {chart}
        </ChartGroup>
      </div>
    )
  } else if (isMetricsLoading) {
    metricsChart = (
      <span className="no-metric-data" style={{ color: chartColor }}>
        Loading Metric data
      </span>
    )
  } else {
    metricsChart = (
      <span className="no-metric-data" style={{ color: chartColor }}>
        Metric data not available
      </span>
    )
  }

  let unitText = unit
  let metricFunctionText = ""
  let displayValueText = displayValue

  if (resource.metricType === MetricType.Binary) {
    unitText = ""
    displayValueText = displayValue ? "ON" : "OFF"
  }

  if (resource.metricType !== MetricType.Binary && isMetricDataAvailable) {
    metricFunctionText = `${capitalizeFirstLetter(metricFunction)}`
  }

  return (
    <>
      <Stack className="mc-spark-chart" hasGutter={false}>
        <StackItem>
          <span className="title">{resource.name}</span>
        </StackItem>
        <StackItem>
          <span>
            <span className="value">{displayValueText}</span>
            <span className="value-unit">{unitText}</span>
          </span>
        </StackItem>
        <StackItem>
          <span className="value-timestamp">
            <LastSeen date={resource.timestamp} tooltipPosition="top" />
          </span>
        </StackItem>
        <StackItem>
          <span className="metric-function">{metricFunctionText}</span>
        </StackItem>
        <StackItem>{metricsChart}</StackItem>
      </Stack>
    </>
  )
}

export default SparkLine
