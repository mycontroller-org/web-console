import { List, ListItem } from "@patternfly/react-core"
import fileSize from "filesize"
import objectPath from "object-path"
import React from "react"

export const DisplayEnabled = ({ data, field, defaultValue = false }) => {
  const value = objectPath.get(data, field, defaultValue)
  return <span>{value ? "enabled" : "disabled"}</span>
}

export const DisplayTrue = ({ data, field, defaultValue = false }) => {
  const value = objectPath.get(data, field, defaultValue)
  return <span>{value ? "true" : "false"}</span>
}

export const DisplaySuccess = ({ data, field, defaultValue = false }) => {
  const value = objectPath.get(data, field, defaultValue)
  return <span>{value ? "success" : "failed"}</span>
}

export const DisplayList = ({ data, field, defaultValue = [] }) => {
  const values = objectPath.get(data, field, defaultValue)
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
