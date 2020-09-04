import React from "react"
import {
  CircleIcon,
  OutlinedCircleIcon,
  OkIcon,
  HelpIcon,
  ErrorCircleOIcon,
  ChevronCircleRightIcon,
} from "@patternfly/react-icons"

const iconFn = (Icon, color, onClickFn) => {
  return <Icon color={color} onClick={onClickFn} />
}

export const Enabled = ({ onClick }) => {
  return iconFn(CircleIcon, "#3f9c35", onClick)
}

export const Disabled = ({ onClick }) => {
  return iconFn(OutlinedCircleIcon, "#c00", onClick)
}

export const Up = ({ onClick }) => {
  return iconFn(OkIcon, "#3f9c35", onClick)
}

export const Down = ({ onClick }) => {
  return iconFn(ErrorCircleOIcon, "#c00", onClick)
}

export const Unavailable = ({ onClick }) => {
  return iconFn(HelpIcon, "gray", onClick)
}

export const DetailedView = ({ onClick }) => {
  return iconFn(ChevronCircleRightIcon, "#0088ce", onClick)
}

export const getStatus = (status) => {
  switch (status) {
    case "up":
      return <Up />
    case "down":
      return <Down />
    case "enabled":
      return <Enabled />
    case "disabled":
      return <Disabled />
    default:
      return <Unavailable />
  }
}

export const getStatusBool = (status) => {
  return <div>{getStatus(status ? "enabled" : "disabled")}</div>
}
