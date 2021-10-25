import React from "react"
import { Modal, ModalVariant } from "@patternfly/react-core"
import { DataType, FieldType } from "../../Constants/Form"
import Editor from "../../Components/Editor/Editor"
import { useTranslation } from "react-i18next"

const EditSettings = ({ showEditSettings, dashboard, onCancel, /*onChange,*/ onSave }) => {
  const { t } = useTranslation()

  return (
    <Modal
      key="edit-settings"
      title={t("edit_dashboard_settings")}
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
        onChangeFunc={() => {}}
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

const getFormItems = (_rootObject, t = () => {}) => {
  const items = [
    {
      label: t("title"),
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
      label: t("description"),
      fieldId: "description",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: t("favorite"),
      fieldId: "favorite",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
  ]

  return items
}
