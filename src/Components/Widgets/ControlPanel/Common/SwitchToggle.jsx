import React from "react"
import { Switch as PfSwitch } from "@patternfly/react-core"
import { api } from "../../../../Service/Api"

const SwitchToggle = ({
  id,
  widgetId,
  quickId,
  payload,
  payloadOn = "true",
  payloadOff = "false",
  sendPayloadWrapper = () => {},
}) => {
  const isChecked = String(payload) === payloadOn
  return (
    <PfSwitch
      id={`${widgetId}_${id}`}
      onChange={(newState) => sendPayloadWrapper(() => onChange(newState, quickId, payloadOn, payloadOff))}
      isChecked={isChecked}
    />
  )
}

const onChange = (isChecked, quickId, payloadOn, payloadOff) => {
  api.action.send({ resource: quickId, payload: isChecked ? payloadOn : payloadOff })
}

export default SwitchToggle
