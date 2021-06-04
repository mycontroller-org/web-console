import { ChartThemeColor } from "@patternfly/react-charts"

// chart group types
export const ChartGroupType = {
  GroupChart: "group_chart",
  MixedChart: "mixed_chart",
  PieChart: "pie_chart",
}

// chart group type options
export const ChartGroupTypeOptions = [
  {
    value: ChartGroupType.GroupChart,
    label: "Group Chart",
    description: "Single axis with multiple resources",
  },
  {
    value: ChartGroupType.MixedChart,
    label: "Mixed Chart",
    description: "Multiple axis with multiple resources",
  },
  { value: ChartGroupType.PieChart, label: "Pie Chart", description: "Single pie chart" },
]

// Charts types
export const ChartType = {
  AreaChart: "area_chart",
  BarChart: "bar_chart",
  LineChart: "line_chart",
  PieChart: "pie_chart",
  ScatterChart: "scatter_chart",
}

// charts type options
export const ChartTypeOptions = [
  { value: ChartType.AreaChart, label: "Area Chart", description: "Area chart" },
  { value: ChartType.BarChart, label: "Bar Chart", description: "Bar chart" },
  { value: ChartType.LineChart, label: "Line Chart", description: "Line chart" },
  { value: ChartType.PieChart, label: "Pie Chart", description: "Pie chart" },
  { value: ChartType.ScatterChart, label: "Scatter Chart", description: "Scatter chart" },
]

// legend position types
export const LegendPositionType = {
  BottomLeft: "bottom-left",
  Bottom: "bottom",
  Top: "top",
  Right: "right",
}

// legend position types options
export const LegendPositionTypeOptions = [
  { value: LegendPositionType.BottomLeft, label: "Bottom Left", description: "Left side of bottom" },
  { value: LegendPositionType.Bottom, label: "Bottom Center", description: "Center of bottom" },
  { value: LegendPositionType.Top, label: "Top Left", description: "Left side of top" },
  { value: LegendPositionType.Right, label: "Right", description: "Right side" },
]

// legend orientation types
export const LegendOrientationType = {
  Horizontal: "horizontal",
  Vertical: "vertical",
}

// legend orientation types options
export const LegendOrientationTypeOptions = [
  {
    value: LegendOrientationType.Horizontal,
    label: "Horizontal",
    description: "Place in horizontal position",
  },
  { value: LegendOrientationType.Vertical, label: "Vertical", description: "Place in vertical position" },
]

// ThemeColor used on the chart
export const ThemeColor = {
  Blue: ChartThemeColor.blue,
  Cyan: ChartThemeColor.cyan,
  Gold: ChartThemeColor.gold,
  Gray: ChartThemeColor.gray,
  Green: ChartThemeColor.green,
  Orange: ChartThemeColor.orange,
  Purple: ChartThemeColor.purple,
  Multi: ChartThemeColor.multi,
  MultiOrdered: ChartThemeColor.multiOrdered,
  MultiUnordered: ChartThemeColor.multiUnordered,
}

// ThemeColorOptions used on the chart
export const ThemeColorOptions = [
  { value: ThemeColor.Blue, label: "Blue" },
  { value: ThemeColor.Cyan, label: "Cyan" },
  { value: ThemeColor.Gold, label: "Gold" },
  { value: ThemeColor.Green, label: "Green" },
  { value: ThemeColor.Orange, label: "Orange" },
  { value: ThemeColor.Purple, label: "Purple" },
  { value: ThemeColor.Multi, label: "Multiple" },
  { value: ThemeColor.MultiOrdered, label: "Multiple Ordered" },
  { value: ThemeColor.MultiUnordered, label: "Multiple Unordered" },
]
