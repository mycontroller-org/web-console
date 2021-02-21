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