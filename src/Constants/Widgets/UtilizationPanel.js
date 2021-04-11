// utilization panel chart types
export const ChartType = {
  CircleSize50: "circle_size_50",
  CircleSize75: "circle_size_75",
  CircleSize100: "circle_size_100",
  SparkArea: "spark_area",
  SparkLine: "spark_line",
  SparkBar: "spark_bar",
  Table: "table",
}

// utilization panel chart type options
export const ChartTypeOptions = [
  { value: ChartType.CircleSize50, label: "Half Circle" },
  { value: ChartType.CircleSize75, label: "3/4 Circle" },
  { value: ChartType.CircleSize100, label: "Full Circle" },
  { value: ChartType.SparkArea, label: "Spark Area" },
  { value: ChartType.SparkLine, label: "Spark Line" },
  { value: ChartType.SparkBar, label: "Spark Bar" },
  { value: ChartType.Table, label: "Table" },
]
