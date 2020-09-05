import React from "react"
import ListPage from "../../../Components/ListPage/ListPage"
import { api } from "../../../Service/Api"
import { DetailedView, getStatus, getStatusBool } from "../../../Components/McIcons/McIcons"
import { LastSeen } from "../../../Components/Time/Time"

const columns = [
  <span className="align-center">Enabled</span>,
  "ID",
  "Name",
  "Provider",
  "Protocol",
  <span className="align-center">Status</span>,
  "Since",
  "Message",
  "",
]

const rowFn = (data) => {
  return {
    cells: [
      { title: getStatusBool(data.enabled) },
      data.id,
      data.name,
      data.provider.type,
      data.provider.protocolType,
      { title: getStatus(data.state.status) },
      { title: <LastSeen date={data.state.since} /> },
      data.state.message,
      { title: <DetailedView onClick={() => console.log("clicked details")} /> },
    ],
    rid: data.id,
  }
}

const actions = [
  {
    type: "enable",
    onClick: () => {
      console.log("Enabled clicked")
    },
  },
  { type: "disable" },
  { type: "reload" },
  { type: "discover" },
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
    <ListPage
      title="Gateway"
      listFn={api.gateway.list}
      toolbar={toolbarItems}
      rowFn={rowFn}
      columns={columns}
    />
  )
}

export default List
