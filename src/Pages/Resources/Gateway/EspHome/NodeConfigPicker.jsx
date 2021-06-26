import { Button, Modal, ModalVariant } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import objectPath from "object-path"
import React from "react"
import Editor from "../../../../Components/Editor/Editor"
import ErrorBoundary from "../../../../Components/ErrorBoundary/ErrorBoundary"
import { DataType, FieldType } from "../../../../Constants/Form"
import PropTypes from "prop-types"
import { getValue } from "../../../../Util/Util"

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
          title={"Update node: " + name}
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
  objectPath.set(rootObject, "address", "", true)
  objectPath.set(rootObject, "password", "", true)
  objectPath.set(rootObject, "timeout", "5s", true)
  objectPath.set(rootObject, "aliveCheckInterval", "15s", true)
  objectPath.set(rootObject, "reconnectDelay", "30s", true)

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
      label: "Address",
      fieldId: "address",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: false,
      helperText: "",
      helperTextInvalid: "Invalid address, example: node1.local:6053",
      validated: "default",
      validator: {
        isURL: {
          require_protocol: false,
          require_host: true,
          require_port: true,
          allow_underscores: true,
        },
      },
    },
    {
      label: "Password",
      fieldId: "password",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Connection Timeout",
      fieldId: "timeout",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Alive Check Interval",
      fieldId: "aliveCheckInterval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Reconnect Delay",
      fieldId: "reconnectDelay",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
  ]
  return items
}
