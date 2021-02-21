export const DataType = {
  String: "string",
  Number: "number",
  Integer: "integer",
  Float: "float",
  Boolean: "boolean",
  Object: "object",
  ArrayString: "array_string",
  ArrayNumber: "array_number",
  ArrayBoolean: "array_boolean",
  ArrayObject: "array_object",
}

export const FieldType = {
  Text: "text",
  Password: "password",
  Email: "email",
  Number: "number",
  Date: "data",
  Checkbox: "checkbox",
  Labels: "labels",
  KeyValueMap: "key_value_map",
  VariablesMap: "variables_map",
  ThresholdsColor: "thresholds_color",
  DynamicArray: "dynamic_array",
  ConditionsArrayMap: "conditions_array_map",
  Divider: "divider",
  Select: "select",
  SelectTypeAhead: "select_type_ahead",
  SelectTypeAheadMultiple: "select_type_ahead_multiple",
  SelectTypeAheadAsync: "select_type_ahead_async",
  Switch: "switch",
  DatePicker: "date_picker",
  DateRangePicker: "date_range_picker",
  TimePicker: "time_picker",
  TimeRangePicker: "time_range_picker",
}

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
