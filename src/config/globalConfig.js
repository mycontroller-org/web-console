export const NOTIFICATION_LIMIT = 50

export const TOAST_ALERT_TIMEOUT = 5000

export const ALERT_TYPE_DEFAULT = "default"
export const ALERT_TYPE_INFO = "info"
export const ALERT_TYPE_SUCCESS = "success"
export const ALERT_TYPE_WARN = "warning"
export const ALERT_TYPE_ERROR = "danger"

export const DATA_CACHE_TIMEOUT = 30 // in seconds

export const METRIC_TYPES = {
  none: "String",
  counter: "Counter",
  gauge: "Gauge",
  gauge_float: "Gauge (Float)",
  binary: "Binary",
  geo: "GEO",
}

// Resource type mapping
export const ResourceType = {
  Gateway: "gateway",
  Node: "node",
  Sensor: "senor",
  SensorField: "senorField",
}

// Resource type options list
export const ResourceTypeOptions = [
  { value: ResourceType.Gateway, label: "Gateway" },
  { value: ResourceType.Node, label: "Node" },
  { value: ResourceType.Sensor, label: "Sensor" },
  { value: ResourceType.SensorField, label: "Sensor Field" },
]
