import { Button, Modal, ModalVariant } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import objectPath from "object-path"
import React from "react"
import Editor from "../../../../Components/Editor/Editor"
import ErrorBoundary from "../../../../Components/ErrorBoundary/ErrorBoundary"
import { DataType, FieldType } from "../../../../Constants/Form"
import PropTypes from "prop-types"
import { DataUnitType, DataUnitTypeOptions } from "../../../../Constants/Metric"

class DiskConfigPicker extends React.Component {
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
          title={"Update disk: " + name}
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
              getFormItems={(rootObject) => getItems(rootObject, name)}
              saveButtonText="Update"
            />
          </ErrorBoundary>
        </Modal>
      </>
    )
  }
}

DiskConfigPicker.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
}

export default DiskConfigPicker

const getItems = (rootObject, sourceId) => {
  objectPath.set(rootObject, "disabled", false, true)
  objectPath.set(rootObject, "name", sourceId, true)
  objectPath.set(rootObject, "path", "", true)
  objectPath.set(rootObject, "unit", DataUnitType.MiB, true)

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
      label: "Name",
      fieldId: "name",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Path",
      fieldId: "path",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: false,
      helperText: "",
      helperTextInvalid: "invalid path",
      validated: "default",
      validator: { isLength: { min: 1 }, isNotEmpty: {} },
    },
    {
      label: "Unit",
      fieldId: "unit",
      fieldType: FieldType.Select,
      dataType: DataType.String,
      value: "",
      isRequired: false,
      options: DataUnitTypeOptions,
    },
  ]
  return items
}
