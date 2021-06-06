import objectPath from "object-path"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Constants/Form"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { HandlerType, HandlerTypeOptions } from "../../../Constants/Handler"
import {
  BackupProviderType,
  BackupProviderTypeOptions,
  StorageExportTypeOptions,
  WebhookMethodTypeOptions,
} from "../../../Constants/ResourcePicker"
import { validate } from "../../../Util/Validator"

class UpdatePage extends React.Component {
  render() {
    const { id } = this.props.match.params

    const isNewEntry = id === undefined || id === ""

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.handler.get}
        apiSaveRecord={api.handler.update}
        minimapEnabled
        onSaveRedirectFunc={() => {
          r(this.props.history, rMap.operations.handler.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.operations.handler.list)
        }}
        getFormItems={(rootObject) => getFormItems(rootObject, id)}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="Add a Handler" />
          <PageContent hasNoPaddingTop>{editor} </PageContent>
        </>
      )
    }
    return editor
  }
}

export default UpdatePage

// support functions

const getFormItems = (rootObject, id) => {
  const items = [
    {
      label: "ID",
      fieldId: "id",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: id ? true : false,
      helperText: "",
      helperTextInvalid: "Invalid id. chars: min=4, max=100, and space not allowed",
      validated: "default",
      validator: { isLength: { min: 4, max: 100 }, isNotEmpty: {}, isID: {} },
    },
    {
      label: "Description",
      fieldId: "description",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Enabled",
      fieldId: "enabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Labels",
      fieldId: "!labels",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "labels",
      fieldType: FieldType.Labels,
      dataType: DataType.Object,
      value: {},
    },
    {
      label: "",
      fieldId: "!labels_end",
      fieldType: FieldType.Divider,
    },
    {
      label: "Handler Type",
      fieldId: "type",
      isRequired: true,
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: HandlerTypeOptions,
      value: "",
      resetFields: { spec: {} },
      validator: { isNotEmpty: {} },
    },
  ]

  const handlerType = objectPath.get(rootObject, "type", "")

  switch (handlerType) {
    case HandlerType.Email:
      items.push(
        {
          label: "Host",
          fieldId: "spec.host",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
          isRequired: true,
          helperTextInvalid: "Invalid host name. chars: min=2, max=100",
          validated: "default",
          validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
        },
        {
          label: "Port",
          fieldId: "spec.port",
          fieldType: FieldType.Text,
          dataType: DataType.Integer,
          value: "",
          isRequired: true,
          helperTextInvalid: "Invalid port number",
          validated: "default",
          validator: { isPort: {}, isNotEmpty: {} },
        },
        {
          label: "Insecure Skip Verify",
          fieldId: "spec.insecureSkipVerify",
          fieldType: FieldType.Switch,
          dataType: DataType.Boolean,
          value: false,
        },
        {
          label: "Username",
          fieldId: "spec.username",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
          isRequired: false,
        },
        {
          label: "Password",
          fieldId: "spec.password",
          fieldType: FieldType.Password,
          dataType: DataType.String,
          value: "",
          isRequired: false,
        },
        {
          label: "From Email",
          fieldId: "spec.fromEmail",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
          isRequired: false,
        },
        {
          label: "To Emails",
          fieldId: "spec.toEmails",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
          isRequired: false,
        }
      )
      break

    case HandlerType.Telegram:
      items.push(
        {
          label: "Token",
          fieldId: "spec.token",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
          isRequired: true,
          helperTextInvalid: "Enter a telegram token",
          validated: "default",
          validator: { isNotEmpty: {} },
        },
        {
          label: "Chat IDs",
          fieldId: "spec.chatIds",
          fieldType: FieldType.DynamicArray,
          dataType: DataType.ArrayString,
          value: [],
        }
      )
      break

    case HandlerType.Webhook:
      const webhookItems = getWebhookItems(rootObject)
      items.push(...webhookItems)
      break

    case HandlerType.Backup:
      const exporterItems = getBackupItems(rootObject)
      items.push(...exporterItems)
      break

    default:
  }

  return items
}

const getWebhookItems = (rootObject) => {
  objectPath.set(rootObject, "spec.allowOverride", true, true)
  objectPath.set(rootObject, "spec.responseCode", 0, true)

  const items = [
    {
      label: "Server",
      fieldId: "spec.server",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperTextInvalid: "Enter a server url",
      validated: "default",
      validator: { isNotEmpty: {}, isURL: {} },
    },
    {
      label: "API",
      fieldId: "spec.api",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperTextInvalid: "Enter a api",
      validated: "default",
      validator: { isNotEmpty: {} },
    },
    {
      label: "Method",
      fieldId: "spec.method",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: WebhookMethodTypeOptions,
      value: "",
      isRequired: true,
      helperTextInvalid: "Select a method",
      validated: "default",
      validator: { isNotEmpty: {} },
    },
    {
      label: "Skip Insecure Verify",
      fieldId: "spec.skipInsecureVerify",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
    },
    {
      label: "Response Code",
      fieldId: "spec.responseCode",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperTextInvalid: "Enter a response code, enter 0 to ignore",
      validated: "default",
      validator: { isInteger: {} },
    },
    {
      label: "Headers",
      fieldId: "spec.headers",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.ArrayObject,
      value: {},
      validateKeyFunc: (key) => validate("isNotEmpty", key, {}),
      validateValueFunc: (value) => validate("isNotEmpty", value, {}),
    },
    {
      label: "Query Parameters",
      fieldId: "spec.queryParameters",
      fieldType: FieldType.ScriptEditor,
      dataType: DataType.Object,
      language: "yaml",
      updateButtonText: "Update Query Parameters",
      value: {},
      isRequired: false,
    },
    {
      label: "Allow Overwrite",
      fieldId: "spec.allowOverwrite",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
    },
  ]

  return items
}

const getBackupItems = (rootObject) => {
  const items = []
  items.push({
    label: "Provider Type",
    fieldId: "spec.providerType",
    isRequired: true,
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    options: BackupProviderTypeOptions,
    value: "",
    resetFields: { "spec.spec": {} },
    validator: { isNotEmpty: {} },
  })

  const providerType = objectPath.get(rootObject, "spec.providerType", "")

  switch (providerType) {
    case BackupProviderType.Disk:
      items.push(
        {
          label: "Export Type",
          fieldId: "spec.spec.storageExportType",
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
          label: "Target Directory",
          fieldId: "spec.spec.targetDirectory",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
          isRequired: true,
          helperTextInvalid: "Enter a directory",
          validated: "default",
          validator: { isNotEmpty: {} },
        },
        {
          label: "Prefix",
          fieldId: "spec.spec.prefix",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
          isRequired: true,
          helperTextInvalid: "Enter a prefix",
          validated: "default",
          validator: { isNotEmpty: {}, isKey: {} },
        },
        {
          label: "Retention Count",
          fieldId: "spec.spec.retentionCount",
          fieldType: FieldType.Text,
          dataType: DataType.Integer,
          value: "",
          isRequired: true,
          helperTextInvalid: "Enter a retention count, 0 for no limit",
          validated: "default",
          validator: { isInteger: {} },
        }
      )
      break

    default:
  }

  return items
}
