import { Modal, ModalVariant } from "@patternfly/react-core"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import ErrorBoundary from "../../../Components/ErrorBoundary/ErrorBoundary"
import { DataType, FieldType } from "../../../Constants/Form"
import { StorageExportTypeOptions } from "../../../Constants/ResourcePicker"
import { api } from "../../../Service/Api"
import { validate } from "../../../Util/Validator"

const CustomModal = ({
  isOpen,
  modalType = "",
  onClose = () => {},
  saveBackupLocationsFunc = () => {},
  backupLocations = [],
}) => {
  const isBackupLocations = modalType === "backup_locations"
  const modalTitle = isBackupLocations ? "Backup Locations" : "Run a Backup"

  const editor = isBackupLocations
    ? getBackupLocationsEditor(backupLocations, onClose, saveBackupLocationsFunc)
    : getRunOnDemandBackupEditor(backupLocations, onClose)

  return (
    <Modal
      key="edit-widget-backup-settings"
      title={modalTitle}
      variant={ModalVariant.medium}
      position="top"
      isOpen={isOpen}
      onClose={onClose}
      onEscapePress={onClose}
    >
      <ErrorBoundary>{editor}</ErrorBoundary>
    </Modal>
  )
}
export default CustomModal

// export locations helper
const getBackupLocationsEditor = (backupLocations = {}, onClose, saveBackupLocationsFunc) => {
  return (
    <Editor
      key="import-export-editor"
      language="yaml"
      rootObject={{ locations: backupLocations }}
      onChangeFunc={() => {}}
      onSaveFunc={saveBackupLocationsFunc}
      minimapEnabled={true}
      onCancelFunc={onClose}
      isWidthLimited={false}
      getFormItems={getBackupLocationsItems}
    />
  )
}

// restore helper
const getRunOnDemandBackupEditor = (backupLocations, onClose) => {
  const locationOptions = getBackupLocations(backupLocations)
  return (
    <Editor
      key="import-export-editor"
      language="yaml"
      saveButtonText="Run Export"
      rootObject={{}}
      onChangeFunc={() => {}}
      onSaveFunc={(rootObject) => {
        api.backup
          .runOnDemandBackup(rootObject)
          .then((_res) => {
            onClose()
          })
          .catch((_e) => {
            onClose()
          })
      }}
      minimapEnabled={true}
      onCancelFunc={onClose}
      isWidthLimited={false}
      getFormItems={(rootObject) => getRunExportItems(rootObject, locationOptions)}
    />
  )
}

const getBackupLocations = (locations = {}) => {
  const names = Object.keys(locations)
  const options = names.map((name) => {
    return {
      value: locations[name],
      label: name,
    }
  })
  return options
}

// run export items
const getRunExportItems = (_rootObject = {}, locationOptions = []) => {
  return [
    {
      label: "Prefix",
      fieldId: "prefix",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperTextInvalid: "Invalid prefix name. chars: min=2, max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isKey: {} },
    },
    {
      label: "Storage Export Type",
      fieldId: "storageExportType",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: StorageExportTypeOptions,
      value: "",
      isRequired: true,
      helperTextInvalid: "Select a storage export type",
      validated: "default",
      validator: { isNotEmpty: {} },
    },
    {
      label: "Target Location",
      fieldId: "targetLocation",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: locationOptions,
      value: "",
      isRequired: true,
      helperTextInvalid: "Select a target location",
      validated: "default",
      validator: { isNotEmpty: {} },
    },
    {
      label: "Handler",
      fieldId: "handler",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperTextInvalid: "Invalid handler name. chars: min=2, max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isKey: {} },
    },
  ]
}

// export locations items
const getBackupLocationsItems = (_rootObject) => {
  const items = [
    {
      label: "Locations",
      fieldId: "!locations",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "locations",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.Object,
      value: {},
      keyLabel: "Name",
      valueLabel: "Location",
      validateKeyFunc: (value) => {
        return validate("isKey", value)
      },
    },
  ]

  return items
}
