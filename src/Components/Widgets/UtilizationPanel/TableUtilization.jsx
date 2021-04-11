import React from "react"
import "./UtilizationPanel.scss"
import { getValue, getPercentage } from "../../../Util/Util"
import v from "validator"
import { LastSeen } from "../../Time/Time"
import { cellWidth, Table, TableBody, TableHeader, textCenter } from "@patternfly/react-table"
import { Bullseye, Level, Progress } from "@patternfly/react-core"

const TableUtilization = ({ widgetId = "", config = {}, resources = [] }) => {
  const thresholds = getValue(config, "chart.thresholds", {})
  const minimumValue = getValue(config, "chart.minimumValue", 0)
  const maximumValue = getValue(config, "chart.maximumValue", 100)
  const unit = getValue(config, "resource.unit", "")
  const roundDecimal = getValue(config, "resource.roundDecimal", 2)
  const displayStatusPercentage = getValue(config, "chart.displayStatusPercentage", false)

  const thresholdKeys = Object.keys(thresholds)

  const tunedThresholds = thresholdKeys.map((key) => {
    return { value: parseFloat(key), color: thresholds[key] }
  })

  const valueUnit = unit !== "" ? ` (${unit})` : ""
  const columns = [
    { title: "Name" },
    { title: "Status", transforms: [cellWidth(35)] },
    `Value${valueUnit}`,
    "Last Seen",
  ]

  const rows = []

  const getResourceValue = (resource = {}) => {
    const displayValueFloat = parseFloat(resource.value)
    let displayValue = resource.value
    if (v.isFloat(String(displayValue), {})) {
      displayValue = displayValueFloat.toFixed(roundDecimal)
    }
    return displayValue
  }

  const getStatus = (resource = {}) => {
    // get color
    let thresholdColor = "#06c"
    tunedThresholds.forEach((threshold) => {
      if (resource.value >= threshold.value) {
        thresholdColor = threshold.color
      }
    })
    return (
      <Progress
        key={"resource_" + resource.quickId}
        className="progress-bar"
        aria-label="utilization_table_status"
        style={{
          "--pf-c-progress__indicator--BackgroundColor": thresholdColor,
          "--pf-c-progress__bar--before--BackgroundColor": thresholdColor,
        }}
        value={resource.value}
        min={minimumValue}
        max={maximumValue}
        measureLocation={displayStatusPercentage ? "inside" : "none"}
      />
    )
  }

  resources.forEach((resource) => {
    rows.push([
      resource.name !== "" ? resource.name : "undefined",
      { title: getStatus(resource) },
      getResourceValue(resource),
      <span className="gauge-value-timestamp">
        <LastSeen date={resource.timestamp} tooltipPosition="top" />
      </span>,
    ])
  })

  if (rows.length === 0) {
    return <span>No resource found</span>
  }

  return (
    <Table
      key={"utilization_table_" + widgetId}
      className="mc-utilization-panel-item ut-table"
      aria-label="Utilization Table"
      variant="compact"
      borders={true}
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  )
}

export default TableUtilization
