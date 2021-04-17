import React from "react"
import "./UtilizationPanel.scss"
import { getValue } from "../../../Util/Util"
import v from "validator"
import { LastSeen } from "../../Time/Time"
import {
  cellWidth,
  fitContent,
  nowrap,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from "@patternfly/react-table"
import { Button, Progress } from "@patternfly/react-core"
import { navigateToResource } from "../Helper/Resource"

const TableUtilization = ({ widgetId = "", config = {}, resources = [], history = null }) => {
  const resourceType = getValue(config, "resource.type", "")
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
    "Last Update",
    `Value${valueUnit}`,
    { title: "Status", transforms: [cellWidth(35), fitContent] },
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
        className="table-progress-bar"
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
      {
        title: (
          <Button
            variant="link"
            isInline
            onClick={() => navigateToResource(resourceType, resource.id, history)}
          >
            {resource.name !== "" ? resource.name : "undefined"}
          </Button>
        ),
      },
      {
        title: (
          <span className="gauge-value-timestamp">
            <LastSeen date={resource.timestamp} tooltipPosition="top" />
          </span>
        ),
      },
      { title: getResourceValue(resource) },
      { title: getStatus(resource) },
    ])
  })

  if (rows.length === 0) {
    return <span>No resource found</span>
  }

  return (
    <Table
      key={"utilization_table_" + widgetId}
      className="mc-utilization-table ut-table"
      aria-label="Utilization Table"
      variant={TableVariant.compact}
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
