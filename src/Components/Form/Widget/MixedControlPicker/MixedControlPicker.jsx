import { Button, Modal, ModalVariant } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import objectPath from "object-path"
import React from "react"
import Editor from "../../../Editor/Editor"
import ErrorBoundary from "../../../ErrorBoundary/ErrorBoundary"
import { DataType, FieldType } from "../../../../Constants/Form"
import { ResourceTypeOptions, ResourceType } from "../../../../Constants/ResourcePicker"
import { validate } from "../../../../Util/Validator"
import PropTypes from "prop-types"
import {
  getOptionsDescriptionFunc,
  getResourceFilterFunc,
  getResourceOptionsAPI,
  getResourceOptionValueFunc,
} from "../../ResourcePicker/ResourceUtils"
import {
  ButtonType,
  ButtonTypeOptions,
  MixedControlType,
  MixedControlTypeOptions,
} from "../../../../Constants/Widgets/ControlPanel"
import { getValue } from "../../../../Util/Util"
import { DropDownPositionType, DropDownPositionTypeOptions } from "../../../../Constants/Common"

class MixedControlPicker extends React.Component {
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
    const { value, id, onChange } = this.props
    return (
      <>
        <Button key={"edit-btn-" + id} variant="control" onClick={this.onOpen}>
          <EditIcon />
        </Button>
        <Modal
          key={"edit-field-data" + id}
          title={"Update Resource"}
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
              getFormItems={(rootObject) => getItems(rootObject)}
              saveButtonText="Update"
            />
          </ErrorBoundary>
        </Modal>
      </>
    )
  }
}

MixedControlPicker.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  callerType: PropTypes.string,
}

export default MixedControlPicker

const getItems = (rootObject) => {
  const items = []
  items.push({
    label: "Resource Type",
    fieldId: "resource.type",
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    value: "",
    isRequired: true,
    isDisabled: false,
    helperText: "",
    helperTextInvalid: "Invalid type",
    validated: "default",
    options: ResourceTypeOptions,
    validator: { isNotEmpty: {} },
  })

  const resourceType = getValue(rootObject, "resource.type", "")

  if (resourceType !== "") {
    const resourceAPI = getResourceOptionsAPI(resourceType)
    const resourceOptionValueFunc = getResourceOptionValueFunc(resourceType)
    const resourceFilterFunc = getResourceFilterFunc(resourceType)
    const resourceDescriptionFunc = getOptionsDescriptionFunc(resourceType)
    items.push(
      {
        label: "Resource",
        fieldId: "resource.quickId",
        apiOptions: resourceAPI,
        optionValueFunc: resourceOptionValueFunc,
        fieldType: FieldType.SelectTypeAheadAsync,
        getFiltersFunc: resourceFilterFunc,
        getOptionsDescriptionFunc: resourceDescriptionFunc,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        isDisabled: false,
        helperText: "",
        helperTextInvalid: "Invalid type",
        validated: "default",
        options: [],
        validator: { isNotEmpty: {} },
      },
      {
        label: "Name Key",
        fieldId: "resource.nameKey",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "Invalid Name Key. chars: min=1 and max=100",
        validated: "default",
        validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
      },
      {
        label: "Timestamp Key",
        fieldId: "resource.valueTimestampKey",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: false,
      }
    )
  }

  if (resourceType === ResourceType.DataRepository) {
    items.push({
      label: "Selector",
      fieldId: "resource.selector",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "selector can not be empty",
      validated: "default",
      validator: { isNotEmpty: {} },
    })
  }

  items.push(
    {
      label: "Control Type",
      fieldId: "control.type",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: false,
      helperText: "",
      helperTextInvalid: "Invalid type",
      validated: "default",
      options: MixedControlTypeOptions,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Ask Confirmation",
      fieldId: "control.askConfirmation",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    }
  )

  const askConfirmation = getValue(rootObject, "control.askConfirmation", false)
  if (askConfirmation) {
    items.push({
      label: "Confirmation Message",
      fieldId: "control.confirmationMessage",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    })
  }

  const controlType = getValue(rootObject, "control.type", "")

  switch (controlType) {
    case MixedControlType.ToggleSwitch:
    case MixedControlType.ButtonSwitch:
      const toggleItems = getToggleSwitchItems(rootObject, controlType)
      items.push(...toggleItems)
      break

    case MixedControlType.PushButton:
      const pushButtonItems = getPushButtonItems(rootObject)
      items.push(...pushButtonItems)
      break

    case MixedControlType.Input:
      objectPath.set(rootObject, "control.config.input.minWidth", 70, true)
      items.push({
        label: "Width (px)",
        fieldId: "control.config.input.minWidth",
        fieldType: FieldType.Text,
        dataType: DataType.Integer,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "Invalid width",
        validated: "default",
        validator: { isInteger: { min: 1 } },
      })
      break

    case MixedControlType.SelectOptions:
    case MixedControlType.TabOptions:
      const selectOptionItems = getSelectOptionItems(rootObject, controlType)
      items.push(...selectOptionItems)
      break

    case MixedControlType.Slider:
      const sliderItems = getSliderItems(rootObject)
      items.push(...sliderItems)
      break

    default:
  }

  return items
}

