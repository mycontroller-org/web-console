import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { RouteLink } from "../../../Components/Buttons/Buttons"
import { KeyValueMap, Labels } from "../../../Components/Label/Label"
import { getStatus } from "../../../Components/McIcons/McIcons"
import { LastSeen } from "../../../Components/Time/Time"
import { api } from "../../../Service/Api"
import { routeMap as rMap } from "../../../Service/Routes"

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
  fieldsList1.push({ key: "Name", value: data.name })
  fieldsList1.push({ key: "Status", value: getStatus(data.state.status) })
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
  { title: "Sensor ID", fieldKey: "sensorId", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Last Seen", fieldKey: "lastSeen", sortable: true },
]

const getTableRowsFuncImpl = (rawData, _index, history) => {
  return {
    cells: [
      {
        title: (
          <RouteLink
            history={history}
            path={rMap.resources.sensor.detail}
            id={rawData.id}
            text={rawData.sensorId}
          />
        ),
      },
      {
        title: (
          <RouteLink
            history={history}
            path={rMap.resources.sensor.detail}
            id={rawData.id}
            text={rawData.name}
          />
        ),
      },
      { title: <LastSeen date={rawData.lastSeen} /> },
    ],
    rid: rawData.id,
  }
}

const getTableFilterFuncImpl = (data) => {
  return { gatewayId: data.gatewayId, nodeId: data.nodeId }
}

// supply required properties
TabDetails.defaultProps = {
  apiGetRecord: api.node.get,
  apiListTablesRecord: api.sensor.list,
  tableTitle: "Sensors",
  getTableFilterFunc: getTableFilterFuncImpl,
  tableColumns: tableColumns,
  getTableRowsFunc: getTableRowsFuncImpl,
  getDetailsFunc: getDetailsFuncImpl,
}

export default TabDetails
