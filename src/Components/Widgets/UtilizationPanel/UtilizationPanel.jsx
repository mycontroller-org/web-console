import PropTypes from "prop-types"
import React from "react"
import { api } from "../../../Service/Api"
import _ from "lodash"
import { ChartDonutUtilization } from "@patternfly/react-charts"
import { ResourceType } from "../../../config/globalConfig"
import objectPath from "object-path"
import { redirect as rd, routeMap as rMap } from "../../../Service/Routes"
import "./UtilizationPanel.scss"

const getInPercent = (maximumValue, value) => {
  return value > maximumValue ? 100 : (value / maximumValue) * 100
}

const DonutUtilization = ({
  resource = {},
  displayName = false,
  maximumValue = 100,
  thresholds = {},
  unit = "",
}) => {
  const resourceName = resource.name !== "" ? resource.name : "1"
  const value = getInPercent(maximumValue, resource.value)

  const keys = Object.keys(thresholds)

  const tunedThresholds = keys.map((key) => {
    return { value: getInPercent(maximumValue, Number(key)), color: thresholds[key] }
  })

  return (
    <ChartDonutUtilization
      // ariaDesc="Storage capacity"
      // ariaTitle="Donut utilization chart example"
      constrainToVisibleArea={true}
      data={{ x: resourceName, y: value }}
      labels={({ datum }) => (datum.x ? `${datum.x}: ${datum.y.toFixed(1)}%` : null)}
      title={resource.value + unit}
      subTitle={displayName ? resource.name : ""}
      width={175}
      height={175}
      thresholds={tunedThresholds}
    />
  )
}

class UtilizationPanel extends React.Component {
  state = {
    loading: true,
    resources: [],
  }

  componentDidMount() {
    this.updateComponents()
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.config, prevProps.config)) {
      this.updateComponents()
    }
  }

  updateComponents = () => {
    const { config } = this.props

    // if config empty, stop here
    if (config === undefined) {
      this.setState({ loading: false })
      return
    }

    const filters = []
    if (config.resourceSelectors) {
      const keys = Object.keys(config.resourceSelectors)
      keys.forEach((key) => {
        filters.push({ k: key, v: config.resourceSelectors[key] })
      })
    }
    let resourceApi = null
    switch (config.resourceType) {
      case ResourceType.Gateway:
        resourceApi = api.gateway.list
        break

      case ResourceType.Node:
        resourceApi = api.node.list
        break

      case ResourceType.Sensor:
        resourceApi = api.sensor.list
        break

      case ResourceType.SensorField:
        resourceApi = api.sensorField.list
        break

      default:
        this.setState({ loading: false })
        return
    }

    resourceApi({ filter: filters, limit: config.itemsLimit })
      .then((res) => {
        const resources = res.data.data.map((resource) => {
          const name = config.resourceNameKey ? objectPath.get(resource, config.resourceNameKey, "") : ""
          return {
            id: resource.id,
            name: name,
            value: objectPath.get(resource, config.resourceValueKey, ""),
          }
        })
        this.setState({ loading: false, resources })
      })
      .catch((_e) => {
        this.setState({ loading: false })
      })
  }

  onClick = (resourceType, id) => {
    let route = null

    switch (resourceType) {
      case ResourceType.Gateway:
        route = rMap.resources.gateway.detail
        break

      case ResourceType.Node:
        route = rMap.resources.node.detail
        break

      case ResourceType.Sensor:
        route = rMap.resources.sensor.detail
        break

      case ResourceType.SensorField:
        route = rMap.resources.sensorField.detail
        break

      default:
    }
    if (route !== null) {
      rd(this.props.history, route, { id: id })
    }
  }

  render() {
    const { loading, resources } = this.state
    const { config } = this.props
    const { columnDisplay, resourceUnit, resourceType } = config

    if (loading) {
      return <span>Loading...</span>
    }

    if (resources.length === 0) {
      return <span>No data available</span>
    }

    const charts = resources.map((resource, index) => {
      return (
        <div
          className="mc-utilization-panel-item"
          key={"chart_" + index}
          onClick={() => this.onClick(resourceType, resource.id)}
          style={{ height: "100%", width: "100%", cursor: "pointer" }}
        >
          <DonutUtilization
            className="on-edit"
            key={"chart_" + index}
            maximumValue={config.resourceMaximumValue}
            displayName={config.resourceDisplayName}
            thresholds={config.thresholds}
            resource={resource}
            unit={resourceUnit}
          />
        </div>
      )
    })

    const displayType = columnDisplay ? "grid" : "flex"

    return <div style={{ display: displayType }}>{charts}</div>
  }
}

UtilizationPanel.propTypes = {
  config: PropTypes.object,
}

// const config = {
//   resourceType: "",
//   resourceId: "",
//   resourceLabels: {},
//   resourceNameKey: "",
//   resourceValueKey: "",
//   resourceUnit: "",
//   thresholds: [],
//   columnGrid: false,
// }

export default UtilizationPanel
