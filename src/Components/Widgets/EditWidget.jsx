import React from "react"
import { Button, Modal, ModalVariant } from "@patternfly/react-core"
import { Form } from "../Form/Form"
import { DataType, FieldType } from "../Form/Constants"
import { WidgetType } from "./Constants"

const EditWidget = ({ showEditWidget, widget, onCancel, onChange, onSave }) => {
  const items = [
    {
      label: "Title",
      fieldId: "title",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: widget.title,
      isRequired: true,
      helperText: "",
      helperTextInvalid: "error",
      validated: "default",
    },
    {
      label: "Show Title",
      fieldLabel: "",
      fieldId: "showTitle",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: widget.showTitle,
      isRequired: false,
      helperText: "hello",
      helperTextInvalid: "",
      validated: "error",
    },
    {
      label: "Is Static",
      fieldLabel: "disable draggable and resizable feature",
      fieldId: "static",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: widget.static,
      isRequired: false,
      helperText: "hello",
      helperTextInvalid: "",
      validated: "error",
    },
  ]
  updateItems(widget, items)
  return (
    <Modal
      key="edit-widget"
      title="Edit widget settings"
      variant={ModalVariant.medium}
      position="top"
      isOpen={showEditWidget}
      onClose={onCancel}
      actions={[
        <Button key="confirm" variant="primary" onClick={onSave}>
          Update
        </Button>,
        <Button key="cancel" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
      onEscapePress={onCancel}
    >
      <Form key="form" items={items} isHorizontal onChange={onChange} />
    </Modal>
  )
}

export default EditWidget

// support functions

const updateItems = (widget, items) => {
  const config = widget.config
  //console.log(widget)
  switch (widget.type) {
    case WidgetType.SwitchPanel:
      items.push({
        label: "Labels",
        fieldId: "config.labels",
        fieldType: FieldType.Labels,
        value: config.labels,
        isRequired: false,
      })
      break

    default:
      break
  }
}
