import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { RouteLink } from "../../../Components/Buttons/Buttons"
import { KeyValueMap, Labels } from "../../../Components/DataDisplay/Label"
import { getStatus } from "../../../Components/Icons/Icons"
import { LastSeen } from "../../../Components/Time/Time"
import { api } from "../../../Service/Api"
import { routeMap as rMap } from "../../../Service/Routes"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.firmware.get}
      apiListTablesRecord={api.node.list}
      tableTitle="Assigned Nodes"
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
  fieldsList1.push({ key: "Description", value: data.description })
  fieldsList1.push({ key: "Modified On", value: <LastSeen date={data.modifiedOn} /> })
  fieldsList1.push({ key: "Labels", value: <Labels data={data.labels} /> })

  fieldsList2.push({ key: "File Details", value: <KeyValueMap data={data.file} /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}

const tableColumns = [
  { title: "Node ID", fieldKey: "nodeId", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Version", fieldKey: "labels.version", sortable: true },
  { title: "Library Version", fieldKey: "labels.library_version", sortable: true },
  { title: "Status", fieldKey: "state.status", sortable: true },
  { title: "Last Seen", fieldKey: "lastSeen", sortable: true },
]

const getTableRowsFuncImpl = (rawData, _index, history) => {
  return [
    {
      title: (
        <RouteLink
          history={history}
          path={rMap.resources.node.detail}
          id={rawData.id}
          text={rawData.nodeId}
        />
      ),
    },
    {
      title: (
        <RouteLink history={history} path={rMap.resources.node.detail} id={rawData.id} text={rawData.name} />
      ),
    },
    rawData.labels.version,
    rawData.labels.library_version,
    { title: getStatus(rawData.state.status) },
    { title: <LastSeen date={rawData.lastSeen} /> },
  ]
}

const getTableFilterFuncImpl = (data) => {
  return { "labels.assigned_firmware": data.id }
}
