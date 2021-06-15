import { Button, Modal, ModalVariant, TextInput } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import objectPath from "object-path"
import React from "react"
import Editor from "../../../../Components/Editor/Editor"
import ErrorBoundary from "../../../../Components/ErrorBoundary/ErrorBoundary"
import { DataType, FieldType } from "../../../../Constants/Form"
import PropTypes from "prop-types"
import DiskConfigPicker from "./DiskConfigPicker"
import { validate } from "../../../../Util/Validator"
import { DataUnitType, DataUnitTypeOptions } from "../../../../Constants/Metric"
import ProcessConfigPicker from "./ProcessConfigPicker"

class NodeConfigPicker extends React.Component {
  state = {
    isOpen: false,
  }

  onClose = () => {
    this.setState({ isOpen: false })
  }

  onOpen = () => {
    this.setState({ isOpen: true })
  }

  render() {
    const { isOpen } = this.state
    const { value, id, name, onChange } = this.props
    return (
      <>
        <Button key={"edit-btn-" + id} variant="control" onClick={this.onOpen}>
          <EditIcon />
        </Button>
        <Modal
          key={"edit-field-data" + id}
          title={`Update Node: ${name}`}
          variant={ModalVariant.medium}
          position="top"
          isOpen={isOpen}
          onClose={this.onClose}
          onEscapePress={this.onClose}
        >
          <ErrorBoundary>
            <Editor
              key={"editor" + id}
              disableEditor={false}
              language="yaml"
              rootObject={value}
              onSaveFunc={(rootObject) => {
                onChange(rootObject)
                this.onClose()
              }}
              onChangeFunc={() => {}}
              minimapEnabled={false}
              onCancelFunc={this.onClose}
              isWidthLimited={false}
              getFormItems={getItems}
              saveButtonText="Update"
            />
          </ErrorBoundary>
        </Modal>
      </>
    )
  }
}

NodeConfigPicker.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
}

export default NodeConfigPicker

