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
  { value: EventType.Created, label: "opts.event_type.label_created" },
  { value: EventType.Updated, label: "opts.event_type.label_updated" },
  { value: EventType.Deleted, label: "opts.event_type.label_deleted" },
  { value: EventType.Requested, label: "opts.event_type.label_requested" },
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
  { value: EntityType.Gateway, label: "gateway" },
  { value: EntityType.Node, label: "node" },
  { value: EntityType.Source, label: "source" },
  { value: EntityType.Field, label: "field" },
  { value: EntityType.DataRepository, label: "data_repository" },
]

// Evaluation Types
export const EvaluationType = {
  Rule: "rule",
  Javascript: "javascript",
  Webhook: "webhook",
}

// Evaluation type options
export const EvaluationTypeOptions = [
  { value: EvaluationType.Rule, label: "rule" },
  { value: EvaluationType.Javascript, label: "javascript" },
  { value: EvaluationType.Webhook, label: "webhook" },
]
