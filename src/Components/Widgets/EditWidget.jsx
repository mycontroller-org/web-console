import React from "react"
import PropTypes from "prop-types"
import { Button, Modal, ModalVariant } from "@patternfly/react-core"
import { Form } from "../Form/Form"
import { DataType, FieldType } from "../Form/Constants"
import { WidgetType } from "./Constants"

class EditWidget extends React.Component {
  onChange = (item, data) => {
    console.log("item", item, "data", data)
  }

  render() {
    const { showEditWidget, widget, onCancel } = this.props
    const items = [
      {
        label: "Title",
        fieldId: "title",
        fieldType: FieldType.text,
        dataType: DataType.string,
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
        fieldType: FieldType.checkbox,
        dataType: DataType.boolean,
        value: false,
        isRequired: false,
        helperText: "hello",
        helperTextInvalid: "",
        validated: "error",
      },
      {
        label: "Is Static",
        fieldLabel: "disable draggable and resizable feature",
        fieldType: FieldType.checkbox,
        dataType: DataType.boolean,
        value: false,
        isRequired: false,
        helperText: "hello",
        helperTextInvalid: "",
        validated: "error",
      },
    ]
    updateItems(widget, items)
    return (
      <Modal
        title="Edit widget settings"
        variant={ModalVariant.medium}
        isOpen={showEditWidget}
        onClose={onCancel}
        actions={[
          <Button key="confirm" variant="primary" onClick={onCancel}>
            Update
          </Button>,
          <Button key="cancel" variant="link" onClick={onCancel}>
            Cancel
          </Button>,
        ]}
        onEscapePress={onCancel}
      >
        <Form items={items} isHorizontal onChange={this.onChange} />
      </Modal>
    )
  }
}

EditWidget.prototypes = {
  widget: PropTypes.object,
  onUpdate: PropTypes.func,
  onCancel: PropTypes.func,
  showEditWidget: PropTypes.bool,
}

export default EditWidget

// support functions

const updateItems = (widget, items) => {
  const config = widget.config
  console.log(widget)
  switch (widget.type) {
    case WidgetType.SwitchPanel:
      items.push({
        label: "Labels",
        fieldId: "labels",
        fieldType: FieldType.labels,
        value: config.labels,
        isRequired: false,
      })
  }
}
