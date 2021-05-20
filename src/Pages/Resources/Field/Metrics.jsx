import {
  Card,
  CardBody,
  CardTitle,
  Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Level,
  LevelItem,
  Split,
  SplitItem,
} from "@patternfly/react-core"
import moment from "moment"
import React from "react"
import { connect } from "react-redux"
import Measure from "react-measure"
import { RefreshButton } from "../../../Components/Buttons/Buttons"
import { LineChart } from "../../../Components/Graphs/Graphs"
import Loading from "../../../Components/Loading/Loading"
import Select from "../../../Components/Select/Select"
import {
  AggregationInterval,
  AggregationIntervalOptions,
  Duration,
  DurationOptions,
  getRecommendedInterval,
  InterpolationType,
  InterpolationTypeLineOptions,
  MetricFunctionType,
  MetricFunctionTypeOptions,
  MetricType,
} from "../../../Constants/Metric"
import { api } from "../../../Service/Api"
import { getItem } from "../../../Util/Util"
import { updateMetricConfigGauge, updateMetricConfigBinary } from "../../../store/entities/resources/field"

const defaultDuration = Duration.LastHour
const defaultInterval = AggregationInterval.Minute_1
const defaultMetricFunction = MetricFunctionType.Mean
const defaultInterpolationType = InterpolationType.Natural

class Metrics extends React.Component {
  state = {
    metrics: [],
    loading: true,
    metricFn: defaultMetricFunction,
    duration: defaultDuration,
    interval: defaultInterval,
    interpolationType: defaultInterpolationType,
    minValue: 0,
  }

  componentDidMount() {}

