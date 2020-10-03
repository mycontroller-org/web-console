import React from "react"
import moment from "moment"

import "./LastUpdate.scss"

const LastUpdate = ({ time }) => {
  const lastUpdate = moment(time)
  return (
    <span className="mc-last-update">
      Last Update: <i>{lastUpdate.fromNow()} ({lastUpdate.format('MMM Do YYYY, HH:mm:ss')})</i>
    </span>
  )
}

export default LastUpdate
