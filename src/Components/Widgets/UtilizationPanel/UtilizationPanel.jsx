import PropTypes from "prop-types"
import React from "react"
import { api } from "../../../Service/Api"
import _ from "lodash"
import { connect } from "react-redux"
import objectPath from "object-path"
import { redirect as rd, routeMap as rMap } from "../../../Service/Routes"
import Loading from "../../Loading/Loading"
import { getItem, getValue } from "../../../Util/Util"
import { ChartType } from "../../../Constants/Widgets/UtilizationPanel"
import DonutUtilization from "./DonutUtilization"
import SparkLine from "./SparkLine"
import moment from "moment"
import {
  Duration,
  MetricFunctionType,
  MetricType,
  DurationOptions,
  getRecommendedInterval,
} from "../../../Constants/Metric"

import "./UtilizationPanel.scss"
import { getQuickId, ResourceType } from "../../../Constants/ResourcePicker"
import { loadData, unloadData } from "../../../store/entities/websocket"
import { LastSeen } from "../../Time/Time"
import { Bullseye } from "@patternfly/react-core"
import TableUtilization from "./TableUtilization"

const wsKey = "dashboard_utilization_panel"

class UtilizationPanel extends React.Component {
  state = {
    loading: true,
    resources: [],
    metrics: {},
  }

  getWsKey = () => {
    return `${wsKey}_${this.props.widgetId}`
  }

  componentWillUnmount() {
    this.props.unloadData({ key: this.getWsKey() })
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
    const resourceSelectors = getValue(config, "resource.selectors", "undefined")
    const displayName = getValue(config, "resource.displayName", false)
    const resourceNameKey = getValue(config, "resource.nameKey", "undefined")
    const resourceValueKey = getValue(config, "resource.valueKey", "undefined")
    const resourceValueTimestampKey = getValue(config, "resource.valueTimestampKey", "")
    const chartType = getValue(config, "chart.type", ChartType.CircleSize50)

    const chartDuration = getValue(config, "chart.duration", Duration.LastHour)
    const chartInterval = getValue(config, "chart.interval", getRecommendedInterval(chartDuration))

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

      case ResourceType.Source:
        resourceApi = api.source.list
        break

      case ResourceType.Field:
        resourceApi = api.field.list
        break

      default:
        this.setState({ loading: false })
        return
    }

