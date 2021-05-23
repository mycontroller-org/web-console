import { List, ListItem } from "@patternfly/react-core"

import React from "react"
import fileSize from "filesize"
import { getValue } from "../../Util/Util"

export const DisplayEnabled = ({ data, field, defaultValue = false }) => {
  const value = getValue(data, field, defaultValue)
  return <span>{value ? "enabled" : "disabled"}</span>
}

export const DisplayTrue = ({ data, field, defaultValue = false }) => {
  const value = getValue(data, field, defaultValue)
  return <span>{value ? "true" : "false"}</span>
}

export const DisplaySuccess = ({ data, field, defaultValue = false }) => {
  const value = getValue(data, field, defaultValue)
  return <span>{value ? "success" : "failed"}</span>
}

export const DisplayList = ({ data, field, defaultValue = [] }) => {
  const values = getValue(data, field, defaultValue)
  const finalData = []
  if (Array.isArray(values)) {
    values.forEach((v) => {
      finalData.push(<ListItem key={v}>{v}</ListItem>)
    })
  }
  return <List>{finalData}</List>
}

export const FileSize = ({ bytes = 0 }) => {
  return <span>{fileSize(bytes, { standard: "iec" })}</span>
}

export const DisplayImage = ({ data = "" }) => {
  return <img width="200" height="200" src={data} />
}
