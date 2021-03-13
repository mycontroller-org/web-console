import PropTypes from "prop-types"
import React from "react"
import { api } from "../../../Service/Api"
import _ from "lodash"
import { ChartDonutUtilization, ChartLabel } from "@patternfly/react-charts"
import { ResourceType } from "../../../Constants/Resource"
import objectPath from "object-path"
import { redirect as rd, routeMap as rMap } from "../../../Service/Routes"
import "./UtilizationPanel.scss"
import Loading from "../../Loading/Loading"
import { getValue } from "../../../Util/Util"
import { ChartType } from "../../../Constants/Widgets/UtilizationPanel"
import v from "validator"

const getInPercent = (maximumValue, value) => {
  return value > maximumValue ? 100 : (value / maximumValue) * 100
}

const DonutUtilization = ({ config = {}, resource = {} }) => {
  const chartType = getValue(config, "chart.type", ChartType.SemiCircle)
  const thresholds = getValue(config, "chart.thresholds", {})
  const thickness = getValue(config, "chart.thickness", 10)
  const cornerSmoothing = getValue(config, "chart.cornerSmoothing", 0)
  const maximumValue = getValue(config, "resource.maximumValue", 100)
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

    const resourceType = getValue(config, "resource.type", "")
    const itemsLimit = getValue(config, "resource.limit", 1)
    const resourceSelectors = getValue(config, "resource.selectors", {})
    const resourceNameKey = getValue(config, "resource.nameKey", {})
    const resourceValueKey = getValue(config, "resource.valueKey", {})

    const filters = []
    if (resourceSelectors) {
      const keys = Object.keys(resourceSelectors)
      keys.forEach((key) => {
        filters.push({ k: key, v: resourceSelectors[key] })
      })
    }
    let resourceApi = null
    switch (resourceType) {
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

    resourceApi({ filter: filters, limit: itemsLimit })
      .then((res) => {
        const resources = res.data.data.map((resource) => {
          const name = resourceNameKey ? objectPath.get(resource, resourceNameKey, "undefined") : ""
          return {
            id: resource.id,
            name: name,
            value: objectPath.get(resource, resourceValueKey, ""),
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
    const columnDisplay = getValue(config, "chart.columnDisplay", false)
    const resourceType = getValue(config, "resource.type", "")

    if (loading) {
      return <Loading />
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
          <DonutUtilization className="on-edit" key={"chart_" + index} config={config} resource={resource} />
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
