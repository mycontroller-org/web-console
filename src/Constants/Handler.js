// Handler type values
export const HandlerType = {
  Noop: "noop",
  Email: "email",
  Resource: "resource",
}

// Handler type options
export const HandlerTypeOptions = [
  { value: HandlerType.Noop, label: "Noop", description: "No Operation Handler" },
  { value: HandlerType.Email, label: "Email", description: "Sends email" },
  { value: HandlerType.Resource, label: "Resource", description: "Internal resource related actions" },
]
