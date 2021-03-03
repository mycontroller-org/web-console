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
  TypeExporter: "exporter",
}

export const FieldDataTypeOptions = [
  { value: FieldDataType.TypeString, label: "String Data" },
  { value: FieldDataType.TypeResourceByQuickId, label: "Resource Data By Quick ID" },
  { value: FieldDataType.TypeResourceByLabels, label: "Resource Data By Labels" },
  { value: FieldDataType.TypeWebhook, label: "Webhook Data", disable: true }, // not implemented yet
  { value: FieldDataType.TypeEmail, label: "Email Data" },
  { value: FieldDataType.TypeTelegram, label: "Telegram Data" },
  { value: FieldDataType.TypeExporter, label: "Exporter Data" },
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

export const TelegramParseMode = {
  Text: "Text",
  Markdown: "Markdown",
  MarkdownV2: "MarkdownV2",
  HTML: "HTML",
}

export const TelegramParseModeOptions = [
  { value: TelegramParseMode.Text, label: "Text" },
  { value: TelegramParseMode.Markdown, label: "Markdown" },
  { value: TelegramParseMode.MarkdownV2, label: "Markdown V2" },
  { value: TelegramParseMode.HTML, label: "HTML" },
]

// Exporter type values
export const ExporterType = {
  Disk: "disk",
}

// Exporter type options
export const ExporterTypeOptions = [
  { value: ExporterType.Disk, label: "Disk", description: "Exports data to disk location" },
]

// Export type values
export const ExportType = {
  YAML: "yaml",
  JSON: "json",
}

// Export type options
export const ExportTypeOptions = [
  { value: ExportType.YAML, label: "YAML" },
  { value: ExportType.JSON, label: "JSON", disable: true }, // on json export user password is not exported
]