const getItems = (rootObject) => {
  objectPath.set(rootObject, "disabled", false, true)

  objectPath.set(rootObject, "memory.memoryDisabled", false, true)
  objectPath.set(rootObject, "memory.swapDisabled", false, true)
  objectPath.set(rootObject, "memory.unit", DataUnitType.MiB, true)
  objectPath.set(rootObject, "memory.interval", "60s", true)

  objectPath.set(rootObject, "cpu.cpuDisabled", false, true)
  objectPath.set(rootObject, "cpu.perCpuDisabled", true, true)
  objectPath.set(rootObject, "cpu.interval", "60s", true)

  objectPath.set(rootObject, "temperature.disabledAll", false, true)
  objectPath.set(rootObject, "temperature.interval", "30s", true)
  objectPath.set(rootObject, "temperature.enabled", [], true)

  objectPath.set(rootObject, "disk.disabled", false, true)
  objectPath.set(rootObject, "disk.interval", "30m", true)
  objectPath.set(rootObject, "disk.data", {}, true)

  objectPath.set(rootObject, "process.disabled", false, true)
  objectPath.set(rootObject, "process.interval", "60s", true)
  objectPath.set(rootObject, "process.data", {}, true)

  const items = [
    {
      label: "Disabled",
      fieldId: "disabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
      isRequired: false,
    },
    {
      label: "Memory",
      fieldId: "!memory",
      fieldType: FieldType.Divider,
    },
    {
      label: "Memory Disabled",
      fieldId: "memory.memoryDisabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
      isRequired: false,
    },
    {
      label: "Swap Disabled",
      fieldId: "memory.swapDisabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
      isRequired: false,
    },
    {
      label: "Unit",
      fieldId: "memory.unit",
      fieldType: FieldType.Select,
      dataType: DataType.String,
      value: "",
      isRequired: false,
      options: DataUnitTypeOptions,
    },
    {
      label: "Metric Interval",
      fieldId: "memory.interval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "CPU",
      fieldId: "!cpu",
      fieldType: FieldType.Divider,
    },
    {
      label: "CPU Disabled",
      fieldId: "cpu.cpuDisabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
      isRequired: false,
    },
    {
      label: "Per CPU Disabled",
      fieldId: "cpu.perCpuDisabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
      isRequired: false,
    },

    {
      label: "Metric Interval",
      fieldId: "cpu.interval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Temperature",
      fieldId: "!temperature",
      fieldType: FieldType.Divider,
    },
    {
      label: "Disabled All",
      fieldId: "temperature.disabledAll",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
      isRequired: false,
    },
    {
      label: "Metric Interval",
      fieldId: "temperature.interval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Enabled",
      fieldId: "temperature.enabled",
      fieldType: FieldType.DynamicArray,
      dataType: DataType.ArrayString,
      value: "",
      isRequired: false,
    },
    {
      label: "Disk",
      fieldId: "!disk",
      fieldType: FieldType.Divider,
    },
    {
      label: "Disabled",
      fieldId: "disk.disabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
      isRequired: false,
    },
    {
      label: "Metric Interval",
      fieldId: "disk.interval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Disks",
      fieldId: "disk.data",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.Object,
      value: "",
      keyLabel: "Source ID",
      valueLabel: "Config",
      showUpdateButton: true,
      saveButtonText: "Update",
      updateButtonText: "Update",
      minimapEnabled: true,
      isRequired: false,
      validateKeyFunc: (key) => validate("isID", key),
      validateValueFunc: (value) => value.path !== undefined,
      valueField: getDiskConfigDisplayValue,
      updateButtonCallback: (cbIndex, cbItem, cbOnChange) =>
        diskConfigUpdateButtonCallback(cbIndex, cbItem, cbOnChange),
    },
    {
      label: "Process",
      fieldId: "!process",
      fieldType: FieldType.Divider,
    },
    {
      label: "Disabled",
      fieldId: "process.disabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
      isRequired: false,
    },
    {
      label: "Metric Interval",
      fieldId: "process.interval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Processes",
      fieldId: "process.data",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.Object,
      value: "",
      keyLabel: "Source ID",
      valueLabel: "Config",
      showUpdateButton: true,
      saveButtonText: "Update",
      updateButtonText: "Update",
      minimapEnabled: true,
      isRequired: false,
      validateKeyFunc: (key) => validate("isID", key),
      validateValueFunc: (value) => value.filter !== undefined && validate("isNotEmpty", value.filter),
      valueField: getProcessConfigDisplayValue,
      updateButtonCallback: (cbIndex, cbItem, cbOnChange) =>
        processConfigUpdateButtonCallback(cbIndex, cbItem, cbOnChange),
    },
  ]
  return items
}

// returns variable value to display on the disks list
export const getDiskConfigDisplayValue = (index, value, _onChange, validated, _isDisabled) => {
  return (
    <TextInput
      id={"value_id_" + index}
      key={"value_" + index}
      value={value.path}
      isDisabled={true}
      validated={validated}
    />
  )
}

// calls the model to update the disk config details
export const diskConfigUpdateButtonCallback = (index = 0, item = {}, onChange) => {
  return (
    <DiskConfigPicker
      key={"picker_" + index}
      value={item.value}
      name={item.key}
      id={"model_" + index}
      onChange={(newValue) => {
        onChange(index, "value", newValue)
      }}
    />
  )
}

// returns variable value to display on the disks list
export const getProcessConfigDisplayValue = (index, value, _onChange, validated, _isDisabled) => {
  return (
    <TextInput
      id={"value_id_" + index}
      key={"value_" + index}
      value={JSON.stringify(value.filter)}
      isDisabled={true}
      validated={validated}
    />
  )
}

// calls the model to update the disk config details
export const processConfigUpdateButtonCallback = (index = 0, item = {}, onChange) => {
  return (
    <ProcessConfigPicker
      key={"picker_" + index}
      value={item.value}
      name={item.key}
      id={"model_" + index}
      onChange={(newValue) => {
        onChange(index, "value", newValue)
      }}
    />
  )
}
