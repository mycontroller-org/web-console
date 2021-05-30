import React from "react"
import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartGroup,
  ChartThemeColor,
  ChartLegendTooltip,
  ChartVoronoiContainer,
  createContainer,
} from "@patternfly/react-charts"
// import '@patternfly/patternfly/patternfly-charts.css'; // Required for mix-blend-mode CSS property

class BottomAlignedLegend extends React.Component {
  render() {
    // Note: Container order is important
    const CursorVoronoiContainer = createContainer("voronoi", "cursor")
    const legendData = [
      { childName: "cats", name: "Cats" },
      { childName: "dogs", name: "Dogs" },
      { childName: "birds", name: "Birds" },
    ]

    return (
      <div style={{ height: "250px", width: "650px" }}>
        <Chart
          ariaDesc="Average number of pets"
          ariaTitle="Area chart example"
          containerComponent={
            <CursorVoronoiContainer
              cursorDimension="x"
              labels={({ datum }) => `${datum.y}`}
              labelComponent={<ChartLegendTooltip legendData={legendData} title={(datum) => datum.x} />}
              mouseFollowTooltips
              voronoiDimension="x"
              voronoiPadding={50}
            />
          }
          legendData={legendData}
          legendPosition="bottom"
          height={250}
          padding={{
            bottom: 100, // Adjusted to accommodate legend
            left: 50,
            right: 50,
            top: 50,
          }}
          maxDomain={{ y: 9 }}
          themeColor={ChartThemeColor.cyan}
          width={650}
        >
          <ChartAxis label="Years" />
          <ChartAxis dependentAxis showGrid />
          <ChartGroup>
            <ChartArea
              data={[
                { x: "2015", y: 3 },
                { x: "2016", y: 4 },
                { x: "2017", y: 8 },
                { x: "2018", y: 6 },
              ]}
              interpolation="monotoneX"
              name="cats"
            />
            <ChartArea
              data={[
                { x: "2015", y: 2 },
                { x: "2016", y: 3 },
                { x: "2017", y: 4 },
                { x: "2018", y: 5 },
                { x: "2019", y: 6 },
              ]}
              interpolation="monotoneX"
              name="dogs"
            />
            <ChartArea
              data={[
                { x: "2015", y: 1 },
                { x: "2016", y: 2 },
                { x: "2017", y: 3 },
                { x: "2018", y: 2 },
                { x: "2019", y: 4 },
              ]}
              interpolation="monotoneX"
              name="birds"
            />
          </ChartGroup>
        </Chart>
      </div>
    )
  }
}

export default BottomAlignedLegend
