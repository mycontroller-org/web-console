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
  selector = "",
  sendPayloadWrapper = () => {},
}) => {
  const isChecked = String(payload) === payloadOn
  return (
    <PfSwitch
      id={`${widgetId}_${id}`}
      aria-label={`${widgetId}_${id}`}
      onChange={(newState) =>
        sendPayloadWrapper(() => onChange(newState, quickId, selector, payloadOn, payloadOff))
      }
      isChecked={isChecked}
    />
  )
}

const onChange = (isChecked, quickId, selector, payloadOn, payloadOff) => {
  api.action.send({ resource: quickId, selector: selector, payload: isChecked ? payloadOn : payloadOff })
}

export default SwitchToggle
