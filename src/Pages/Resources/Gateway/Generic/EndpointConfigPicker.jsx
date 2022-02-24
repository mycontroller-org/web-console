import { Button, Modal, ModalVariant } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import objectPath from "object-path"
import PropTypes from "prop-types"
import React from "react"
import Editor from "../../../../Components/Editor/Editor"
import ErrorBoundary from "../../../../Components/ErrorBoundary/ErrorBoundary"
import { DataType, FieldType } from "../../../../Constants/Form"
import { WebhookMethodTypeOptions } from "../../../../Constants/ResourcePicker"
import { validate } from "../../../../Util/Validator"

class EndpointConfigPicker extends React.Component {
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
    const { value, id, name, onChange, isNode } = this.props
    return (
      <>
        <Button key={"edit-btn-" + id} variant="control" onClick={this.onOpen}>
          <EditIcon />
        </Button>
        <Modal
          key={"edit-field-data" + id}
          title={`Update Endpoint: ${name}`}
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
              getFormItems={(rootObject) => getItems(rootObject, isNode)}
              saveButtonText="Update"
            />
          </ErrorBoundary>
        </Modal>
      </>
    )
  }
}

EndpointConfigPicker.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  isNode: PropTypes.bool,
}

export default EndpointConfigPicker

const getItems = (rootObject, isNode = false) => {
  if (!isNode) {
    objectPath.set(rootObject, "disabled", false, true)
    objectPath.set(rootObject, "includeGlobal", true, true)
  }

  objectPath.set(rootObject, "url", "", true)
  objectPath.set(rootObject, "method", "", true)
  objectPath.set(rootObject, "insecure", "", true)
  objectPath.set(rootObject, "responseCode", 0, true)
  objectPath.set(rootObject, "headers", {}, true)
  objectPath.set(rootObject, "queryParameters", {}, true)
  objectPath.set(rootObject, "body", {}, true)
  objectPath.set(rootObject, "script", "", true)

  const items = []

  if (!isNode) {
    items.push(
      {
        label: "disabled",
        fieldId: "disabled",
        fieldType: FieldType.Switch,
        dataType: DataType.Boolean,
        value: "",
        isRequired: false,
      },
      {
        label: "include_global",
        fieldId: "includeGlobal",
        fieldType: FieldType.Switch,
        dataType: DataType.Boolean,
        value: false,
      },
      {
        label: "execution_interval",
        fieldId: "executionInterval",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "helper_text.invalid_interval",
        validated: "default",
        validator: { isNotEmpty: {} },
      }
    )
  }

  items.push(
    {
      label: "url",
      fieldId: "url",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_url",
      validated: "default",
      validator: { isNotEmpty: {}, isURL: {} },
    },
    {
      label: "method",
      fieldId: "method",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: WebhookMethodTypeOptions,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "insecure",
      fieldId: "insecure",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "response_code",
      fieldId: "responseCode",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_data",
      validated: "default",
      validator: { isNotEmpty: {}, isInteger: {} },
    },
    {
      label: "headers",
      fieldId: "headers",
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
      fieldId: "queryParameters",
      fieldType: FieldType.ScriptEditor,
      dataType: DataType.Object,
      language: "yaml",
      updateButtonText: "update_query_parameters",
      value: {},
      isRequired: false,
    },
    {
      label: "body",
      fieldId: "body",
      fieldType: FieldType.ScriptEditor,
      dataType: DataType.Object,
      language: "yaml",
      updateButtonText: "update_body",
      value: {},
      isRequired: false,
    },
    {
      label: "script",
      fieldId: "script",
      fieldType: FieldType.ScriptEditor,
      dataType: DataType.String,
      value: "",
      saveButtonText: "update",
      updateButtonText: "update_script",
      language: "javascript",
      minimapEnabled: true,
      isRequired: false,
    }
  )
  return items
}
