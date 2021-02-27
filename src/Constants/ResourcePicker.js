export const CallerType = {
  Variable: "variable",
  Parameter: "parameter",
}

export const FieldDataType = {
  TypeString: "string",
  TypeEmail: "email",
  TypeTelegram: "telegram",
  TypeWebhook: "webhook",
  TypeSMS: "sms",
  TypePushbullet: "pushbullet",
  TypeResourceByQuickId: "resource_by_quick_id",
  TypeResourceByLabels: "resource_by_labels",
}

export const FieldDataTypeOptions = [
  { value: FieldDataType.TypeString, label: "String Data" },
  { value: FieldDataType.TypeResourceByQuickId, label: "Resource Data By Quick ID" },
  { value: FieldDataType.TypeResourceByLabels, label: "Resource Data By Labels" },
  { value: FieldDataType.TypeWebhook, label: "Webhook Data" },
  { value: FieldDataType.TypeEmail, label: "Email Data" },
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
