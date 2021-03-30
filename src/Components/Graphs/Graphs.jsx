import React from "react"
import {
  Chart,
  ChartAxis,
  ChartArea,
  ChartGroup,
  ChartVoronoiContainer,
  ChartThemeColor,
  getCustomTheme,
  ChartThemeVariant,
} from "@patternfly/react-charts"

import { areaTheme } from "./Themes"

import "./Graphs.scss"

const theme = getCustomTheme(ChartThemeColor.blue, ChartThemeVariant.light, areaTheme)

export const LineChart = ({
  title = "Graph title",
  unit = "",
  interpolation = "natural",
  data = [],
  tickCountX = 2,
  tickCountY = 3,
  height = 200,
  width = 600,
  minDomainY = 0,
}) => {
  return (
    <div>
      <h5 className="graph-title">{title}</h5>
      <Chart
        containerComponent={
          <ChartVoronoiContainer
            mouseFollowTooltips={false}
            //radius={20}
            constrainToVisibleArea
            labels={({ datum }) => {
              if (datum.y || datum.y === 0) {
                // round decimal number
                const yValue = datum.y % 1 === 0 ? datum.y : datum.y.toFixed(2)
                return `${yValue} ${unit} at ${datum.x}`
              }
              return null
            }}
          />
        }
        animate={false}
        theme={theme}
        height={height}
        width={width}
        // padding={{
        //   bottom: 45, // Adjusted to accommodate legend
        //   left: 75,
        //   right: 5,
        //   top: 5,
        // }}
        domainPadding={{ y: 20 }}
        scale={{ x: "time", y: "linear" }}
        minDomain={{ y: minDomainY }}
        //themeColor={ChartThemeColor.default}
      >
        <ChartAxis tickCount={tickCountX} />
        <ChartAxis
          dependentAxis
          showGrid
          tickCount={tickCountY}
          tickFormat={(tick) => {
            if (tick) {
              return `${tick} ${unit}`
            }
            return `${tick} ${unit}`
          }}
        />
        <ChartGroup>
          <ChartArea interpolation={interpolation} data={data} style={{ labels: { fontSize: "12px" } }} />
        </ChartGroup>
      </Chart>
    </div>
  )
}
