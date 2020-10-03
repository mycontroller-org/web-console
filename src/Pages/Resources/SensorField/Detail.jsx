import React from "react"
import moment from "moment"
import { api } from "../../../Service/Api"
import DetailBase from "../../../Components/BasePage/DetailBase"

import { KeyValueMap, Labels } from "../../../Components/Label/Label"

class Detail extends DetailBase {
  componentDidMount() {
    this.loadDetail()
  }

  render() {
    return super.render()
  }
}

const updateMetricsDataFunc = (self, data) => {
  const graphs = []
  const queries = {
    global: {
      metricType: data.metricType,
      start: "-2h",
      window: "1m",
      functions: ["mean", "percentile_99"],
    },
    individual: [
      {
        name: "field_graph",
        tags: { id: data.id },
      },
    ],
  }

  // unit
  const unit = data.unit === "none" ? "" : data.unit

  if (data.metricType === "binary" || data.metricType === "gauge_float") {
    api.metric
      .fetch(queries)
      .then((res) => {
        const metricsRaw = res.data["field_graph"]
        if (metricsRaw) {
          const metrics = []
          if (data.metricType === "gauge_float") {
            const average = {
              name: "Average",
              type: "area",
              unit: unit,
              interpolation: "natural",
              data: [],
            }
            const percentile = {
              name: "99th Percentile",
              type: "area",
              interpolation: "natural",
              unit: unit,
              data: [],
            }
            metricsRaw.forEach((d) => {
              const ts = moment(d.timestamp).format("HH:mm")
              // update data
              average.data.push({
                x: ts,
                y: d.metric.mean,
              })
              percentile.data.push({
                x: ts,
                y: d.metric.percentile_99,
              })
            })

            // update average and percentile
            metrics.push(average)
            metrics.push(percentile)
          } else if (data.metricType === "binary") {
            const binaryData = {
              name: data.name,
              type: "line",
              interpolation: "step",
              data: [],
            }
            metricsRaw.forEach((d) => {
              const ts = moment(d.timestamp).format("HH:mm")
              // update data
              binaryData.data.push({
                x: ts,
                y: d.metric.value,
              })
            })
            // update binaryData
            metrics.push(binaryData)
          }
          // update metrics
          self.setState({ metrics: metrics })
        }
      })
      .catch((_e) => {})
  }

  return graphs
}

const renderFunc = (data, wrapFieldFunc, wrapCardFunc) => {
  const fields = []
  fields.push(wrapFieldFunc("ID", data.id))
  fields.push(wrapFieldFunc("Gateway ID", data.gatewayId))
  fields.push(wrapFieldFunc("Node ID", data.nodeId))
  fields.push(wrapFieldFunc("Sensor ID", data.sensorId))
  fields.push(wrapFieldFunc("Field ID", data.fieldId))
  fields.push(wrapFieldFunc("Name", data.name))
  fields.push(wrapFieldFunc("Last Seen", data.lastSeen))

  const others = []
  others.push(wrapFieldFunc("Labels", <Labels data={data.labels} />))
  others.push(wrapFieldFunc("Others", <KeyValueMap data={data.others} />))

  const payload = []
  payload.push(wrapFieldFunc("Metric Type", data.metricType))
  payload.push(wrapFieldFunc("Unit", data.unit))
  payload.push(wrapFieldFunc("Payload", <KeyValueMap data={data.payload} />))
  payload.push(wrapFieldFunc("Previous Payload", <KeyValueMap data={data.previousPayload} />))

  const jsonData = JSON.stringify(data, null, 2)
  const content = []

  content.push(wrapCardFunc("Overview", fields))
  content.push(wrapCardFunc("Labels and Others", others))
  content.push(wrapCardFunc("Payload", payload))
  content.push(wrapCardFunc("JSON", <pre>{jsonData}</pre>))

  return content
}

// supply required properties
Detail.defaultProps = {
  resourceName: "Sensor Field Details",
  apiGetRecord: api.sensorField.get,
  renderFunc: renderFunc,
  updateOtherDataFunc: updateMetricsDataFunc,
  redirectUpdatePage: "",
}

export default Detail
