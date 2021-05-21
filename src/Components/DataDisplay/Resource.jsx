import { Label, Tooltip } from "@patternfly/react-core"
import React from "react"
import { FieldDataType } from "../../Constants/ResourcePicker"
import { getRootObject } from "../Form/ResourcePicker/ResourceUtils"
import "./Resource.scss"

const DefaultType = "variable"

export const ResourceVariables = ({ data = [], originalType = DefaultType }) => {
  if (data === undefined || data === null) {
    return <span>No data</span>
  }
  const names = Object.keys(data)
  if (names.length === 0) {
    return <span>No data</span>
  }

  names.sort()

  const elements = names.map((name, index) => {
    const rootObject = getRootObject(data[name])
    return (
      <div className="mc-resource-variables" key={name + index}>
        <span className="key">{name}</span>
        <span className="value">{getResource(rootObject, originalType)}</span>
      </div>
    )
  })
  return elements
}

const getResource = (rootObject = {}, originalType) => {
  const data = rootObject.data
  switch (rootObject.type) {
    case FieldDataType.TypeString:
      return (
        <>
          <Label variant="outline" color="orange" icon={<IconType />}>
            String
          </Label>
          <Label variant="outline" color="grey" icon={<IconValue />}>
            {rootObject.string}
          </Label>
        </>
      )

    case FieldDataType.TypeResourceByQuickId:
      return getResourceByQuickId(data, originalType)

    case FieldDataType.TypeTelegram:
      return (
        <>
          <Label variant="outline" color="blue" icon={<IconType />}>
            Telegram
          </Label>
          <Label variant="outline" icon={<IconParseMode />}>
            {data.parseMode}
          </Label>
          <Label variant="outline" color="green" icon={<IconText />}>
            <pre>{data.text}</pre>
          </Label>
        </>
      )

    case FieldDataType.TypeBackup:
      return (
        <>
          <Label variant="outline" color="cyan" icon={<IconType />}>
            Backup
          </Label>
          <Label variant="outline" icon={<IconPrefix />}>
            {data.spec.prefix}
          </Label>
          <Label variant="outline" icon={<IconExport />}>
            {data.spec.storageExportType}
          </Label>
          <Label variant="outline" icon={<IconTargetDirectory />}>
            {data.spec.targetDirectory}
          </Label>
        </>
      )

    case FieldDataType.TypeWebhook:
      return (
        <>
          <Label variant="outline" color="cyan" icon={<IconType />}>
            Webhook
          </Label>
          <Label variant="outline" icon={<IconServer />}>
            {data.server}
          </Label>
          <Label variant="outline" icon={<IconAPI />}>
            {data.api}
          </Label>
        </>
      )

    case FieldDataType.TypeEmail:
      return (
        <>
          <Label variant="outline" color="cyan" icon={<IconType />}>
            Email
          </Label>
          <Label variant="outline" icon={<IconSubject />}>
            {data.subject}
          </Label>
          <Label variant="outline" icon={<IconBody />}>
            {data.body}
          </Label>
        </>
      )

    default:
      return String(rootObject)
  }
}

const getResourceByQuickId = (data, originalType) => {
  const items = [
    <Label variant="outline" color="orange" icon={<IconType />}>
      Resource
    </Label>,
    <Label variant="outline" icon={<IconQuickID />}>
      {`${data.resourceType}:${data.quickId}`}
    </Label>,
  ]
  if (originalType === DefaultType) {
    items.push(
      <Label variant="outline" color="green" icon={<IconSelector />}>
        {data.selector}
      </Label>
    )
  } else {
    items.push(
      <Label variant="outline" color="green" icon={<IconPayload />}>
        {data.payload}
      </Label>,
      <Label variant="outline" color="green" icon={<IconPreDelay />}>
        {data.preDelay}
      </Label>
    )
  }
  return items
}

const IconType = () => <RawIcon tooltip="Type" text="T" />
const IconValue = () => <RawIcon tooltip="Value" text="VL" />
const IconQuickID = () => <RawIcon tooltip="Quick ID" text="QID" />
const IconTargetDirectory = () => <RawIcon tooltip="Target Directory" text="TD" />
const IconParseMode = () => <RawIcon tooltip="Parse Mode" text="PM" />
const IconText = () => <RawIcon tooltip="Text" text="TXT" />
const IconPrefix = () => <RawIcon tooltip="Prefix" text="PFX" />
const IconExport = () => <RawIcon tooltip="Export" text="EXP" />
const IconPayload = () => <RawIcon tooltip="Payload" text="PL" />
const IconPreDelay = () => <RawIcon tooltip="Pre Delay" text="PDL" />
const IconSelector = () => <RawIcon tooltip="Selector" text="SL" />
const IconServer = () => <RawIcon tooltip="Server" text="SVR" />
const IconAPI = () => <RawIcon tooltip="API" text="API" />
const IconSubject = () => <RawIcon tooltip="Subject" text="SUB" />
const IconBody = () => <RawIcon tooltip="Body" text="BDY" />

const RawIcon = ({ tooltip = "", text = "" }) => {
  return (
    <Tooltip content={tooltip}>
      <span>
        <strong>{text}</strong>
      </span>
    </Tooltip>
  )
}
