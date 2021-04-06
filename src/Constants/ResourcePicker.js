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
  { value: FieldDataType.TypeString, label: "String" },
  { value: FieldDataType.TypeResourceByQuickId, label: "Resource By Quick ID" },
  { value: FieldDataType.TypeResourceByLabels, label: "Resource By Labels" },
  { value: FieldDataType.TypeWebhook, label: "Webhook", disable: true }, // not implemented yet
  { value: FieldDataType.TypeEmail, label: "Email" },
  { value: FieldDataType.TypeTelegram, label: "Telegram" },
  { value: FieldDataType.TypeExporter, label: "Exporter" },
]

export const ResourceType = {
  Gateway: "gateway",
  Node: "node",
  Source: "source",
  Field: "field",
  Task: "task",
  Schedule: "schedule",
  Handler: "handler",
  DataRepository: "data_repository",
}

export const ResourceTypeOptions = [
  { value: ResourceType.Gateway, label: "Gateway" },
  { value: ResourceType.Node, label: "Node" },
  { value: ResourceType.Source, label: "Source" },
  { value: ResourceType.Field, label: "Field" },
  { value: ResourceType.Task, label: "Task" },
  { value: ResourceType.Schedule, label: "Schedule" },
  { value: ResourceType.Handler, label: "Handler" },
  { value: ResourceType.DataRepository, label: "Data Repository" },
]

export const getQuickId = (resourceType = "", resource = {}) => {
  switch (resourceType) {
    case ResourceType.Gateway:
    case ResourceType.Task:
    case ResourceType.Schedule:
    case ResourceType.Handler:
    case ResourceType.DataRepository:
      return `${resourceType}:${resource.id}`

    case ResourceType.Node:
      return `${resourceType}:${resource.gatewayId}.${resource.nodeId}`

    case ResourceType.Source:
      return `${resourceType}:${resource.gatewayId}.${resource.nodeId}.${resource.sourceId}`

    case ResourceType.Field:
      return `${resourceType}:${resource.gatewayId}.${resource.nodeId}.${resource.sourceId}.${resource.fieldId}`

    default:
      return `unknown resource type:${resourceType}`
  }
}

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
