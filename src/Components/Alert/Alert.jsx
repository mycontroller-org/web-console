import React from "react"
import { Alert } from "@patternfly/react-core"
import { TOAST_ALERT_TIMEOUT } from "../../config/globalConfig"

export const AlertDanger = ({ text, timeout = TOAST_ALERT_TIMEOUT, description = "" }) => {
  return (
    <Alert variant="danger" title={text} timeout={timeout} isToast={true} >
      {description}
    </Alert>
  )
}
