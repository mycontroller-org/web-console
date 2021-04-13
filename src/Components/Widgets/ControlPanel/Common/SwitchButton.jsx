import React from "react"
import { Button } from "@patternfly/react-core"
import { api } from "../../../../Service/Api"

const SwitchButton = ({
  id,
  widgetId,
  quickId,
  payload,
  payloadOn = "true",
  payloadOff = "false",
  onButtonType = "primary",
  onText = "ON",
  offText = "OFF",
  minWidth = 70,
  sendPayloadWrapper = () => {},
}) => {
  const isChecked = String(payload) === payloadOn
  return (
    <Button
      id={`${widgetId}_${id}`}
      onClick={() => sendPayloadWrapper(() => onChange(!isChecked, quickId, payloadOn, payloadOff))}
      variant={isChecked ? onButtonType : "tertiary"}
      isSmall
      style={{ minWidth: `${minWidth}px` }}
    >
      <span style={{ fontWeight: isChecked ? 600 : 500 }}>{isChecked ? onText : offText}</span>
    </Button>
  )
}
const onChange = (isChecked, quickId, payloadOn, payloadOff) => {
  api.action.send({ resource: quickId, payload: isChecked ? payloadOn : payloadOff })
}

export default SwitchButton
