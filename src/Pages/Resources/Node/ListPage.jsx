import { Button } from "@patternfly/react-core"
import React from "react"
import { connect } from "react-redux"
import ListBase from "../../../Components/BasePage/ListBase"
import { getStatus } from "../../../Components/McIcons/McIcons"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { LastSeen } from "../../../Components/Time/Time"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import {
  deleteAllFilter, deleteFilterCategory, deleteFilterValue, loading,
  loadingFailed,




  onSortBy, updateFilter, updateRecords
} from "../../../store/entities/resources/node"

class List extends ListBase {
  state = {
    loading: true,
    pagination: {
      limit: 10,
      page: 0,
    },
    rows: [],
  }

  componentDidMount() {
    super.componentDidMount()
  }

  actions = [
    { type: "edit", disabled: true },
    { type: "delete", onClick: this.onDeleteActionClick },
  ]

  actions = [
    { type: "refresh_node_info" },
    { type: "heartbeat_request" },
    { type: "reboot", onClick: () => {} },
    { type: "separator" },
    { type: "firmware_update" },
    { type: "reset" },
    { type: "separator" },
    { type: "edit", disabled: true },
    {
      type: "delete",
      onClick: this.onDeleteActionClick,
    },
  ]

  toolbar = [
    { type: "refresh", group: "right1" },
    { type: "actions", group: "right1", actions: this.actions, disabled: false },
    {
      type: "addButton",
      group: "right1",
      onClick: () => {
        console.log("clicked details")
      },
    },
  ]

  render() {
    return (
      <>
        <PageTitle title="Nodes" />
        <PageContent>{super.render()}</PageContent>
      </>
    )
  }
}

// Properties definition
const tableColumns = [
  { title: "Gateway ID", fieldKey: "gatewayId", sortable: true },
  { title: "Node ID", fieldKey: "nodeId", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Version", fieldKey: "labels.version", sortable: true },
  { title: "Library Version", fieldKey: "labels.library_version", sortable: true },
  { title: "Status", fieldKey: "state.status", sortable: true },
  { title: "Last Seen", fieldKey: "lastSeen", sortable: true },
]

const toRowFuncImpl = (rawData, history) => {
  return {
    cells: [
      {
        title: (
          <Button
            variant="link"
            isInline
            onClick={(_e) => {
              r(history, rMap.resources.gateway.detail, { id: rawData.gatewayId })
            }}
          >
            {rawData.gatewayId}
          </Button>
        ),
      },
      {
        title: (
          <Button
            variant="link"
            isInline
            onClick={(_e) => {
              r(history, rMap.resources.node.detail, { id: rawData.id })
            }}
          >
            {rawData.nodeId}
          </Button>
        ),
      },
      rawData.name,
      rawData.labels.version,
      rawData.labels.library_version,
      { title: getStatus(rawData.state.status) },
      { title: <LastSeen date={rawData.lastSeen} /> },
    ],
    rid: rawData.id,
  }
}

const filtersDefinition = [
  { category: "name", categoryName: "Name", fieldType: "input", dataType: "string" },
  { category: "gatewayId", categoryName: "Gateway ID", fieldType: "input", dataType: "string" },
  { category: "nodeId", categoryName: "Node ID", fieldType: "input", dataType: "string" },
  { category: "labels.version", categoryName: "Version", fieldType: "input", dataType: "string" },
  {
    category: "labels.library_version",
    categoryName: "Library Version",
    fieldType: "input",
    dataType: "string",
  },
  { category: "labels", categoryName: "Labels", fieldType: "label", dataType: "string" },
]

// supply required properties
List.defaultProps = {
  apiGetRecords: api.node.list,
  apiDeleteRecords: api.node.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  resourceName: "Node(s)",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.resourceNode.loading,
  records: state.entities.resourceNode.records,
  pagination: state.entities.resourceNode.pagination,
  count: state.entities.resourceNode.count,
  lastUpdate: state.entities.resourceNode.lastUpdate,
  revision: state.entities.resourceNode.revision,
  filters: state.entities.resourceNode.filters,
  sortBy: state.entities.resourceNode.sortBy,
})

const mapDispatchToProps = (dispatch) => ({
  updateRecordsFunc: (data) => dispatch(updateRecords(data)),
  loadingFunc: () => dispatch(loading()),
  loadingFailedFunc: () => dispatch(loadingFailed()),
  updateFilterFunc: (data) => dispatch(updateFilter(data)),
  deleteFilterValueFunc: (data) => dispatch(deleteFilterValue(data)),
  deleteFilterCategoryFunc: (data) => dispatch(deleteFilterCategory(data)),
  deleteAllFilterFunc: () => dispatch(deleteAllFilter()),
  onSortByFunc: (data) => dispatch(onSortBy(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(List)
