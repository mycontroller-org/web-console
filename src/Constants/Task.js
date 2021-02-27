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

// Resource event types
export const ResourceEventType = {
  Gateway: "gateway",
  Node: "node",
  Sensor: "sensor",
  SensorFieldSet: "sensor_field.set",
  SensorFieldRequest: "sensor_field.request",
}

// Resource event type options
export const ResourceEventTypeOptions = [
  { value: ResourceEventType.Gateway, label: "Gateway" },
  { value: ResourceEventType.Node, label: "Node" },
  { value: ResourceEventType.Sensor, label: "Sensor" },
  { value: ResourceEventType.SensorFieldSet, label: "Sensor Field Set" },
  { value: ResourceEventType.SensorFieldRequest, label: "Sensor Field Request" },
]

// Operator values
export const Operator = {
  Equal: "eq",
  NotEqual: "ne",
  In: "in",
  NotIn: "nin",
  RangeIn: "rangeIn",
  RangeNotIn: "rangeNotIn",
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
  { value: Operator.RangeIn, label: "Range In", description: "range in" },
  { value: Operator.RangeNotIn, label: "Range Not In", description: "range not in" },
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
  { value: EvaluationType.Javascript, label: "Javascript", disabled: true }, // this feature not impleted yet
  { value: EvaluationType.Webhook, label: "Webhook", disabled: true }, // this feature not impleted yet
]
