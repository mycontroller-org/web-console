import React from "react"
import { Modal, ModalVariant } from "@patternfly/react-core"
import { DataType, FieldType } from "../../Constants/Form"
import { WidgetType, WidgetTypeOptions } from "../../Constants/Widgets/Widgets"
import Editor from "../Editor/Editor"
import { updateFormItemsUtilizationPanel } from "./UtilizationPanel/Edit"
import { updateFormItemsControlPanel } from "./ControlPanel/Edit"
import { updateFormItemsLightPanel } from "./LightPanel/Edit"
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary"
import { updateFormItemsImagePanel } from "./ImagePanel/Edit"
import { updateFormItemsChartsPanel } from "./ChartsPanel/Edit"

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
      <ErrorBoundary>
        <Editor
          key="editor"
          language="yaml"
          rootObject={widgetConfig}
          onChangeFunc={() => {}} // ignore on change to improve performance of panel
          onSaveFunc={onSave}
          minimapEnabled={false}
          onCancelFunc={onCancel}
          isWidthLimited={false}
          getFormItems={getFormItems}
        />
      </ErrorBoundary>
    </Modal>
  )
}

export default EditWidget

// support functions

const getFormItems = (rootObject) => {
  const items = getPanelSettingsItems(rootObject)

  switch (rootObject.type) {
    case WidgetType.ChartsPanel:
      updateFormItemsChartsPanel(rootObject, items)
      break

    case WidgetType.ControlPanel:
      updateFormItemsControlPanel(rootObject, items)
      break

    case WidgetType.EmptyPanel:
      // noop
      break

    case WidgetType.ImagePanel:
      updateFormItemsImagePanel(rootObject, items)
      break

    case WidgetType.LightPanel:
      updateFormItemsLightPanel(rootObject, items)
      break

    case WidgetType.UtilizationPanel:
      updateFormItemsUtilizationPanel(rootObject, items)
      break

    default:
      break
  }

  return items
}

const getPanelSettingsItems = (_rootObject) => {
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
    {
      label: "Type",
      fieldId: "type",
      fieldType: FieldType.SelectTypeAhead,
      direction: "down",
      dataType: DataType.String,
      value: "",
      options: WidgetTypeOptions,
      isRequired: true,
      resetFields: { config: {} },
    },
  ]
  return items
}
