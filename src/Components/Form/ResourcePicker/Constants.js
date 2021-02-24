export const CallerType = {
  Variable: "variable",
  Parameter: "parameter",
}

export const FieldKey = {
  TypeLabels: "--labels",
  TypeQID: "--qid",
  ResourceType: "--type",
  ResourcePayload: "--payload",
  ResourcePreDelay: "--preDelay",
  ResourceSelector: "--selector",
}

export const ValueType = {
  TypeString: "string",
  TypeResourceByQuickID: "resource_quick_id",
  TypeResourceByLabels: "resource_labels",
}

export const ValueTypeOptions = [
  { value: ValueType.TypeString, label: "String" },
  { value: ValueType.TypeResourceByQuickID, label: "Resource By Quick ID" },
  { value: ValueType.TypeResourceByLabels, label: "Resource By Labels" },
]

export const ResourceType = {
  Gateway: "gateway",
  GatewayShort: "gw",
  Node: "node",
  NodeShort: "nd",
  Sensor: "sensor",
  SensorShort: "sn",
  SensorField: "sensor_field",
  SensorFieldShort: "sf",
  Task: "task",
  TaskShort: "tk",
  Schedule: "schedule",
  ScheduleShort: "sk",
  Handler: "handler",
  HandlerShort: "hd",
}

export const ResourceTypeOptions = [
  { value: ResourceType.Gateway, label: "Gateway" },
  { value: ResourceType.Node, label: "Node" },
  { value: ResourceType.Sensor, label: "Sensor" },
  { value: ResourceType.SensorField, label: "Sensor Field" },
  { value: ResourceType.Task, label: "Task" },
  { value: ResourceType.Schedule, label: "Schedule" },
  { value: ResourceType.Handler, label: "Handler" },
]
