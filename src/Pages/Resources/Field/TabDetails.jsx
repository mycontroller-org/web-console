import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { KeyValueMap, Labels } from "../../../Components/DataDisplay/Label"
import { DisplayFieldValue } from "../../../Components/DataDisplay/Miscellaneous"
import { LastSeen } from "../../../Components/Time/Time"
import { MetricTypeOptions } from "../../../Constants/Metric"
import { api } from "../../../Service/Api"
import { getItem, getValue } from "../../../Util/Util"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.field.get}
      getDetailsFunc={getDetailsFuncImpl}
      showMetrics
    />
  )
}

export default tabDetails

// helper functions

const getDetailsFuncImpl = (data) => {
  const fieldsList1 = []
  const fieldsList2 = []

  fieldsList1.push({ key: "ID", value: data.id })
  fieldsList1.push({ key: "Gateway ID", value: data.gatewayId })
  fieldsList1.push({ key: "Node ID", value: data.nodeId })
  fieldsList1.push({ key: "Source ID", value: data.sourceId })
  fieldsList1.push({ key: "Field ID", value: data.fieldId })
  fieldsList1.push({ key: "Name", value: data.name })
  fieldsList1.push({ key: "Last Seen", value: <LastSeen date={data.lastSeen} tooltipPosition="top" /> })

  fieldsList2.push({ key: "Labels", value: <Labels data={data.labels} /> })
  fieldsList2.push({ key: "Others", value: <KeyValueMap data={data.others} /> })
  fieldsList2.push({ key: "Metric Type", value: getItem(data.metricType, MetricTypeOptions).label })
  fieldsList2.push({ key: "Unit", value: data.unit })
  fieldsList2.push({
    key: "No Change Since",
    value: <LastSeen date={data.noChangeSince} tooltipPosition="top" />,
  })
  fieldsList2.push({
    key: "Value",
    value: (
      <DisplayFieldValue
        value={getValue(data, "current.value", "")}
        timestamp={getValue(data, "current.timestamp", "")}
      />
    ),
  })
  fieldsList2.push({
    key: "Previous Value",
    value: (
      <DisplayFieldValue
        value={getValue(data, "previous.value", "")}
        timestamp={getValue(data, "previous.timestamp", "")}
      />
    ),
  })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}
