import objectPath from "object-path"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Components/Form/Constants"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import {
  Provider,
  ProviderOptions,
  Protocol,
  MessageLogger,
  MessageLoggerOptions,
  filterProtocolOptions,
} from "../Constants"

class UpdatePage extends React.Component {
  render() {
    const { id } = this.props.match.params

    const isNewEntry = id === undefined || id === ""

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.gateway.get}
        apiSaveRecord={api.gateway.update}
        minimapEnabled
        onSaveRedirectFunc={() => {
          r(this.props.history, rMap.resources.gateway.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.resources.gateway.list)
        }}
        getFormItems={getFormItems}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="Add a Gateway" />
          <PageContent hasNoPaddingTop>{editor} </PageContent>
        </>
      )
    }
    return editor
  }
}

export default UpdatePage

// support functions

const getFormItems = (rootObject) => {
  const items = [
    {
      label: "ID",
      fieldId: "id",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid id. chars: min=2 and max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isID: {}, isNotEmpty: {} },
    },
    {
      label: "Name",
      fieldId: "name",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid name. chars: min=4 and max=100",
      validated: "default",
      validator: { isLength: { min: 4, max: 100 }, isNotEmpty: {} },
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
      validator: { isLabel: {} },
    },
    {
      label: "Provider",
      fieldId: "!provider.type",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "provider.type",
      isRequired: true,
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: ProviderOptions,
      validated: "error",
      value: "",
    },
  ]

  const providerType = objectPath.get(rootObject, "provider.type", "").toLowerCase()
  switch (providerType) {
    case Provider.MySensors:
      items.push(
        {
          label: "Internal Message Ack",
          fieldId: "provider.enableInternalMessageAck",
          fieldType: FieldType.Switch,
          dataType: DataType.Boolean,
          value: "",
        },
        {
          label: "Stream Message Ack",
          fieldId: "provider.enableStreamMessageAck",
          fieldType: FieldType.Switch,
          dataType: DataType.Boolean,
          value: "",
        },
        {
          label: "Retry Count",
          fieldId: "provider.retryCount",
          fieldType: FieldType.Text,
          dataType: DataType.Integer,
          value: "",
          validator: { isInt: { min: 0 } },
          helperTextInvalid: "Invalid Retry count. int, min=0",
        },
        {
          label: "Timeout",
          fieldId: "provider.timeout",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
        }
      )
      break
    default:
      break
  }

  if (providerType !== "") {
    items.push(
      {
        label: "Protocol",
        fieldId: "!provider.protocol.type",
        fieldType: FieldType.Divider,
      },
      {
        label: "Type",
        fieldId: "provider.protocol.type",
        isRequired: true,
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.String,
        options: filterProtocolOptions(providerType),
        value: "",
      },
      {
        label: "Transmit Pre Delay",
        fieldId: "provider.protocol.transmitPreDelay",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
      },
      {
        label: "Reconnect Delay",
        fieldId: "provider.protocol.reconnectDelay",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
      }
    )

    // protocol fields
    const protocolType = objectPath.get(rootObject, "provider.protocol.type", "").toLowerCase()
    switch (protocolType) {
      case Protocol.MQTT:
        items.push(
          {
            label: "Broker",
            fieldId: "provider.protocol.broker",
            isRequired: true,
            fieldType: FieldType.Text,
            dataType: DataType.String,
            value: "",
            validator: {
              isURL: {
                protocols: ["ws", "wss", "unix", "mqtt", "tcp", "ssl", "tls", "mqtts", "mqtt+ssl", "tcps"],
              },
            },
            helperTextInvalid: "Invalid Broker URL.",
          },
          {
            label: "Insecure Skip Verify",
            fieldId: "provider.protocol.insecureSkipVerify",
            fieldType: FieldType.Switch,
            dataType: DataType.Boolean,
            value: "",
          },
          {
            label: "Username",
            fieldId: "provider.protocol.username",
            fieldType: FieldType.Text,
            dataType: DataType.String,
            value: "",
          },
          {
            label: "Password",
            fieldId: "provider.protocol.password",
            fieldType: FieldType.Text,
            dataType: DataType.String,
            value: "",
          },
          {
            label: "Subscribe",
            fieldId: "provider.protocol.subscribe",
            isRequired: true,
            fieldType: FieldType.Text,
            dataType: DataType.String,
            value: "",
            helperTextInvalid: "Invalid Topic",
            validator: { isNotEmpty: {} },
          },
          {
            label: "Publish",
            fieldId: "provider.protocol.publish",
            isRequired: true,
            fieldType: FieldType.Text,
            dataType: DataType.String,
            value: "",
            helperTextInvalid: "Invalid Topic",
            validator: { isNotEmpty: {} },
          },
          {
            label: "QoS",
            fieldId: "provider.protocol.qos",
            isRequired: true,
            fieldType: FieldType.SelectTypeAhead,
            dataType: DataType.Integer,
            value: "",
            options: [
              { value: "0", label: "At most once (0)" },
              { value: "1", label: "At least once (1)" },
              { value: "2", label: "Exactly once (2)" },
            ],
          }
        )
        break

      case Protocol.Serial:
        items.push(
          {
            label: "Port Name",
            fieldId: "provider.protocol.portname",
            isRequired: true,
            fieldType: FieldType.Text,
            dataType: DataType.String,
            value: "",
          },
          {
            label: "Baud Rate",
            fieldId: "provider.protocol.baudrate",
            isRequired: true,
            fieldType: FieldType.Text,
            dataType: DataType.Integer,
            value: "",
            validator: { isBaudRate: {} },
            helperTextInvalid: "Invalid Baud rate.",
          }
        )
        break

      default:
        break
    }
  }

  // message logger
  items.push(
    {
      label: "Message Logger",
      fieldId: "!messageLogger.type",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "messageLogger.type",
      isRequired: true,
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: MessageLoggerOptions,
    }
  )

  // message logger properties
  const msgLoggerType = objectPath.get(rootObject, "messageLogger.type", "").toLowerCase()
  switch (msgLoggerType) {
    case MessageLogger.FileLogger:
      items.push(
        {
          label: "Flush Interval",
          fieldId: "messageLogger.flushInterval",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
        },
        {
          label: "Log Rotate Interval",
          fieldId: "messageLogger.logRotateInterval",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
        },
        {
          label: "Maximum Size",
          fieldId: "messageLogger.maxSize",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
        },
        {
          label: "Maximum Age",
          fieldId: "messageLogger.maxAge",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
        },
        {
          label: "Maximum Backup",
          fieldId: "messageLogger.maxBackup",
          fieldType: FieldType.Text,
          dataType: DataType.Integer,
          value: "",
          validator: { isInt: { min: 0 } },
          helperTextInvalid: "Invalid Maximum Backup. int, min=0",
        }
      )
      break

    default:
      break
  }

  return items
}
