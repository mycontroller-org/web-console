import React from "react"
import ListPage from "../../../Components/ListPage/ListPage"
import { api } from "../../../Service/Api"
import { DetailedView, getStatus } from "../../../Components/McIcons/McIcons"
import { LastSeen } from "../../../Components/Time/Time"

const columns = [
  "Gateway ID",
  "Node ID",
  "Name",
  <span className="align-center">Status</span>,
  "Last Seen",
  "",
]

const rowFn = (data) => {
  return {
    cells: [
      data.gatewayId,
      data.nodeId,
      data.name,
      { title: getStatus(data.status.status) },
      { title: <LastSeen date={data.lastSeen} /> },
      { title: <DetailedView onClick={() => console.log("clicked details")} /> },
    ],
    rid: data.id,
  }
}

const actions = [
  { type: "heartbeat_request" },
  { type: "refresh_node_info" },
  { type: "firmware_update" },
  { type: "reboot", onClick: () => {} },
  { type: "reset" },
  { type: "separator" },
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
    <ListPage title="Node" listFn={api.node.list} toolbar={toolbarItems} rowFn={rowFn} columns={columns} />
  )
}

export default List