const getToggleSwitchItems = (rootObject, controlType) => {
  objectPath.set(rootObject, "control.config.payloadOn", "true", true)
  objectPath.set(rootObject, "control.config.payloadOff", "false", true)

  const items = [
    {
      label: "Payload ON",
      fieldId: "control.config.payloadOn",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid payload",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Payload OFF",
      fieldId: "control.config.payloadOff",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid payload",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    },
  ]
  if (controlType === MixedControlType.ButtonSwitch) {
    objectPath.set(rootObject, "control.config.button.onText", "ON", true)
    objectPath.set(rootObject, "control.config.button.offText", "OFF", true)
    objectPath.set(rootObject, "control.config.button.onButtonType", ButtonType.Primary, true)
    objectPath.set(rootObject, "control.config.button.minWidth", 70, true)
    items.push(
      {
        label: "ON Text",
        fieldId: "control.config.button.onText",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "Invalid text",
        validated: "default",
        validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
      },
      {
        label: "OFF Text",
        fieldId: "control.config.button.offText",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "Invalid text",
        validated: "default",
        validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
      },
      {
        label: "ON Button",
        fieldId: "control.config.button.onButtonType",
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.String,
        value: "",
        options: ButtonTypeOptions,
        isRequired: true,
        helperText: "",
        validated: "default",
        helperTextInvalid: "Select a ON button type",
      },
      {
        label: "Width (px)",
        fieldId: "control.config.button.minWidth",
        fieldType: FieldType.Text,
        dataType: DataType.Integer,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "Invalid width",
        validated: "default",
        validator: { isInteger: { min: 1 } },
      }
    )
  }

  return items
}

const getPushButtonItems = (rootObject) => {
  objectPath.set(rootObject, "control.config.button.minWidth", 70, true)
  objectPath.set(rootObject, "control.config.button.buttonType", ButtonType.Primary, true)

  const items = [
    {
      label: "Payload",
      fieldId: "control.config.payload",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid payload",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    },

    {
      label: "Button Text",
      fieldId: "control.config.button.text",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid text",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Button",
      fieldId: "control.config.button.buttonType",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: ButtonTypeOptions,
      isRequired: true,
      helperText: "",
      validated: "default",
      helperTextInvalid: "Select a button type",
    },
    {
      label: "Width (px)",
      fieldId: "control.config.button.minWidth",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid width",
      validated: "default",
      validator: { isInteger: { min: 1 } },
    },
  ]

  return items
}

const getSelectOptionItems = (rootObject, controlType) => {
  const items = []

  if (controlType === MixedControlType.SelectOptions) {
    objectPath.set(rootObject, "control.config.dropDownPosition", DropDownPositionType.DOWN, true)

    items.push({
      label: "Drop Down Position",
      fieldId: "control.config.dropDownPosition",
      fieldType: FieldType.Select,
      dataType: DataType.String,
      value: "",
      disableClear: true,
      options: DropDownPositionTypeOptions,
    })
  }

  items.push({
    label: "Options",
    fieldId: "control.config.options",
    fieldType: FieldType.KeyValueMap,
    dataType: DataType.Object,
    value: {},
    keyLabel: "Value",
    valueLabel: "Display Text",
    validateKeyFunc: (value) => {
      return validate("isNotEmpty", value)
    },
  })
  return items
}

const getSliderItems = (rootObject) => {
  // default values
  objectPath.set(rootObject, "control.config.slider.min", 0, true)
  objectPath.set(rootObject, "control.config.slider.max", 100, true)
  objectPath.set(rootObject, "control.config.slider.step", 1, true)
  objectPath.set(rootObject, "control.config.slider.minWidth", 220, true)
  const items = []

  items.push(
    {
      label: "Minimum",
      fieldId: "control.config.slider.min",
      fieldType: FieldType.Text,
      dataType: DataType.Float,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid value",
      validated: "default",
      validator: { isFloat: {} },
    },
    {
      label: "Maximum",
      fieldId: "control.config.slider.max",
      fieldType: FieldType.Text,
      dataType: DataType.Float,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid value",
      validated: "default",
      validator: { isFloat: {} },
    },
    {
      label: "Step",
      fieldId: "control.config.slider.step",
      fieldType: FieldType.Text,
      dataType: DataType.Float,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid value",
      validated: "default",
      validator: { isFloat: {} },
    },
    {
      label: "Width (px)",
      fieldId: "control.config.slider.minWidth",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid width",
      validated: "default",
      validator: { isInteger: { min: 1 } },
    }
  )
  return items
}
