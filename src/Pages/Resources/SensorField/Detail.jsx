import React from "react"
import { api } from "../../../Service/Api"
import DetailBase from "../../../Components/BasePage/DetailBase"

import { KeyValueMap, Labels } from "../../../Components/Label/Label"

class Detail extends DetailBase {
  componentDidMount() {
    this.loadDetail()
  }

  render() {
    return super.render()
  }
}

const renderFunc = (data, wrapFieldFunc, wrapCardFunc) => {
  const fields = []
  fields.push(wrapFieldFunc("ID", data.id))
  fields.push(wrapFieldFunc("Gateway ID", data.gatewayId))
  fields.push(wrapFieldFunc("Node ID", data.nodeId))
  fields.push(wrapFieldFunc("Sensor ID", data.sensorId))
  fields.push(wrapFieldFunc("Field ID", data.fieldId))
  fields.push(wrapFieldFunc("Name", data.name))
  fields.push(wrapFieldFunc("Last Seen", data.lastSeen))

  const others = []
  others.push(wrapFieldFunc("Labels", <Labels data={data.labels} />))
  others.push(wrapFieldFunc("Others", <KeyValueMap data={data.others} />))

  const payload = []
  payload.push(wrapFieldFunc("Metric Type", data.type))
  payload.push(wrapFieldFunc("Unit", data.unit))
  payload.push(wrapFieldFunc("Payload", <KeyValueMap data={data.payload} />))
  payload.push(wrapFieldFunc("Previous Payload", <KeyValueMap data={data.previousPayload} />))

  const jsonData = JSON.stringify(data, null, 2)
  const content = []

  content.push(wrapCardFunc("Overview", fields))
  content.push(wrapCardFunc("Labels and Others", others))
  content.push(wrapCardFunc("Payload", payload))
  content.push(wrapCardFunc("JSON", <pre>{jsonData}</pre>))

  return content
}

// supply required properties
Detail.defaultProps = {
  resourceName: "Sensor Field",
  apiGetRecord: api.sensorField.get,
  renderFunc: renderFunc,
  redirectUpdatePage: "",
}

export default Detail
