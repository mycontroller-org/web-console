import PropTypes from "prop-types"
import React from "react"
import { api } from "../../../Service/Api"
import _ from "lodash"
import { ResourceType } from "../../../Constants/Resource"
import objectPath from "object-path"
import { redirect as rd, routeMap as rMap } from "../../../Service/Routes"
import Loading from "../../Loading/Loading"
import { getMetricDuration, getValue } from "../../../Util/Util"
import { ChartType } from "../../../Constants/Widgets/UtilizationPanel"
import DonutUtilization from "./DonutUtilization"
import SparkLine from "./SparkLine"
import moment from "moment"
import { Duration, MetricFunctionType, UtilizationDurationOptions } from "../../../Constants/Metric"

import "./UtilizationPanel.scss"
import { Stack, StackItem } from "@patternfly/react-core"

class UtilizationPanel extends React.Component {
  state = {
    loading: true,
    resources: [],
    metrics: {},
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
    const chartType = getValue(config, "chart.type", ChartType.CircleSize50)
    const chartDuration = getValue(config, "chart.duration", Duration.LastHour)
    const metricFunction = getValue(config, "chart.metricFunction", MetricFunctionType.Mean)

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
            metricType: objectPath.get(resource, "metricType", ""),
            name: name,
            value: objectPath.get(resource, resourceValueKey, ""),
          }
        })
        // if it is spark chart, get metrics data
        if (chartType.startsWith("spark")) {
          const duration = getMetricDuration(chartDuration, UtilizationDurationOptions)

          const metricQuery = {
            global: {
              start: duration.value,
              window: duration.window,
              functions: [metricFunction, "percentile_98"],
            },
            individual: [], // add id and metric type
          }
          // add id and metricType
          resources.forEach((r) => {
            if (r.metricType === "gauge_float" || r.metricType === "gauge") {
              metricQuery.individual.push({
                name: r.id,
                metricType: r.metricType,
                tags: { id: r.id },
              })
            }
          })
          if (metricQuery.individual.length > 0) {
            api.metric
              .fetch(metricQuery)
              .then((metricRes) => {
                // update metrics data
                const keys = Object.keys(metricRes.data)
                const metrics = {}
                keys.forEach((key) => {
                  const metricsRaw = metricRes.data[key]
                  const data = []
                  let minValue = Infinity
                  metricsRaw.forEach((d) => {
                    const ts = moment(d.timestamp).format(duration.tsFormat)
                    // update data
                    const yValue = d.metric[metricFunction]
                    data.push({
                      x: ts,
                      y: yValue,
                    })
                    if (yValue && minValue > yValue) {
                      minValue = yValue
                    }
                  })
                  // update data into metrics object
                  metrics[key] = { data: data, minValue: minValue }
                })
                this.setState({ loading: false, resources, metrics })
              })
              .catch((_e) => {
                this.setState({ loading: false, resources })
              })
          }
        } else {
          this.setState({ loading: false, resources })
        }
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
    const { loading, resources, metrics } = this.state
    const { config } = this.props
    const columnDisplay = getValue(config, "chart.columnDisplay", false)
    const chartType = getValue(config, "chart.type", ChartType.CircleSize75)

    const resourceType = getValue(config, "resource.type", "")

    if (loading) {
      return <Loading />
    }

    if (resources.length === 0) {
      return <span>No data available</span>
    }

    const charts = resources.map((resource, index) => {
      let chart = null
      switch (chartType) {
        case ChartType.SparkLine:
        case ChartType.SparkArea:
        case ChartType.SparkBar:
          chart = (
            <SparkLine
              className="on-edit"
              key={"chart_" + index}
              config={config}
              resource={resource}
              metric={metrics[resource.id]}
            />
          )
          break

        default:
          chart = (
            <DonutUtilization
              className="on-edit"
              key={"chart_" + index}
              config={config}
              resource={resource}
            />
          )
      }
      return (
        <div
          className="mc-utilization-panel-item"
          key={"chart_" + index}
          onClick={() => this.onClick(resourceType, resource.id)}
          style={{ height: "100%", width: "100%", cursor: "pointer" }}
        >
          {chart}
        </div>
      )
    })

    const displayType = columnDisplay ? "grid" : "flex"

    return <div style={{ display: displayType }} >{charts}</div>
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
