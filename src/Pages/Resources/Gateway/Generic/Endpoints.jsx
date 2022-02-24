import { TextInput } from "@patternfly/react-core"
import objectPath from "object-path"
import { DataType, FieldType } from "../../../../Constants/Form"
import { validate } from "../../../../Util/Validator"
import EndpointConfigPicker from "./EndpointConfigPicker"

// get http generic protocol items
export const getHttpGenericProtocolItems = (rootObject) => {
  objectPath.set(rootObject, "provider.protocol.headers", {}, true)
  objectPath.set(rootObject, "provider.protocol.queryParameters", {}, true)
  objectPath.set(rootObject, "provider.protocol.endpoints", {}, true)

  const items = [
    {
      label: "global",
      fieldId: "!global",
      fieldType: FieldType.Divider,
    },
    {
      label: "headers",
      fieldId: "provider.protocol.headers",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.ArrayObject,
      value: {},
      keyLabel: "header_name",
      valueLabel: "value",
      validateKeyFunc: (key) => validate("isNotEmpty", key, {}),
      validateValueFunc: (value) => validate("isNotEmpty", value, {}),
    },
    {
      label: "query_parameters",
      fieldId: "provider.protocol.queryParameters",
      fieldType: FieldType.ScriptEditor,
      dataType: DataType.Object,
      language: "yaml",
      updateButtonText: "update_query_parameters",
      value: {},
      isRequired: false,
    },
    {
      label: "endpoints",
      fieldId: "!endpoints",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "provider.protocol.endpoints",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.Object,
      value: "",
      keyLabel: "name",
      valueLabel: "endpoint",
      showUpdateButton: true,
      saveButtonText: "update",
      updateButtonText: "update",
      minimapEnabled: true,
      isRequired: false,
      validateKeyFunc: (key) => validate("isVariableKey", key),
      validateValueFunc: (value) => value.url !== undefined || value.url !== "",
      valueField: getEndpointConfigDisplayValue,
      updateButtonCallback: (cbIndex, cbItem, cbOnChange) =>
        endpointConfigUpdateButtonCallback(cbIndex, cbItem, cbOnChange),
    },
  ]
  return items
}

// display endpoint config button

// returns variable value to display value
export const getEndpointConfigDisplayValue = (index, value, _onChange, validated, _isDisabled) => {
  return (
    <TextInput
      id={"value_id_" + index}
      key={"value_" + index}
      value={`url:${value.url}`}
      isDisabled={true}
      validated={validated}
    />
  )
}

// calls the model to update the endpoint config details
export const endpointConfigUpdateButtonCallback = (index = 0, item = {}, onChange, isNode = false) => {
  return (
    <EndpointConfigPicker
      key={"picker_" + index}
      value={item.value}
      name={item.key}
      id={"model_" + index}
      onChange={(newValue) => {
        onChange(index, "value", newValue)
      }}
      isNode={isNode}
    />
  )
}
