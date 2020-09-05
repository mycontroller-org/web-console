import React from "react"
import ListPage from "../../../Components/ListPage/ListPage"
import { api } from "../../../Service/Api"
import { DetailedView } from "../../../Components/McIcons/McIcons"
import { LastSeen } from "../../../Components/Time/Time"

const columns = [
  "Gateway ID",
  "Node ID",
  "Sensor ID",
  "Field ID",
  "Name",
  "Type",
  "Unit",
  "Payload",
  "Last Seen",
  "",
]

const rowFn = (data) => {
  return {
    cells: [
      data.gatewayId,
      data.nodeId,
      data.sensorId,
      data.fieldId,
      data.name,
      data.type,
      data.unit,
      data.payload.value,
      { title: <LastSeen date={data.lastSeen} /> },
      { title: <DetailedView onClick={() => console.log("clicked details")} /> },
    ],
    rid: data.id,
  }
}

const actions = [
  { type: "edit", disabled: true },
  { type: "delete" },
]

const toolbarItems = [
  { type: "actions", group: "right1", actions: actions, disabled: false },
  { type: "separator", group: "right1" },
  {
    type: "addButton",
    group: "right1",
    onClick: () => {
      console.log("clicked details")
    },
  },
]

const List = () => {
  return (
    <ListPage
      title="Sensor Field"
      listFn={api.sensorField.list}
      toolbar={toolbarItems}
      rowFn={rowFn}
      columns={columns}
    />
  )
}

export default List
