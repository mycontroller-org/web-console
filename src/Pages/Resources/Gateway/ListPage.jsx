import { Button } from "@patternfly/react-core"
import React from "react"
import { connect } from "react-redux"
import ListBase from "../../../Components/BasePage/ListBase"
import { getStatus, getStatusBool } from "../../../Components/Icons/Icons"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { LastSeen } from "../../../Components/Time/Time"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import {
  deleteAllFilter,
  deleteFilterCategory,
  deleteFilterValue,
  loading,
  loadingFailed,
  onSortBy,
  updateFilter,
  updateRecords,
} from "../../../store/entities/resources/gateway"
import { getValue } from "../../../Util/Util"

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
        this.actionFuncWithRefresh(api.gateway.enable)
      },
    },
    {
      type: "disable",
      onClick: () => {
        this.actionFuncWithRefresh(api.gateway.disable)
      },
    },
    {
      type: "reload",
      onClick: () => {
        this.actionFuncWithRefresh(api.gateway.reload)
      },
    },
    { type: "separator" },
    { type: "discover" },
    { type: "separator" },
    { type: "delete", onClick: this.onDeleteActionClick },
  ]

  toolbar = [
    { type: "refresh", group: "right1" },
    { type: "actions", group: "right1", actions: this.actions, disabled: false },
    {
      type: "addButton",
      group: "right1",
      onClick: () => {
        r(this.props.history, rMap.resources.gateway.add)
      },
    },
  ]

  render() {
    return (
      <>
        <PageTitle title="Gateways" />
        <PageContent>{super.render()}</PageContent>
      </>
    )
  }
}

// Properties definition

const tableColumns = [
  { title: "ID", fieldKey: "id", sortable: true },
  { title: "Description", fieldKey: "description", sortable: true },
  { title: <div className="align-center">Enabled</div>, fieldKey: "enabled", sortable: true },
  { title: "Reconnect Delay", fieldKey: "reconnectDelay", sortable: true },
  { title: "Provider", fieldKey: "provider.type", sortable: true },
  { title: "Protocol", fieldKey: "provider.protocol.type", sortable: true },
  { title: <div className="align-center">Status</div>, fieldKey: "state.status", sortable: true },
  { title: "Since", fieldKey: "state.since", sortable: true },
  { title: "Message", fieldKey: "state.message", sortable: true },
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
              r(history, rMap.resources.gateway.detail, { id: rawData.id })
            }}
          >
            {rawData.id}
          </Button>
        ),
      },
      { title: rawData.description },
      { title: <div className="align-center">{getStatusBool(rawData.enabled)}</div> },
      { title: rawData.reconnectDelay },
      getValue(rawData, "provider.type", ""),
      getValue(rawData, "provider.protocol.type", ""),
      { title: getStatus(getValue(rawData, "state.status", "")) },
      { title: <LastSeen date={getValue(rawData, "state.since", "")} /> },
      getValue(rawData, "state.message", ""),
    ],
    rid: rawData.id,
  }
}

const filtersDefinition = [
  { category: "id", categoryName: "ID", fieldType: "input", dataType: "string" },
  { category: "description", categoryName: "Description", fieldType: "input", dataType: "string" },
  { category: "enabled", categoryName: "Enabled", fieldType: "enabled", dataType: "boolean" },
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
