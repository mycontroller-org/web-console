import objectPath from "object-path"
import { DataType, FieldType } from "../../../../Constants/Form"
import { validate } from "../../../../Util/Validator"
import { getNodeConfigDisplayValue, nodeConfigUpdateButtonCallback } from "./NodeConfigUtils"

// get ESPHome config
export const getESPHomeItems = (rootObject) => {
  objectPath.set(rootObject, "provider.timeout", "5s", true)
  objectPath.set(rootObject, "provider.aliveCheckInterval", "15s", true)
  const items = [
    {
      label: "Configuration",
      fieldId: "!configuration_sm",
      fieldType: FieldType.Divider,
    },
    {
      label: "Connection Timeout",
      fieldId: "provider.timeout",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Alive Check Interval",
      fieldId: "provider.aliveCheckInterval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Password",
      fieldId: "provider.password",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    // {
    //   label: "Auto Discover",
    //   fieldId: "provider.autoDiscover",
    //   fieldType: FieldType.Switch,
    //   dataType: DataType.Boolean,
    //   value: false,
    //   isDisabled: true,
    // },
    {
      label: "Nodes",
      fieldId: "provider.nodes",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.Object,
      value: "",
      keyLabel: "Node ID",
      valueLabel: "Node Config",
      showUpdateButton: true,
      saveButtonText: "Update",
      updateButtonText: "Update",
      minimapEnabled: true,
      isRequired: false,
      validateKeyFunc: (key) => validate("isID", key),
      validateValueFunc: (value) => value.address !== undefined,
      valueField: getNodeConfigDisplayValue,
      updateButtonCallback: (cbIndex, cbItem, cbOnChange) =>
        nodeConfigUpdateButtonCallback(cbIndex, cbItem, cbOnChange),
    },
  ]
  return items
}
