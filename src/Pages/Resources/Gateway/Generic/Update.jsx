import { DataType, FieldType } from "../../../../Constants/Form"
import { validate } from "../../../../Util/Validator"
import { endpointConfigUpdateButtonCallback, getEndpointConfigDisplayValue } from "./Endpoints"

// get System Monitoring config
export const getGenericHttpItems = (_rootObject) => {
  const items = [
    {
      label: "node_endpoints",
      fieldId: "!node_endpoints",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "provider.nodes",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.Object,
      value: "",
      keyLabel: "node_id",
      valueLabel: "endpoint",
      showUpdateButton: true,
      saveButtonText: "update",
      updateButtonText: "update",
      minimapEnabled: true,
      isRequired: false,
      validateKeyFunc: (key) => validate("isID", key),
      validateValueFunc: (value) => value.url !== undefined || value.url !== "",
      valueField: getEndpointConfigDisplayValue,
      updateButtonCallback: (cbIndex, cbItem, cbOnChange) =>
        endpointConfigUpdateButtonCallback(cbIndex, cbItem, cbOnChange, true),
    },
  ]
  return items
}
