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
  TypeBackup: "backup",
}

export const FieldDataTypeOptions = [
  { value: FieldDataType.TypeString, label: "String" },
  { value: FieldDataType.TypeResourceByQuickId, label: "Resource By Quick ID" },
  { value: FieldDataType.TypeResourceByLabels, label: "Resource By Labels" },
  { value: FieldDataType.TypeWebhook, label: "Webhook", disable: true }, // not implemented yet
  { value: FieldDataType.TypeEmail, label: "Email" },
  { value: FieldDataType.TypeTelegram, label: "Telegram" },
  { value: FieldDataType.TypeBackup, label: "Backup" },
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
export const BackupProviderType = {
  Disk: "disk",
}

// Exporter type options
export const BackupProviderTypeOptions = [
  { value: BackupProviderType.Disk, label: "Disk", description: "Backup data in to disk" },
]

// Storage Export type values
export const StorageExportType = {
  YAML: "yaml",
  JSON: "json",
}

// Storage Export type options
export const StorageExportTypeOptions = [
  { value: StorageExportType.YAML, label: "YAML" },
  { value: StorageExportType.JSON, label: "JSON" },
]
