import React from "react"
import { Modal, ModalVariant } from "@patternfly/react-core"
import { DataType, FieldType } from "../Form/Constants"
import { WidgetType } from "./Constants"
import Editor from "../Editor/Editor"

const EditWidget = ({ showEditWidget, widgetConfig, onCancel, onChange, onSave }) => {
  return (
    <Modal
      key="edit-widget"
      title="Edit widget settings"
      variant={ModalVariant.medium}
      position="top"
      isOpen={showEditWidget}
      onClose={onCancel}
      onEscapePress={onCancel}
    >
      <Editor
        key="editor"
        language="yaml"
        rootObject={widgetConfig}
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

export default EditWidget

// support functions

const getFormItems = (rootObject) => {
  const items = [
    {
      label: "Type",
      fieldId: "type",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isDisabled: true,
    },
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
      label: "Show Title",
      fieldId: "showTitle",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Is Static",
      fieldId: "static",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
  ]

  switch (rootObject.type) {
    case WidgetType.SwitchPanel:
      items.push(
        {
          label: "Labels",
          fieldId: "!labels",
          fieldType: FieldType.Divider,
        },
        {
          label: "",
          fieldId: "config.labels",
          fieldType: FieldType.Labels,
          dataType: DataType.Object,
          value: "",
        }
      )
      break

    default:
      break
  }

  return items
}
