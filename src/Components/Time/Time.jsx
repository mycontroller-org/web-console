import React from "react"
import moment from "moment"
import { Tooltip } from "@patternfly/react-core"

export const LastSeen = ({ date }) => {
  const lastSeen = moment(date)
  return (
    <Tooltip position="left" content={lastSeen.format("DD-MMM-YYYY, hh:mm:ss A")}>
      <span>{lastSeen.fromNow()}</span>
    </Tooltip>
  )
}