    resourceApi({ filter: filters, limit: itemsLimit })
      .then((res) => {
        const resourcesRaw = {}
        const resources = res.data.data.map((resource) => {
          const name = displayName
            ? resourceNameKey
              ? objectPath.get(resource, resourceNameKey, "undefined")
              : ""
            : ""

          const quickId = getQuickId(resourceType, resource)
          resourcesRaw[quickId] = resource
          return {
            id: resource.id,
            quickId: quickId,
            name: name,
            metricType: objectPath.get(resource, "metricType", ""),
            value: objectPath.get(resource, resourceValueKey, ""),
            timestamp:
              resourceValueTimestampKey !== "" ? objectPath.get(resource, resourceValueTimestampKey, "") : "",
          }
        })

        // push raw resources into redux
        this.props.loadData({ key: this.getWsKey(), resources: resourcesRaw })

        // if it is spark chart, get metrics data
        if (chartType.startsWith("spark")) {
          const duration = getItem(chartDuration, DurationOptions)

          const metricQuery = {
            global: {
              start: duration.value,
              window: chartInterval,
              functions: [metricFunction],
            },
            individual: [], // add id and metric type
          }
          // add id and metricType
          resources.forEach((r) => {
            // supports only for the below types
            if (
              r.metricType === MetricType.Gauge ||
              r.metricType === MetricType.GaugeFloat ||
              r.metricType === MetricType.Binary
            ) {
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
                  // update data into metrics object
                  metrics[key] = getMetrics(metricsRaw, duration.tsFormat, metricFunction)
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

      case ResourceType.Source:
        route = rMap.resources.source.detail
        break

      case ResourceType.Field:
        route = rMap.resources.field.detail
        break

      default:
    }
    if (route !== null) {
      rd(this.props.history, route, { id: id })
    }
  }

  render() {
    const { loading, resources, metrics } = this.state
    const { widgetId, dimensions, config } = this.props
    const columnDisplay = getValue(config, "chart.columnDisplay", false)
    const chartType = getValue(config, "chart.type", ChartType.CircleSize75)
    const resourceValueKey = getValue(config, "resource.valueKey", "undefined")
    const resourceValueTimestampKey = getValue(config, "resource.valueTimestampKey", "")
    const resourceType = getValue(config, "resource.type", "")

    if (loading) {
      return <Loading />
    }

    if (resources.length === 0) {
      return <span>No data available</span>
    }

    // update resource value
    const resourcesRaw = getValue(this.props.wsData, this.getWsKey(), {})
    Object.keys(resourcesRaw).forEach((qId) => {
      const res = resourcesRaw[qId]
      for (let index = 0; index < resources.length; index++) {
        const resource = resources[index]
        if (resource.quickId === qId) {
          resources[index].value = objectPath.get(res, resourceValueKey, "")
          if (resourceValueTimestampKey !== "") {
            resources[index].timestamp = objectPath.get(res, resourceValueTimestampKey, "")
          }
        }
      }
    })

    if (chartType === ChartType.Table) {
      return <TableUtilization widgetId={widgetId} config={config} resources={resources} />
    }

    // if chartType not equal to table
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
              widgetId={widgetId}
              dimensions={dimensions}
              config={config}
              resource={resource}
              metric={metrics[resource.id]}
            />
          )
          break

        case ChartType.CircleSize50:
        case ChartType.CircleSize75:
        case ChartType.CircleSize100:
          chart = (
            <>
              <DonutUtilization
                className="on-edit"
                key={"chart_" + index}
                widgetId={widgetId}
                dimensions={dimensions}
                config={config}
                resource={resource}
              />
              <Bullseye>
                <span className="gauge-value-timestamp">
                  <LastSeen date={resource.timestamp} tooltipPosition="top" />
                </span>
              </Bullseye>
            </>
          )
          break

        default:
          return <span>Type not implemented: {chartType}</span>
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

const mapStateToProps = (state) => ({
  wsData: state.entities.websocket.data,
})

const mapDispatchToProps = (dispatch) => ({
  loadData: (data) => dispatch(loadData(data)),
  unloadData: (data) => dispatch(unloadData(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UtilizationPanel)

// helper functions

const getMetrics = (metricsRaw = [], tsFormat, metricFunction) => {
  if (metricsRaw.length == 0) {
    return { data: [] }
  }

  const metricType = metricsRaw[0].metricType
  switch (metricType) {
    case MetricType.Binary:
      return getBinaryMetrics(metricsRaw, tsFormat)

    case MetricType.Gauge:
    case MetricType.GaugeFloat:
      return getGaugeMetrics(metricsRaw, tsFormat, metricFunction)

    default:
      return { data: [] }
  }
}

const getBinaryMetrics = (metricsRaw = [], tsFormat) => {
  const data = []
  metricsRaw.forEach((d) => {
    const ts = moment(d.timestamp).format(tsFormat)
    data.push({
      x: ts,
      y: d.metric.value,
    })
  })
  return { data: data }
}

const getGaugeMetrics = (metricsRaw = [], tsFormat, metricFunction) => {
  const data = []
  let minValue = Infinity
  let maxValue = -Number.MAX_VALUE * 2
  metricsRaw.forEach((d) => {
    const ts = moment(d.timestamp).format(tsFormat)
    // update data
    const yValue = d.metric[metricFunction]
    data.push({
      x: ts,
      y: yValue,
    })
    if (yValue) {
      if (minValue > yValue) {
        minValue = yValue
      }
      if (maxValue < yValue) {
        maxValue = yValue
      }
    }
  })
  return { data: data, minValue: minValue, maxValue: maxValue }
}
