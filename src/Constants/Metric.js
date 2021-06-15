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
  Last30Minutes: "-30m",
  LastHour: "-1h",
  Last2Hours: "-2h",
  Last3Hours: "-3h",
  Last6Hours: "-6h",
  Last12Hours: "-12h",
  Last24Hours: "-24h",
  Last2Days: "-48h",
  Last7Days: "-168h",
  Last30Days: "-720h",
  Last60Days: "-1440h",
  Last90Days: "-2160h",
  Last180Days: "-4320h",
  Last365Days: "-8760h",
}

export const DurationOptions = [
  { value: Duration.Last30Minutes, tsFormat: "HH:mm", label: "Last 30 minutes" },
  { value: Duration.LastHour, tsFormat: "HH:mm", label: "Last 1 hour" },
  { value: Duration.Last2Hours, tsFormat: "HH:mm", label: "Last 2 hours" },
  { value: Duration.Last3Hours, tsFormat: "HH:mm", label: "Last 3 hours" },
  { value: Duration.Last6Hours, tsFormat: "HH:mm", label: "Last 6 hours" },
  { value: Duration.Last12Hours, tsFormat: "HH:mm", label: "Last 12 hours" },
  { value: Duration.Last24Hours, tsFormat: "HH:mm", label: "Last 24 hours" },
  { value: Duration.Last2Days, tsFormat: "Do HH:mm", label: "Last 2 days" },
  { value: Duration.Last7Days, tsFormat: "Do HH:mm", label: "Last 7 days" },
  { value: Duration.Last30Days, tsFormat: "MMM Do HH:mm", label: "Last 30 days" },
  { value: Duration.Last60Days, tsFormat: "MMM Do HH:mm", label: "Last 60 days" },
  { value: Duration.Last90Days, tsFormat: "MMM Do HH:mm", label: "Last 90 days" },
  { value: Duration.Last180Days, tsFormat: "MMM Do HH:mm", label: "Last 180 days" },
  { value: Duration.Last365Days, tsFormat: "YYYY MMM Do HH:mm", label: "Last 365 days" },
]

export const AggregationInterval = {
  Minute_1: "1m",
  Minute_2: "2m",
  Minute_3: "3m",
  Minute_5: "5m",
  Minute_10: "10m",
  Minute_15: "15m",
  Minute_30: "30m",
  Hour_1: "1h",
  Hour_3: "3h",
  Hour_6: "6h",
  Day_1: "24h",
}

export const AggregationIntervalOptions = [
  { value: AggregationInterval.Minute_1, label: "1 Minute" },
  { value: AggregationInterval.Minute_2, label: "2 Minutes" },
  { value: AggregationInterval.Minute_3, label: "3 Minutes" },
  { value: AggregationInterval.Minute_5, label: "5 Minutes" },
  { value: AggregationInterval.Minute_10, label: "10 Minutes" },
  { value: AggregationInterval.Minute_15, label: "15 Minutes" },
  { value: AggregationInterval.Minute_30, label: "30 Minutes" },
  { value: AggregationInterval.Hour_1, label: "1 Hour" },
  { value: AggregationInterval.Hour_3, label: "3 Hours" },
  { value: AggregationInterval.Hour_6, label: "6 Hours" },
  { value: AggregationInterval.Day_1, label: "1 Day" },
]

export const getRecommendedInterval = (durationValue) => {
  switch (durationValue) {
    case Duration.Last30Minutes:
    case Duration.LastHour:
    case Duration.Last2Hours:
      return AggregationInterval.Minute_1

    case Duration.Last3Hours:
      return AggregationInterval.Minute_2

    case Duration.Last6Hours:
      return AggregationInterval.Minute_3

    case Duration.Last12Hours:
      return AggregationInterval.Minute_5

    case Duration.Last24Hours:
      return AggregationInterval.Minute_10

    case Duration.Last2Days:
      return AggregationInterval.Minute_15

    case Duration.Last7Days:
      return AggregationInterval.Hour_1

    case Duration.Last30Days:
      return AggregationInterval.Hour_3

    case Duration.Last60Days:
    case Duration.Last90Days:
      return AggregationInterval.Hour_6

    case Duration.Last180Days:
    case Duration.Last365Days:
      return AggregationInterval.Day_1

    default:
      return AggregationInterval.Minute_15
  }
}

export const MetricFunctionType = {
  Mean: "mean",
  Max: "max",
  Min: "min",
  Median: "median",
  Sum: "sum",
  Count: "count",
  Percentile50: "percentile_50",
  Percentile75: "percentile_75",
  Percentile95: "percentile_95",
  Percentile99: "percentile_99",
}

export const MetricFunctionTypeOptions = [
  { value: MetricFunctionType.Mean, label: "Mean" },
  { value: MetricFunctionType.Min, label: "Min" },
  { value: MetricFunctionType.Max, label: "Max" },
  { value: MetricFunctionType.Median, label: "Median" },
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

export const RefreshIntervalType = {
  None: "0",
  Seconds_5: "5000",
  Seconds_10: "10000",
  Seconds_15: "15000",
  Seconds_30: "30000",
  Seconds_45: "45000",
  Minutes_1: "60000",
  Minutes_5: "300000",
  Minutes_15: "900000",
  Minutes_30: "1800000",
}

export const RefreshIntervalTypeOptions = [
  { value: RefreshIntervalType.None, label: "Never" },
  { value: RefreshIntervalType.Seconds_5, label: "5 Seconds" },
  { value: RefreshIntervalType.Seconds_10, label: "10 Seconds" },
  { value: RefreshIntervalType.Seconds_15, label: "15 Seconds" },
  { value: RefreshIntervalType.Seconds_30, label: "30 Seconds" },
  { value: RefreshIntervalType.Seconds_45, label: "45 Seconds" },
  { value: RefreshIntervalType.Minutes_1, label: "1 Minute" },
  { value: RefreshIntervalType.Minutes_5, label: "5 Minutes" },
  { value: RefreshIntervalType.Minutes_15, label: "15 Minutes" },
  { value: RefreshIntervalType.Minutes_30, label: "30 Minutes" },
]

export const DataUnitType = {
  Bytes: "",
  KiB: "KiB",
  MiB: "MiB",
  GiB: "GiB",
  TiB: "TiB",
  PiB: "PiB",
  EiB: "EiB",
}

export const DataUnitTypeOptions = [
  { value: DataUnitType.Bytes, label: "Bytes" },
  { value: DataUnitType.KiB, label: "Kibi Bytes (KiB)" },
  { value: DataUnitType.MiB, label: "Mibi Bytes (MiB)" },
  { value: DataUnitType.GiB, label: "Gibi Bytes (GiB)" },
  { value: DataUnitType.TiB, label: "Tebi Bytes (TiB)" },
  { value: DataUnitType.PiB, label: "Pebi Bytes (PiB)" },
  { value: DataUnitType.EiB, label: "Exbi Bytes (EiB)" },
]
