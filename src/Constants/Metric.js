export const MetricType = {
  None: "none",
  String: "string",
  Binary: "binary",
  Gauge: "gauge",
  GaugeFloat: "gauge_float",
  Counter: "counter",
  GEO: "geo",
}

export const MetricTypeOptions = [
  { value: MetricType.None, label: "None" },
  { value: MetricType.String, label: "String" },
  { value: MetricType.Binary, label: "Binary" },
  { value: MetricType.Gauge, label: "Gauge" },
  { value: MetricType.GaugeFloat, label: "Gauge Float" },
  { value: MetricType.Counter, label: "Counter" },
  { value: MetricType.GEO, label: "GEO" },
]

export const Duration = {
  LastHour: "-1h",
  Last2Hours: "-2h",
  Last3Hours: "-3h",
  Last6Hours: "-6h",
  Last12ours: "-12h",
  Last24Hours: "-24h",
  Last2Days: "-48h",
  Last7Days: "-168h",
  Last30Days: "-720h",
}

export const DurationOptions = [
  { value: Duration.LastHour, window: "1m", tsFormat: "HH:mm", label: "Last 1 hour" },
  { value: Duration.Last2Hours, window: "2m", tsFormat: "HH:mm", label: "Last 2 hours" },
  { value: Duration.Last3Hours, window: "5m", tsFormat: "HH:mm", label: "Last 3 hours" },
  { value: Duration.Last6Hours, window: "10m", tsFormat: "HH:mm", label: "Last 6 hours" },
  { value: Duration.Last12ours, window: "10m", tsFormat: "HH:mm", label: "Last 12 hours" },
  { value: Duration.Last24Hours, window: "15m", tsFormat: "HH:mm", label: "Last 24 hours" },
  { value: Duration.Last2Days, window: "15m", tsFormat: "D,HH:mm", label: "Last 2 days" },
  { value: Duration.Last7Days, window: "30m", tsFormat: "D,HH:mm", label: "Last 7 days" },
  { value: Duration.Last30Days, window: "1h", tsFormat: "D,HH:mm", label: "Last 30 days" },
]

export const UtilizationDurationOptions = [
  { value: Duration.LastHour, window: "3m", tsFormat: "HH:mm", label: "Last 1 hour" },
  { value: Duration.Last2Hours, window: "5m", tsFormat: "HH:mm", label: "Last 2 hours" },
  { value: Duration.Last3Hours, window: "10m", tsFormat: "HH:mm", label: "Last 3 hours" },
  { value: Duration.Last6Hours, window: "15m", tsFormat: "HH:mm", label: "Last 6 hours" },
  { value: Duration.Last12ours, window: "30m", tsFormat: "HH:mm", label: "Last 12 hours" },
  { value: Duration.Last24Hours, window: "1h", tsFormat: "HH:mm", label: "Last 24 hours" },
  { value: Duration.Last2Days, window: "2h", tsFormat: "D,HH:mm", label: "Last 2 days" },
  { value: Duration.Last7Days, window: "6h", tsFormat: "D,HH:mm", label: "Last 7 days" },
  { value: Duration.Last30Days, window: "24h", tsFormat: "D,HH:mm", label: "Last 30 days" },
]

export const MetricFunctionType = {
  Mean: "mean",
  Max: "max",
  Min: "min",
  Sum: "sum",
  Median: "median",
  Count: "count",
  Percentile50: "percentile_50",
  Percentile75: "percentile_75",
  Percentile95: "percentile_95",
  Percentile99: "percentile_99",
}

export const MetricFunctionTypeOptions = [
  { value: MetricFunctionType.Median, label: "Median" },
  { value: MetricFunctionType.Mean, label: "Mean" },
  { value: MetricFunctionType.Min, label: "Min" },
  { value: MetricFunctionType.Max, label: "Max" },
  { value: MetricFunctionType.Percentile50, label: "50th Percentile" },
  { value: MetricFunctionType.Percentile75, label: "75th Percentile" },
  { value: MetricFunctionType.Percentile95, label: "95th Percentile" },
  { value: MetricFunctionType.Percentile99, label: "99th Percentile" },
  { value: MetricFunctionType.Sum, label: "Sum" },
  { value: MetricFunctionType.Count, label: "Count" },
]

export const InterpolationType = {
  Basis: "basis",
  Cardinal: "cardinal",
  CatmullRom: "catmullRom",
  Linear: "linear",
  MonotoneX: "monotoneX",
  MonotoneY: "monotoneY",
  Natural: "natural",
  Step: "step",
  StepAfter: "stepAfter",
  StepBefore: "stepBefore",
}

export const InterpolationTypeLineOptions = [
  { value: InterpolationType.Basis, label: "Basis" },
  { value: InterpolationType.Cardinal, label: "Cardinal" },
  { value: InterpolationType.CatmullRom, label: "CatmullRom" },
  { value: InterpolationType.Linear, label: "Linear" },
  { value: InterpolationType.MonotoneX, label: "Monotone X" },
  { value: InterpolationType.MonotoneY, label: "Monotone Y" },
  { value: InterpolationType.Natural, label: "Natural" },
  { value: InterpolationType.Step, label: "Step" },
  { value: InterpolationType.StepAfter, label: "Step After" },
  { value: InterpolationType.StepBefore, label: "Step Before" },
]
