import { Button, Modal, ModalVariant } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import objectPath from "object-path"
import PropTypes from "prop-types"
import React from "react"
import { withTranslation } from "react-i18next"
import { DataType, FieldType } from "../../../Constants/Form"
import {
  BackupProviderType,
  BackupProviderTypeOptions,
  CallerType,
  FieldDataType,
  FieldDataTypeOptions,
  ResourceType,
  ResourceTypeOptions,
  StorageExportTypeOptions,
  TelegramParseModeOptions,
  WebhookMethodType,
  WebhookMethodTypeOptions,
} from "../../../Constants/ResourcePicker"
import { validate } from "../../../Util/Validator"
import Editor from "../../Editor/Editor"
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary"
import {
  getOptionsDescriptionFunc,
  getResourceFilterFunc,
  getResourceOptionsAPI,
  getResourceOptionValueFunc,
  getRootObject,
  updateValue,
} from "./ResourceUtils"

class ResourcePicker extends React.Component {
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
    const { value, id, name, onChange, callerType, t } = this.props
    return (
      <>
        <Button key={"edit-btn-" + id} variant="control" onClick={this.onOpen}>
          <EditIcon />
        </Button>
        <Modal
          key={"edit-field-data" + id}
          title={`${t("update_value")}: ${name}`}
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
              rootObject={getRootObject(value)}
              onSaveFunc={(rootObject) => {
                updateValue(rootObject, onChange, this.onClose)
              }}
              onChangeFunc={() => {}}
              minimapEnabled={false}
              onCancelFunc={this.onClose}
              isWidthLimited={false}
              getFormItems={(rootObject) => getItems(rootObject, callerType)}
              saveButtonText="update"
            />
          </ErrorBoundary>
        </Modal>
      </>
    )
  }
}

ResourcePicker.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  callerType: PropTypes.string,
}

export default withTranslation()(ResourcePicker)

const getItems = (rootObject, callerType) => {
  const FieldTypes = FieldDataTypeOptions.filter((t) => {
    if (callerType === CallerType.Variable) {
      switch (t.value) {
        case FieldDataType.TypeString:
        case FieldDataType.TypeResourceByLabels:
        case FieldDataType.TypeResourceByQuickId:
        case FieldDataType.TypeWebhook:
          return true
        default:
          return false
      }
    } else {
      return true
    }
  })

  const items = []

  if (callerType === CallerType.Parameter) {
    items.push({
      label: "disabled",
      fieldId: "disabled",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
      isDisabled: false,
    })
  }

  items.push({
    label: "data_type",
    fieldId: "type",
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    value: "",
    isRequired: true,
    isDisabled: false,
    helperText: "",
    helperTextInvalid: "helper_text.invalid_type",
    validated: "default",
    options: FieldTypes,
    validator: { isNotEmpty: {} },
    resetFields: { data: {}, string: "" },
  })

  const dataType = objectPath.get(rootObject, "type", FieldDataType.TypeString)

  switch (dataType) {
    case FieldDataType.TypeResourceByQuickId:
    case FieldDataType.TypeResourceByLabels:
      const resItems = getResourceDataItems(rootObject, dataType, callerType)
      items.push(...resItems)
      break

    case FieldDataType.TypeEmail:
      const emailItems = getEmailDataItems(rootObject)
      items.push(...emailItems)
      break

    case FieldDataType.TypeTelegram:
      const telegramItems = getTelegramDataItems(rootObject)
      items.push(...telegramItems)
      break

    case FieldDataType.TypeBackup:
      const exporterItems = getBackupItems(rootObject)
      items.push(...exporterItems)
      break

    case FieldDataType.TypeWebhook:
      const webhookItems = getWebhookItems(rootObject, callerType)
      items.push(...webhookItems)
      break

    default:
      items.push({
        label: "value",
        fieldId: "string",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
      })
  }

  return items
}

const getResourceDataItems = (rootObject = {}, dataType, callerType) => {
  const items = []
  items.push({
    label: "resource_type",
    fieldId: "data.resourceType",
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    value: "",
    isRequired: true,
    options: ResourceTypeOptions,
    validator: { isNotEmpty: {} },
  })

  const resourceType = objectPath.get(rootObject, "data.resourceType", "")

  switch (dataType) {
    case FieldDataType.TypeResourceByQuickId:
      if (resourceType !== "") {
        const resourceAPI = getResourceOptionsAPI(resourceType)
        const resourceOptionValueFunc = getResourceOptionValueFunc(resourceType)
        const resourceFilterFunc = getResourceFilterFunc(resourceType)
        const resourceDescriptionFunc = getOptionsDescriptionFunc(resourceType)
        items.push({
          label: "resource",
          fieldId: "data.quickId",
          apiOptions: resourceAPI,
          optionValueFunc: resourceOptionValueFunc,
          fieldType: FieldType.SelectTypeAheadAsync,
          getFiltersFunc: resourceFilterFunc,
          getOptionsDescriptionFunc: resourceDescriptionFunc,
          dataType: DataType.String,
          value: "",
          isRequired: true,
          options: [],
          validator: { isNotEmpty: {} },
        })
      }

      break

    case FieldDataType.TypeResourceByLabels:
      items.push({
        label: "labels",
        fieldId: "data.labels",
        fieldType: FieldType.Labels,
        dataType: DataType.Object,
        value: {},
      })
      break

    default:
    // no change
  }

  if (callerType === CallerType.Variable || resourceType === ResourceType.DataRepository) {
    items.push({
      label: "key_path",
      fieldId: "data.keyPath",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_key_path",
      validated: "default",
      validator: { isNotEmpty: {} },
    })
  }

  if (callerType === CallerType.Parameter) {
    items.push(
      {
        label: "payload",
        fieldId: "data.payload",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
      },
      {
        label: "pre_delay",
        fieldId: "data.preDelay",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
      }
    )
  }

  return items
}

