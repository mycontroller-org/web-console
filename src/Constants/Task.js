// Dampening values
export const Dampening = {
  None: "",
  Consecutive: "consecutive",
  LastNEvaluations: "last_n_evaluations",
  ActiveTime: "active_time",
}

// Dampening options
export const DampeningOptions = [
  { value: Dampening.None, label: "None", description: "disabled" },
  { value: Dampening.Consecutive, label: "Consecutive", description: "Consecutive" },
  { value: Dampening.LastNEvaluations, label: "Last N Evaluations", description: "Last N Evaluations" },
  { value: Dampening.ActiveTime, label: "Active Time", description: "Active Time" },
]

// event types
export const EventType = {
  Created: "created",
  Updated: "updated",
  Deleted: "deleted",
  Requested: "requested",
}

// event type options
export const EventTypeOptions = [
  { value: EventType.Created, label: "Created" },
  { value: EventType.Updated, label: "Updated" },
  { value: EventType.Deleted, label: "Deleted" },
  { value: EventType.Requested, label: "Requested" },
]

// Entity types
export const EntityType = {
  Gateway: "gateway",
  Node: "node",
  Source: "source",
  Field: "field",
  DataRepository: "data_repository",
}

// Entity type options
export const EntityTypeOptions = [
  { value: EntityType.Gateway, label: "Gateway" },
  { value: EntityType.Node, label: "Node" },
  { value: EntityType.Source, label: "Source" },
  { value: EntityType.Field, label: "Field" },
  { value: EntityType.DataRepository, label: "Data Repository" },
]

// Evaluation Types
export const EvaluationType = {
  Rule: "rule",
  Javascript: "javascript",
  Webhook: "webhook",
}

// Evaluation type options
export const EvaluationTypeOptions = [
  { value: EvaluationType.Rule, label: "Rule" },
  { value: EvaluationType.Javascript, label: "Javascript" },
  { value: EvaluationType.Webhook, label: "Webhook" },
]
