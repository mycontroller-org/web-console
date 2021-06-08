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

// Operator values
export const Operator = {
  Equal: "eq",
  NotEqual: "ne",
  In: "in",
  NotIn: "nin",
  RangeIn: "range_in",
  RangeNotIn: "range_not_in",
  GreaterThan: "gt",
  LessThan: "lt",
  GreaterThanEqual: "gte",
  LessThanEqual: "lte",
  Exists: "exists",
  Regex: "regex",
}

// Operator options list
export const OperatorOptions = [
  { value: Operator.Equal, label: "==", description: "Equal" },
  { value: Operator.NotEqual, label: "!=", description: "Not equal" },
  { value: Operator.GreaterThan, label: ">", description: "greater than" },
  { value: Operator.GreaterThanEqual, label: ">=", description: "greater than equal" },
  { value: Operator.LessThan, label: "<", description: "Less than" },
  { value: Operator.LessThanEqual, label: "<=", description: "Less than equal" },
  { value: Operator.In, label: "In", description: "in" },
  { value: Operator.NotIn, label: "Not In", description: "not in" },
  { value: Operator.RangeIn, label: "In Range", description: "in range" },
  { value: Operator.RangeNotIn, label: "Not In Range", description: "not in range" },
  { value: Operator.Regex, label: "Regex", description: "Regex" },
  { value: Operator.Exists, label: "Exists", description: "Exists" },
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
