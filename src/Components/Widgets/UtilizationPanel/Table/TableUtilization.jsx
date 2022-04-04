import { Button, Progress } from "@patternfly/react-core"
import { cellWidth, fitContent, Table, TableBody, TableHeader, TableVariant } from "@patternfly/react-table"
import React from "react"
import { useTranslation } from "react-i18next"
import v from "validator"
import { getValue } from "../../../../Util/Util"
import { LastSeen } from "../../../Time/Time"
import { navigateToResource } from "../../Helper/Resource"
import "./TableUtilization.scss"

const TableUtilization = ({ widgetId = "", config = {}, resources = [], history = null }) => {
  const isMixedResources = getValue(config, "resource.isMixedResources", false)
  const resourcesConfig = getValue(config, "resource.resources", [])
  const resourceType = getValue(config, "resource.type", "")
  const thresholds = getValue(config, "table.thresholds", {})
  const minimumValue = getValue(config, "table.minimumValue", 0)
  const maximumValue = getValue(config, "table.maximumValue", 100)
  const hideValueColumn = getValue(config, "table.hideValueColumn", false)
  const hideStatusColumn = getValue(config, "table.hideStatusColumn", false)
  const displayStatusPercentage = getValue(config, "table.displayStatusPercentage", false)
  const unit = getValue(config, "resource.unit", "")
  const roundDecimal = getValue(config, "resource.roundDecimal", 2)
  const { t } = useTranslation()

  const resourceConfig = {
    minimumValue: minimumValue,
    maximumValue: maximumValue,
    hideValueColumn: hideValueColumn,
    hideStatusColumn: hideStatusColumn,
    thresholds: thresholds,
    displayStatusPercentage: displayStatusPercentage,
    unit: unit,
    roundDecimal: roundDecimal,
  }

  const columns = [{ title: t("name") }, { title: t("last_seen") }]

  // value column
  if (!hideValueColumn || isMixedResources) {
    columns.push({ title: t("value") })
  }

  // status column
  if (!hideStatusColumn || isMixedResources) {
    columns.push({ title: t("status"), transforms: [cellWidth(35), fitContent] })
  }

  const rows = []

  const getResourceValue = (resource = {}, resourceConfig = {}) => {
    const displayValueFloat = parseFloat(resource.value)
    let displayValue = resource.value
    if (v.isFloat(String(displayValue), {})) {
      displayValue = displayValueFloat.toFixed(resourceConfig.roundDecimal)
    }
    if (resourceConfig.unit && resourceConfig.unit !== "") {
      return `${displayValue} ${resourceConfig.unit}`
    }
    return displayValue
  }

  const getStatus = (resource = {}, resourceConfig = {}) => {
    // get color
    let thresholdColor = "#06c"
    getFormattedThresholds(resourceConfig.thresholds).forEach((threshold) => {
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
        min={resourceConfig.minimumValue}
        max={resourceConfig.maximumValue}
        measureLocation={resourceConfig.displayStatusPercentage ? "inside" : "none"}
      />
    )
  }

  // sort by ascending order, by name
  resources.sort((a, b) => (a.sortOrderPriority > b.sortOrderPriority ? 1 : -1))

  resources.forEach((resource) => {
    let _resourceConfig = resourceConfig
    if (isMixedResources) {
      // get specific resource
      for (let index = 0; index < resourcesConfig.length; index++) {
        const rConfig = resourcesConfig[index]
        if (`${rConfig.type}:${rConfig.quickId}` === resource.quickId) {
          _resourceConfig = { ...resourceConfig, roundDecimal: rConfig.roundDecimal, unit: rConfig.unit }
          if (!rConfig.useGlobal) {
            _resourceConfig = { ..._resourceConfig, ...rConfig.table }
          }
          break
        }
      }
    }

    const rowItems = [
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
    ]

    if (_resourceConfig.hideValueColumn) {
      if (isMixedResources) {
        rowItems.push(null)
      }
    } else {
      rowItems.push({ title: getResourceValue(resource, _resourceConfig) })
    }

    if (_resourceConfig.hideStatusColumn) {
      if (isMixedResources) {
        rowItems.push(null)
      }
    } else {
      rowItems.push({ title: getStatus(resource, _resourceConfig) })
    }

    rows.push(rowItems)
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
      borders={!config.hideBorder}
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  )
}

export default TableUtilization

// helper functions
const getFormattedThresholds = (thresholds) => {
  const thresholdKeys = Object.keys(thresholds)
  return thresholdKeys.map((key) => {
    return { value: parseFloat(key), color: thresholds[key] }
  })
}
