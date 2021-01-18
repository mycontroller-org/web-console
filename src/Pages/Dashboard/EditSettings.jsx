import React from "react"
import { Modal, ModalVariant } from "@patternfly/react-core"
import { DataType, FieldType } from "../../Components/Form/Constants"
import Editor from "../../Components/Editor/Editor"

const EditSettings = ({ showEditSettings, dashboard, onCancel, onChange, onSave }) => {
  return (
    <Modal
      key="edit-settings"
      title="Edit dashboard settings"
      variant={ModalVariant.medium}
      position="top"
      isOpen={showEditSettings}
      onClose={onCancel}
      onEscapePress={onCancel}
    >
      <Editor
        key="editor"
        language="yaml"
        rootObject={dashboard}
        onChangeFunc={onChange}
        onSaveFunc={onSave}
        minimapEnabled={false}
        onCancelFunc={onCancel}
        isWidthLimited={false}
        getFormItems={getFormItems}
      />
    </Modal>
  )
}

export default EditSettings

// support functions

const getFormItems = (_rootObject) => {
  const items = [
    {
      label: "Title",
      fieldId: "title",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid title. chars: min=2 and max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Description",
      fieldId: "description",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Favorite",
      fieldId: "favorite",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
  ]

  return items
}
