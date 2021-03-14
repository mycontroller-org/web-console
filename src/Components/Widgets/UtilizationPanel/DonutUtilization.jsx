import React from "react"
import { ChartDonutUtilization, ChartLabel } from "@patternfly/react-charts"
import "./UtilizationPanel.scss"
import { getValue } from "../../../Util/Util"
import { ChartType } from "../../../Constants/Widgets/UtilizationPanel"
import v from "validator"

const getInPercent = (maximumValue, value) => {
  return value > maximumValue ? 100 : (value / maximumValue) * 100
}

const DonutUtilization = ({ config = {}, resource = {} }) => {
  const chartType = getValue(config, "chart.type", ChartType.CircleSize50)
  const thresholds = getValue(config, "chart.thresholds", {})
  const thickness = getValue(config, "chart.thickness", 10)
  const cornerSmoothing = getValue(config, "chart.cornerSmoothing", 0)
  const maximumValue = getValue(config, "chart.maximumValue", 100)
  const unit = getValue(config, "resource.unit", "")
  const displayName = getValue(config, "resource.displayName", false)
  const roundDecimal = getValue(config, "resource.roundDecimal", 2)

  // update inner radius
  const innerRadius = 100 - thickness

  const resourceName = resource.name !== "" ? resource.name : "1"
  const value = getInPercent(maximumValue, resource.value)

  const displayValueFloat = parseFloat(resource.value)
  let displayValue = resource.value

  if (v.isFloat(String(displayValue), {})) {
    displayValue = displayValueFloat.toFixed(roundDecimal)
  }

  const keys = Object.keys(thresholds)

  const tunedThresholds = keys.map((key) => {
    return { value: getInPercent(maximumValue, Number(key)), color: thresholds[key] }
  })

  let titleComponent = <ChartLabel />
  let subTitleComponent = <ChartLabel />
  let startAngle = 0
  let endAngle = 360
  let isStandalone = true

  switch (chartType) {
    case ChartType.CircleSize50:
      titleComponent = <ChartLabel y={85} />
      subTitleComponent = <ChartLabel y={105} />
      startAngle = -90
      endAngle = 90
      isStandalone = false
      break

    case ChartType.CircleSize75:
      titleComponent = <ChartLabel y={100} />
      subTitleComponent = <ChartLabel y={120} />
      startAngle = -135
      endAngle = 135
      isStandalone = false
      break

    default:
  }

  const chart = (
    <ChartDonutUtilization
      animate={true}
      // ariaDesc="Storage capacity"
      // ariaTitle="Donut utilization chart example"z
      constrainToVisibleArea={true}
      data={{ x: resourceName, y: value }}
      labels={() => {}}
      // labels={({ datum }) => (datum.x ? `${datum.x}: ${datum.y.toFixed(1)}%` : null)}
      title={displayValue + unit}
      titleComponent={titleComponent}
      subTitle={displayName ? resource.name : ""}
      subTitleComponent={subTitleComponent}
      width={230}
      height={230}
      cornerRadius={cornerSmoothing}
      startAngle={startAngle}
      endAngle={endAngle}
      innerRadius={innerRadius}
      radius={100}
      thresholds={tunedThresholds}
      standalone={isStandalone}
    />
  )

  switch (chartType) {
    case ChartType.CircleSize50:
      return (
        <svg
          viewBox={"0 0 230 120"}
          preserveAspectRatio="none"
          height="120"
          width="230"
          role="img"
          style={{ height: "100%", width: "100%" }}
        >
          {chart}
        </svg>
      )

    case ChartType.CircleSize75:
      return (
        <svg
          viewBox={"0 0 230 190"}
          preserveAspectRatio="none"
          height="190"
          width="230"
          role="img"
          style={{ height: "100%", width: "100%" }}
        >
          {chart}
        </svg>
      )

    case ChartType.CircleSize100:
      return chart

    default:
      return <span>Invalid chart type: {chartType}</span>
  }
}

export default DonutUtilization