  onChangeFunc = (gaugeConfig, binaryConfig) => {
    const data = this.props.data

    let durationValue = ""
    if (data.metricType === MetricType.Gauge || data.metricType === MetricType.GaugeFloat) {
      durationValue = gaugeConfig.duration
    } else if (data.metricType === MetricType.Binary) {
      durationValue = binaryConfig.duration
    }

    const duration = getItem(durationValue, DurationOptions)
    const metricFunction = getItem(gaugeConfig.func, MetricFunctionTypeOptions)

    const queries = {
      global: {
        metricType: data.metricType,
        start: duration.value,
        window: gaugeConfig.interval,
        functions: [metricFunction.value], // for binary data, this value will be ignored
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
    let minValue = Infinity

    api.metric
      .fetch(queries)
      .then((res) => {
        const metricsRaw = res.data["field_graph"]
        if (metricsRaw) {
          const metrics = []
          if (data.metricType === MetricType.Gauge || data.metricType === MetricType.GaugeFloat) {
            const metricConfig = {
              name: metricFunction.label,
              type: "area",
              unit: unit,
              interpolation: gaugeConfig.interpolationType,
              data: [],
            }

            metricsRaw.forEach((d) => {
              const ts = moment(d.timestamp).format(duration.tsFormat)
              // update data
              const value = d.metric[metricFunction.value]
              if (value !== undefined && value !== null && value < minValue) {
                minValue = value
              }
              metricConfig.data.push({
                x: ts,
                y: value,
              })
            })

            // update gauge data
            metrics.push(metricConfig)

            // update into redux
            this.props.updateMetricConfigGauge(gaugeConfig)
          } else if (data.metricType === MetricType.Binary) {
            const binaryData = {
              name: data.name,
              type: "line",
              interpolation: InterpolationType.StepAfter,
              data: [],
            }
            metricsRaw.forEach((d) => {
              const ts = moment(d.timestamp).format(duration.tsFormat + ":ss") // include seconds
              // update data
              binaryData.data.push({
                x: ts,
                y: d.metric.value,
              })
            })

            // add last data again into current timestamp to show till now
            if (binaryData.data.length > 0) {
              const data = binaryData.data[binaryData.data.length - 1]
              binaryData.data.push({
                x: moment().format(duration.tsFormat + ":ss"), // include seconds
                y: data.y,
              })
            }

            // update binaryData
            metrics.push(binaryData)

            // update in to redux
            this.props.updateMetricConfigBinary(binaryConfig)
          }

          // update metrics
          this.setState({
            metrics: metrics,
            minValue: minValue,
            loading: false,
          })
        }
      })
      .catch((_e) => {
        this.setState({ loading: false })
      })
  }

  render() {
    const { metricType } = this.props.data
    const showMetrics =
      metricType === MetricType.Binary ||
      metricType === MetricType.Gauge ||
      metricType === MetricType.GaugeFloat

    if (!showMetrics) {
      // metrics data not available
      return null
    }

    const isBinaryMetric = metricType === MetricType.Binary

    const metricsToolbox = []
    const { loading, metrics, minValue } = this.state
    const gaugeConfig = this.props.metricConfigGauge
    const binaryConfig = this.props.metricConfigBinary

    if (isBinaryMetric) {
      metricsToolbox.push(
        <div style={{ marginBottom: "5px" }}>
          <Select
            key="duration-selection"
            defaultValue={binaryConfig.duration}
            options={DurationOptions}
            title=""
            onSelectionFunc={(newDuration) => {
              this.onChangeFunc(gaugeConfig, { ...binaryConfig, duration: newDuration })
            }}
          />
        </div>
      )
    } else {
      metricsToolbox.push(
        <div style={{ marginBottom: "5px" }}>
          <MetricDropdown
            key="metric-dropdown-func"
            label="Function"
            dropdown={
              <Select
                key="function-selection"
                defaultValue={gaugeConfig.func}
                options={MetricFunctionTypeOptions}
                title=""
                onSelectionFunc={(newMetricFn) => {
                  this.onChangeFunc({ ...gaugeConfig, func: newMetricFn }, binaryConfig)
                }}
              />
            }
          />
        </div>,
        <MetricDropdown
          key="metric-dropdown-duration"
          label="Duration"
          dropdown={
            <Select
              key="duration-selection"
              defaultValue={gaugeConfig.duration}
              options={DurationOptions}
              title=""
              onSelectionFunc={(newDuration) => {
                const newInterval = getRecommendedInterval(newDuration)
                this.onChangeFunc(
                  { ...gaugeConfig, duration: newDuration, interval: newInterval },
                  binaryConfig
                )
              }}
            />
          }
        />,
        <MetricDropdown
          key="metric-dropdown-interval"
          label="Interval"
          dropdown={
            <Select
              key="interval-selection"
              defaultValue={gaugeConfig.interval}
              options={AggregationIntervalOptions}
              title=""
              onSelectionFunc={(newInterval) => {
                this.onChangeFunc({ ...gaugeConfig, interval: newInterval }, binaryConfig)
              }}
            />
          }
        />,
        <MetricDropdown
          key="metric-dropdown-interpolation"
          label="Interpolation"
          dropdown={
            <Select
              key="interpolation-selection"
              defaultValue={gaugeConfig.interpolationType}
              options={InterpolationTypeLineOptions}
              title=""
              onSelectionFunc={(newInterpolationType) => {
                this.onChangeFunc({ ...gaugeConfig, interpolationType: newInterpolationType }, binaryConfig)
              }}
            />
          }
        />
      )
    }

    const graphs = []

    if (loading) {
      graphs.push(<Loading key="loading" />)
    } else {
      if (metrics.length === 0) {
        graphs.push(<span key="no data">No data</span>)
      } else {
        // update minimum value
        let updateMinValue = isBinaryMetric ? 0 : minValue
        if (!isBinaryMetric && minValue !== undefined) {
          updateMinValue = minValue * 0.98 // add minimum value as 98% of original min value
        }

        const getTickCountX = (width) => {
          let tickCountX = 3

          if (width > 1500) {
            tickCountX = 9
          } else if (width > 1200) {
            tickCountX = 7
          } else if (width > 1000) {
            tickCountX = 5
          } else if (width > 800) {
            tickCountX = 4
          }
          return tickCountX
        }

        metrics.forEach((m, index) => {
          graphs.push(
            <GridItem key={m.name + "_" + index}>
              <Measure offset>
                {({ measureRef, contentRect }) => (
                  <div ref={measureRef}>
                    <LineChart
                      key={m.name}
                      title={m.name}
                      unit={m.unit}
                      data={m.data}
                      interpolation={m.interpolation}
                      type={m.type}
                      height={180}
                      width={contentRect.offset.width ? contentRect.offset.width : 1500}
                      tickCountX={getTickCountX(contentRect.offset.width)}
                      minDomainY={updateMinValue}
                    />
                  </div>
                )}
              </Measure>
            </GridItem>
          )
        })
      }
    }

    const refreshBtn = (
      <RefreshButton
        onClick={() => {
          this.onChangeFunc(gaugeConfig, binaryConfig)
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
          <Grid hasGutter sm={12} md={12} lg={12} xl={12}>
            {graphs}
          </Grid>
        </CardBody>
      </Card>
    )
  }
}

const mapStateToProps = (state) => ({
  metricConfigBinary: state.entities.resourceField.metricConfig.binary,
  metricConfigGauge: state.entities.resourceField.metricConfig.gauge,
})

const mapDispatchToProps = (dispatch) => ({
  updateMetricConfigBinary: (data) => dispatch(updateMetricConfigBinary(data)),
  updateMetricConfigGauge: (data) => dispatch(updateMetricConfigGauge(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Metrics)

// helper functions

const MetricDropdown = ({ label = "", dropdown }) => {
  return (
    <Flex>
      <FlexItem spacer={{ default: "spacerXs" }}><small>{label}</small></FlexItem>
      <FlexItem>{dropdown}</FlexItem>
    </Flex>
  )
}
