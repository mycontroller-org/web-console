import {
  Card,
  CardBody,
  CardTitle,
  Divider,
  Flex,
  Grid,
  GridItem,
  Level,
  LevelItem
} from "@patternfly/react-core"
import moment from "moment"
import React from "react"
import { RefreshButton } from "../../../Components/Buttons/Buttons"
import { LineChart } from "../../../Components/Graphs/Graphs"
import Select from "../../../Components/Select/Select"
import { api } from "../../../Service/Api"

const durationOptions = [
  { value: "-1h", display: "Last 1 hour" },
  { value: "-2h", display: "Last 2 hours" },
  { value: "-3h", display: "Last 3 hours" },
  { value: "-6h", display: "Last 6 hours" },
  { value: "-12h", display: "Last 12 hours" },
  { value: "-24h", display: "Last 24 hours" },
]

const defaultDuration = "-1h"

class Metrics extends React.Component {
  state = {
    metrics: [],
    loading: true,
    duration: defaultDuration,
  }

  componentDidMount() {}

  onChangeFunc = (duration) => {
    const data = this.props.data
    const queries = {
      global: {
        metricType: data.metricType,
        start: duration,
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
          this.setState({ metrics: metrics, duration: duration, loading: false })
        }
      })
      .catch((_e) => {
        this.setState({ loading: false })
      })
  }

  render() {
    const data = this.props.data
    const showMetrics =
      data.metricType === "binary" || data.metricType === "gauge_float" || data.metricType === "gauge"

    if (!showMetrics) {
      // metrics data not available
      return null
    }

    const metricsToolbox = []
    const { loading, metrics, duration } = this.state

    if (showMetrics) {
      metricsToolbox.push(
        <div style={{ marginBottom: "5px" }}>
          <Select
            key="range-selection"
            defaultValue={duration}
            options={durationOptions}
            title=""
            onSelectionFunc={this.onChangeFunc}
          />
        </div>
      )
    }

    const graphs = []

    if (loading) {
      graphs.push(<span>Loading</span>)
    } else {
      metrics.forEach((m, index) => {
        //console.log(m)
        graphs.push(
          <GridItem key={m.name + "_" + index}>
            <LineChart
              key={m.name}
              title={m.name}
              unit={m.unit}
              data={m.data}
              interpolation={m.interpolation}
              type={m.type}
            />
          </GridItem>
        )
      })
    }

    const refreshBtn = (
      <RefreshButton
        onClick={() => {
          this.onChangeFunc(duration)
        }}
      />
    )

    return (
      <Card isFlat={false} style={{ height: "100%" }}>
        <CardTitle>
          <Level>
            <LevelItem>Metrics</LevelItem>
            <LevelItem>
              <Flex>
                {metricsToolbox}
                {refreshBtn}
              </Flex>
            </LevelItem>
          </Level>
          <Divider />
        </CardTitle>
        <CardBody>
          <Grid hasGutter sm={12} md={12} lg={6} xl={4}>
            {graphs}
          </Grid>
        </CardBody>
      </Card>
    )
  }
}

export default Metrics