const getEmailDataItems = (_rootObject) => {
  const items = [
    {
      label: "from",
      fieldId: "data.from",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      // validator: { isEmail: {} },
    },
    {
      label: "to",
      fieldId: "data.to",
      fieldType: FieldType.DynamicArray,
      dataType: DataType.ArrayString,
      validateValueFunc: (key) => {
        return validate("isEmail", key)
      },
      value: [],
    },
    {
      label: "subject",
      fieldId: "data.subject",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "body",
      fieldId: "data.body",
      fieldType: FieldType.TextArea,
      dataType: DataType.String,
      value: "",
    },
  ]
  return items
}

const getTelegramDataItems = (_rootObject) => {
  const items = [
    {
      label: "chat_ids",
      fieldId: "data.chatIds",
      fieldType: FieldType.DynamicArray,
      dataType: DataType.ArrayString,
      value: [],
    },
    {
      label: "parse_mode",
      fieldId: "data.parseMode",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: TelegramParseModeOptions,
    },
    {
      label: "text",
      fieldId: "data.text",
      fieldType: FieldType.TextArea,
      dataType: DataType.String,
      isRequired: true,
      value: "",
      helperText: "",
      helperTextInvalid: "helper_text.invalid_text",
      validated: "default",
      validator: { isNotEmpty: {} },
    },
  ]
  return items
}

const getBackupItems = (rootObject) => {
  const items = []
  items.push({
    label: "provider_type",
    fieldId: "data.providerType",
    isRequired: true,
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    options: BackupProviderTypeOptions,
    value: "",
    resetFields: { "data.spec": {} },
    validator: { isNotEmpty: {} },
  })

  const providerType = objectPath.get(rootObject, "data.providerType", "")
  switch (providerType) {
    case BackupProviderType.Disk:
      items.push(
        {
          label: "storage_export_type",
          fieldId: "data.spec.storageExportType",
          fieldType: FieldType.SelectTypeAhead,
          dataType: DataType.String,
          options: StorageExportTypeOptions,
          value: "",
          isRequired: false,
        },
        {
          label: "target_directory",
          fieldId: "data.spec.targetDirectory",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
          isRequired: false,
        },
        {
          label: "prefix",
          fieldId: "data.spec.prefix",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
          isRequired: false,
        },
        {
          label: "retention_count",
          fieldId: "data.spec.retentionCount",
          fieldType: FieldType.Text,
          dataType: DataType.Integer,
          value: "",
          isRequired: true,
          helperTextInvalid: "helper_text.invalid_backup_retention_count",
          validated: "default",
          validator: { isInteger: {} },
        }
      )
      break

    default:
  }

  return items
}

const getWebhookItems = (rootObject, callerType) => {
  const items = []

  objectPath.set(rootObject, "data.responseCode", 0, true)

  if (callerType === CallerType.Variable) {
    objectPath.set(rootObject, "data.method", WebhookMethodType.GET, true)
    items.push(
      {
        label: "url",
        fieldId: "data.server",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "helper_text.invalid_url",
        validated: "default",
        validator: { isNotEmpty: {}, isURL: {} },
      },
      {
        label: "insecure",
        fieldId: "data.insecure",
        fieldType: FieldType.Switch,
        dataType: DataType.Boolean,
        value: false,
      }
    )
  } else {
    objectPath.set(rootObject, "data.method", WebhookMethodType.POST, true)
    items.push(
      {
        label: "server",
        fieldId: "data.server",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: false,
      },
      {
        label: "api",
        fieldId: "data.api",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: false,
      }
    )
  }

  items.push(
    {
      label: "method",
      fieldId: "data.method",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: WebhookMethodTypeOptions,
      value: "",
      isRequired: false,
    },
    {
      label: "response_code",
      fieldId: "data.responseCode",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperTextInvalid: "helper_text.invalid_response_code",
      validated: "default",
      validator: { isInteger: {} },
    },
    {
      label: "headers",
      fieldId: "data.headers",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.ArrayObject,
      value: {},
      validateKeyFunc: (key) => validate("isNotEmpty", key, {}),
      validateValueFunc: (value) => validate("isNotEmpty", value, {}),
    },
    {
      label: "query_parameters",
      fieldId: "data.queryParameters",
      fieldType: FieldType.ScriptEditor,
      dataType: DataType.Object,
      language: "yaml",
      updateButtonText: "update_query_parameters",
      value: {},
      isRequired: false,
    }
  )

  const methodType = objectPath.get(rootObject, "data.method", "")

  if (methodType !== WebhookMethodType.GET) {
    items.push({
      label: "custom_data",
      fieldId: "data.customData",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
      isRequired: false,
    })

    const customData = objectPath.get(rootObject, "data.customData", false)
    if (customData) {
      items.push({
        label: "data",
        fieldId: "data.data",
        fieldType: FieldType.ScriptEditor,
        dataType: DataType.Object,
        language: "yaml",
        updateButtonText: "update_data",
        value: {},
        isRequired: false,
      })
    }
  }

  return items
}
