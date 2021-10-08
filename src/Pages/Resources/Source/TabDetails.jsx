import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { RouteLink } from "../../../Components/Buttons/Buttons"
import { KeyValueMap, Labels } from "../../../Components/DataDisplay/Label"
import { LastSeen } from "../../../Components/Time/Time"
import InputField from "../../../Components/Widgets/ControlPanel/Common/InputField"
import { getQuickId, ResourceType } from "../../../Constants/ResourcePicker"
import { api } from "../../../Service/Api"
import { routeMap as rMap } from "../../../Service/Routes"
import { getFieldValue, getValue } from "../../../Util/Util"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.source.get}
      apiListTablesRecord={api.field.list}
      tableTitle="Fields"
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
  fieldsList1.push({ key: "Source ID", value: data.sourceId })
  fieldsList1.push({ key: "Name", value: data.name })
  fieldsList1.push({ key: "Last Seen", value: <LastSeen date={data.lastSeen} tooltipPosition="top" /> })
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
  { title: "Value", fieldKey: "current.value", sortable: true },
  { title: "Previous Value", fieldKey: "previous.value", sortable: true },
  { title: "Unit", fieldKey: "unit", sortable: true },
  { title: "Last Seen", fieldKey: "lastSeen", sortable: true },
]

const getTableRowsFuncImpl = (rawData, _index, history) => {
  const isReadOnly = getValue(rawData, "labels.readonly", "false") === "true"
  const currentValue = isReadOnly ? (
    getFieldValue(getValue(rawData, "current.value", ""))
  ) : (
    <InputField
      payload={getValue(rawData, "current.value", "")}
      id={rawData.id}
      quickId={getQuickId(ResourceType.Field, rawData)}
      widgetId={rawData.id}
      key={rawData.id}
      sendPayloadWrapper={(callBack) => {
        callBack()
      }}
    />
  )

  return [
    {
      title: (
        <RouteLink
          history={history}
          path={rMap.resources.field.detail}
          id={rawData.id}
          text={rawData.fieldId}
        />
      ),
    },
    {
      title: (
        <RouteLink history={history} path={rMap.resources.field.detail} id={rawData.id} text={rawData.name} />
      ),
    },
    rawData.metricType,
    { title: currentValue },
    { title: getFieldValue(getValue(rawData, "previous.value", "")) },
    rawData.unit,
    { title: <LastSeen date={rawData.lastSeen} /> },
  ]
}

const getTableFilterFuncImpl = (data) => {
  return { gatewayId: data.gatewayId, nodeId: data.nodeId, sourceId: data.sourceId }
}
