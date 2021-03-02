// Handler type values
export const HandlerType = {
  Noop: "noop",
  Resource: "resource",
  Email: "email",
  Telegram: "telegram",
  Exporter: "exporter",
}

// Handler type options
export const HandlerTypeOptions = [
  { value: HandlerType.Noop, label: "Noop", description: "No Operation Handler" },
  { value: HandlerType.Resource, label: "Resource", description: "Internal resource related actions" },
  { value: HandlerType.Email, label: "Email", description: "Sends email" },
  { value: HandlerType.Telegram, label: "Telegram", description: "Sends text to telegram" },
  { value: HandlerType.Exporter, label: "Exporter", description: "Exports storage database data" },
]
