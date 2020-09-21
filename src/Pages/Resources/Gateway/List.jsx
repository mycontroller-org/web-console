import React from "react"
import ListBase from "../../../Components/BasePage/ListBase"
import { api } from "../../../Service/Api"
import { DetailedView, getStatus, getStatusBool } from "../../../Components/McIcons/McIcons"
import { LastSeen } from "../../../Components/Time/Time"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import PageContent from "../../../Components/PageContent/PageContent"
import {
  updateRecords,
  loading,
  loadingFailed,
  updateFilter,
  deleteFilterValue,
  deleteFilterCategory,
  deleteAllFilter,
  onSortBy,
} from "../../../store/entities/resources/gateway"
import { connect } from "react-redux"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"

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
    {
      type: "enable",
      onClick: () => {
        this.withRefresh(api.gateway.enable)
      },
    },
    {
      type: "disable",
      onClick: () => {
        this.withRefresh(api.gateway.disable)
      },
    },
    {
      type: "reload",
      onClick: () => {
        this.withRefresh(api.gateway.reload)
      },
    },
    { type: "separator" },
    { type: "discover" },
    { type: "separator" },
    { type: "edit", disabled: true },
    { type: "delete", onClick: this.onDeleteActionClick },
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
        <PageTitle title="Gateway" />
        <PageContent>{super.render()}</PageContent>
      </>
    )
  }
}

// Properties definition

const tableColumns = [
  { title: <span className="align-center">Enabled</span>, fieldKey: "enabled", sortable: true },
  { title: "ID", fieldKey: "id", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Provider", fieldKey: "provider.type", sortable: true },
  { title: "Protocol", fieldKey: "provider.protocolType", sortable: true },
  { title: <span className="align-center">Status</span>, fieldKey: "state.status", sortable: true },
  { title: "Since", fieldKey: "state.since", sortable: true },
  { title: "Message", fieldKey: "state.message", sortable: true },
  { title: "", fieldKey: "", sortable: false },
]

const toRowFuncImpl = (rawData, history) => {
  return {
    cells: [
      { title: getStatusBool(rawData.enabled) },
      rawData.id,
      rawData.name,
      rawData.provider.type,
      rawData.provider.protocolType,
      { title: getStatus(rawData.state.status) },
      { title: <LastSeen date={rawData.state.since} /> },
      rawData.state.message,
      {
        title: (
          <DetailedView
            key="detailed"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              r(history, rMap.resources.gateway.detail, { id: rawData.id })
            }}
          />
        ),
      },
    ],
    rid: rawData.id,
  }
}

const filtersDefinition = [
  { category: "name", categoryName: "Name", fieldType: "input", dataType: "string" },
  { category: "enabled", categoryName: "Enabled", fieldType: "enabled", dataType: "boolean" },
  { category: "id", categoryName: "ID", fieldType: "input", dataType: "string" },
  { category: "labels", categoryName: "Labels", fieldType: "label", dataType: "string" },
]

// supply required properties
List.defaultProps = {
  apiGetRecords: api.gateway.list,
  apiDeleteRecords: api.gateway.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  resourceName: "Gateway(s)",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.resourceGateway.loading,
  records: state.entities.resourceGateway.records,
  pagination: state.entities.resourceGateway.pagination,
  count: state.entities.resourceGateway.count,
  lastUpdate: state.entities.resourceGateway.lastUpdate,
  revision: state.entities.resourceGateway.revision,
  filters: state.entities.resourceGateway.filters,
  sortBy: state.entities.resourceGateway.sortBy,
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
