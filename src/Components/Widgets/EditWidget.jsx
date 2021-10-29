import { Modal, ModalVariant } from "@patternfly/react-core"
import React from "react"
import { useTranslation } from "react-i18next"
import { DataType, FieldType } from "../../Constants/Form"
import { WidgetType, WidgetTypeOptions } from "../../Constants/Widgets/Widgets"
import Editor from "../Editor/Editor"
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary"
import { updateFormItemsChartsPanel } from "./ChartsPanel/Edit"
import { updateFormItemsControlPanel } from "./ControlPanel/Edit"
import { updateFormItemsImagePanel } from "./ImagePanel/Edit"
import { updateFormItemsLightPanel } from "./LightPanel/Edit"
import { updateFormItemsUtilizationPanel } from "./UtilizationPanel/Edit"

const EditWidget = ({ showEditWidget, widgetConfig, onCancel, onChange, onSave }) => {
  const { t } = useTranslation()
  return (
    <Modal
      key="edit-widget"
      title={t("edit_widget_settings")}
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
      label: "title",
      fieldId: "title",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_title",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "show_title",
      fieldId: "showTitle",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "is_static",
      fieldId: "static",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "type",
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
