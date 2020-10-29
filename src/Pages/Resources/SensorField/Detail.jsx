import React from "react"
import moment from "moment"
import { api } from "../../../Service/Api"
import DetailBase from "../../../Components/BasePage/DetailBase"

import { KeyValueMap, Labels } from "../../../Components/Label/Label"
import Select from "../../../Components/Select/Select"
import Editor, { monaco } from "@monaco-editor/react"

monaco
  .init()
  .then((monaco) => {
    monaco.editor.defineTheme("console", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "number", foreground: "ace12e" },
        { token: "type", foreground: "73bcf7" },
        { token: "string", foreground: "f0ab00" },
        { token: "keyword", foreground: "cbc0ff" },
      ],
      colors: {
        "editor.background": "#151515",
        "editorGutter.background": "#292e34",
        "editorLineNumber.activeForeground": "#fff",
        "editorLineNumber.foreground": "#f0f0f0",
      },
    })
  })
  .catch((error) => console.error("An error occurred during initialization of Monaco: ", error))

const options = {
  selectOnLineNumbers: true,
  scrollBeyondLastLine: false,
  contextmenu: true,
  autoIndent: "full",
  cursorBlinking: "phase",
  smoothScrolling: true,
  tabSize: 2,
  fontSize: 15,
}

const editor = (data) => {
  return (
    <Editor
      height="73vh"
      language="json"
      theme="console"
      value={data}
      options={options}
      // editorDidMount={this.handleEditorDidMount}
    />
  )
}

class Detail extends DetailBase {
  componentDidMount() {
    this.loadDetail()
  }

  render() {
    return super.render()
  }
}

const updateMetricsDataFunc = (self, data) => {
  if (data.metricType === "binary" || data.metricType === "gauge_float" || data.metricType === "gauge") {
    const onChangeFunc = (selection) => {
      const queries = {
        global: {
          metricType: data.metricType,
          start: selection,
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

      api.metric
        .fetch(queries)
        .then((res) => {
          const metricsRaw = res.data["field_graph"]
          if (metricsRaw) {
            const metrics = []
            if (data.metricType === "gauge_float" || data.metricType === "gauge") {
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
                interpolation: "stepAfter",
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
            self.setState({ graphs: metrics })
          }
        })
        .catch((_e) => {})
    }

    const options = [
      { value: "-1h", display: "Last 1 hour" },
      { value: "-2h", display: "Last 2 hours" },
      { value: "-3h", display: "Last 3 hours" },
      { value: "-6h", display: "Last 6 hours" },
      { value: "-12h", display: "Last 12 hours" },
      { value: "-24h", display: "Last 24 hours" },
    ]

    const graphsHeader = []
    graphsHeader.push(
      <div style={{ marginBottom: "5px" }}>
        <Select
          key="range-selection"
          defaultValue="-2h"
          options={options}
          title=""
          onSelectionFunc={onChangeFunc}
        />
      </div>
    )

    self.setState({ graphsHeaders: graphsHeader })
  }
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
  // content.push(wrapCardFunc("JSON", <pre>{jsonData}</pre>))
  content.push(wrapCardFunc("JSON", <pre>{editor(jsonData)}</pre>))

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
