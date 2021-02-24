import { Button, Modal, ModalVariant } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import objectPath from "object-path"
import React from "react"
import Editor from "../../Editor/Editor"
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary"
import { DataType, FieldType } from "../Constants"
import { ValueType, ValueTypeOptions, ResourceTypeOptions, CallerType } from "./Constants"
import {
  getOptionsDescriptionFunc,
  getResourceFilterFunc,
  getResourceOptionsAPI,
  getResourceOptionValueFunc,
  getRootObject,
  updateValue,
} from "./ResourceUtils"
import PropTypes from "prop-types"

class ResourcePicker extends React.Component {
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
    const { value, id, name, onChange, callerType } = this.props
    return (
      <>
        <Button key={"edit-btn-" + id} variant="control" onClick={this.onOpen}>
          <EditIcon />
        </Button>
        <Modal
          key={"edit-field-data" + id}
          title={"Update value: " + name}
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
              rootObject={getRootObject(value)}
              onSaveFunc={(rootObject) => {
                updateValue(rootObject, callerType, onChange, this.onClose)
              }}
              onChangeFunc={() => {}}
              minimapEnabled={false}
              onCancelFunc={this.onClose}
              isWidthLimited={false}
              getFormItems={(rootObject) => getItems(rootObject, callerType)}
              saveButtonText="Update"
            />
          </ErrorBoundary>
        </Modal>
      </>
    )
  }
}

ResourcePicker.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  callerType: PropTypes.string,
}

export default ResourcePicker

const getItems = (rootObject, callerType) => {
  const items = [
    {
      label: "Value Type",
      fieldId: "valueType",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: false,
      helperText: "",
      helperTextInvalid: "Invalid type",
      validated: "default",
      options: ValueTypeOptions,
      validator: { isNotEmpty: {} },
    },
  ]
  const valueType = objectPath.get(rootObject, "valueType", ValueType.TypeString)

  if (valueType === ValueType.TypeResourceByQuickID || valueType === ValueType.TypeResourceByLabels) {
    items.push({
      label: "Resource Type",
      fieldId: "resourceType",
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
  }

  switch (valueType) {
    case ValueType.TypeResourceByQuickID:
      const resourceType = objectPath.get(rootObject, "resourceType", "")
      const resourceAPI = getResourceOptionsAPI(resourceType)
      const resourceOptionValueFunc = getResourceOptionValueFunc(resourceType)
      const resourceFilterFunc = getResourceFilterFunc(resourceType)
      const resourceDescriptionFunc = getOptionsDescriptionFunc(resourceType)

      items.push({
        label: "Resource",
        fieldId: "quickId",
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
      })
      break

    case ValueType.TypeResourceByLabels:
      items.push({
        label: "Labels",
        fieldId: "labels",
        fieldType: FieldType.Labels,
        dataType: DataType.Object,
        value: {},
      })
      break

    default:
      items.push({
        label: "Value",
        fieldId: "value",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
      })
  }

  if (valueType === ValueType.TypeResourceByQuickID || valueType === ValueType.TypeResourceByLabels) {
    if (callerType === CallerType.Parameter) {
      items.push(
        {
          label: "Payload",
          fieldId: "payload",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
        },
        {
          label: "Pre Delay",
          fieldId: "preDelay",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
        }
      )
    } else if (callerType === CallerType.Variable) {
      items.push({
        label: "Selector",
        fieldId: "selector",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
      })
    }
  }
  return items
}
