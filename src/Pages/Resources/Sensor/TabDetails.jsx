import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { RouteLink } from "../../../Components/Buttons/Buttons"
import { KeyValueMap, Labels } from "../../../Components/DataDisplay/Label"
import { LastSeen } from "../../../Components/Time/Time"
import { METRIC_TYPES } from "../../../Constants/Metric"
import { api } from "../../../Service/Api"
import { routeMap as rMap } from "../../../Service/Routes"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.sensor.get}
      apiListTablesRecord={api.sensorField.list}
      tableTitle="Sensor Fields"
      getTableFilterFunc={getTableFilterFuncImpl}
      tableColumns={tableColumns}
      getTableRowsFunc={getTableRowsFuncImpl}
      getDetailsFunc={getDetailsFuncImpl}
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
  fieldsList1.push({ key: "Sensor ID", value: data.sensorId })
  fieldsList1.push({ key: "Name", value: data.name })
  fieldsList1.push({ key: "Last Seen", value: data.lastSeen })
  fieldsList2.push({ key: "Labels", value: <Labels data={data.labels} /> })
  fieldsList2.push({ key: "Others", value: <KeyValueMap data={data.others} /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}

// Properties definition
const tableColumns = [
  { title: "Field ID", fieldKey: "fieldId", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Metric Type", fieldKey: "metricType", sortable: true },
  { title: "Unit", fieldKey: "unit", sortable: true },
  { title: "Value", fieldKey: "current.value", sortable: true },
  { title: "Previous Value", fieldKey: "previous.value", sortable: true },
  { title: "Last Seen", fieldKey: "lastSeen", sortable: true },
]

const getTableRowsFuncImpl = (rawData, _index, history) => {
  return [
    {
      title: (
        <RouteLink
          history={history}
          path={rMap.resources.sensorField.detail}
          id={rawData.id}
          text={rawData.fieldId}
        />
      ),
    },
    rawData.name,
    METRIC_TYPES[rawData.metricType],
    rawData.unit,
    String(rawData.current.value),
    String(rawData.previous.value),
    { title: <LastSeen date={rawData.lastSeen} /> },
  ]
}

const getTableFilterFuncImpl = (data) => {
  return { gatewayId: data.gatewayId, nodeId: data.nodeId, sensorId: data.sensorId }
}
