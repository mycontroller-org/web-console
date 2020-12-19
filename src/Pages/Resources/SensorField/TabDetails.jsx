import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { KeyValueMap, Labels } from "../../../Components/Label/Label"
import { api } from "../../../Service/Api"

class TabDetails extends TabDetailsBase {
  componentDidMount() {
    this.loadDetail()
  }

  render() {
    return super.render()
  }
}

const getDetailsFuncImpl = (data) => {
  const fieldsList1 = []
  const fieldsList2 = []

  fieldsList1.push({ key: "ID", value: data.id })
  fieldsList1.push({ key: "Gateway ID", value: data.gatewayId })
  fieldsList1.push({ key: "Node ID", value: data.nodeId })
  fieldsList1.push({ key: "Sensor ID", value: data.sensorId })
  fieldsList1.push({ key: "Field ID", value: data.fieldId })
  fieldsList1.push({ key: "Name", value: data.name })
  fieldsList1.push({ key: "Last Seen", value: data.lastSeen })

  fieldsList2.push({ key: "Labels", value: <Labels data={data.labels} /> })
  fieldsList2.push({ key: "Others", value: <KeyValueMap data={data.others} /> })
  fieldsList2.push({ key: "Metric Type", value: data.metricType })
  fieldsList2.push({ key: "Unit", value: data.unit })
  fieldsList2.push({ key: "Payload", value: <KeyValueMap data={data.payload} /> })
  fieldsList2.push({ key: "Previous Payload", value: <KeyValueMap data={data.previousPayload} /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}

// supply required properties
TabDetails.defaultProps = {
  apiGetRecord: api.sensorField.get,
  getDetailsFunc: getDetailsFuncImpl,
  showMetrics: true,
}

export default TabDetails
