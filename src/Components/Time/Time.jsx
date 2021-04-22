import React from "react"
import moment from "moment"
import { Tooltip } from "@patternfly/react-core"

export const LastSeen = ({ date="", tooltipPosition = "left" }) => {
  if (date === "" ){
    return <span></span>
  }
  const lastSeen = moment(date)
  const disabled = lastSeen.year() <= 1 // set "-" of zero year
  const value = disabled ? "-" : lastSeen.fromNow()
  return (
    <Tooltip
      position={tooltipPosition}
      content={lastSeen.format("DD-MMM-YYYY, hh:mm:ss A")}
      disabled={disabled}
    >
      <span>{value}</span>
    </Tooltip>
  )
}

export const getLastSeen = (date) => {
  const lastSeen = moment(date)
  const disabled = lastSeen.year() <= 1 // set "-" of zero year
  return disabled ? "-" : lastSeen.fromNow()
}
