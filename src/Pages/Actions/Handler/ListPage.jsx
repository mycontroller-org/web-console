import { Button } from "@patternfly/react-core"
import React from "react"
import { connect } from "react-redux"
import ListBase from "../../../Components/BasePage/ListBase"
import { getStatusBool } from "../../../Components/Icons/Icons"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { getValue } from "../../../Util/Util"
import {
  deleteAllFilter,
  deleteFilterCategory,
  deleteFilterValue,
  loading,
  loadingFailed,
  onSortBy,
  updateFilter,
  updateRecords,
} from "../../../store/entities/actions/handler"

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
        this.actionFuncWithRefresh(api.handler.enable)
      },
    },
    {
      type: "disable",
      onClick: () => {
        this.actionFuncWithRefresh(api.handler.disable)
      },
    },
    { type: "delete", onClick: this.onDeleteActionClick },
  ]

  toolbar = [
    { type: "refresh", group: "right1" },
    { type: "actions", group: "right1", actions: this.actions, disabled: false },
    {
      type: "addButton",
      group: "right1",
      onClick: () => {
        r(this.props.history, rMap.actions.handler.add)
      },
    },
  ]

  render() {
    return (
      <>
        <PageTitle title="Handlers" />
        <PageContent>{super.render()}</PageContent>
      </>
    )
  }
}

// Properties definition

const tableColumns = [
  { title: <div className="align-center">Enabled</div>, fieldKey: "enabled", sortable: true },
  { title: "ID", fieldKey: "id", sortable: true },
  { title: "Description", fieldKey: "description", sortable: true },
  { title: "Type", fieldKey: "type", sortable: true },
  { title: "Status", fieldKey: "state.status", sortable: true },
  { title: "Message", fieldKey: "state.message", sortable: true },
]

const toRowFuncImpl = (rawData, history) => {
  return {
    cells: [
      { title: <div className="align-center">{getStatusBool(rawData.enabled)}</div> },
      {
        title: (
          <Button
            variant="link"
            isInline
            onClick={(_e) => {
              r(history, rMap.actions.handler.detail, { id: rawData.id })
            }}
          >
            {rawData.id}
          </Button>
        ),
      },
      { title: rawData.description },
      { title: rawData.type },
      { title: getValue(rawData, "state.status") },
      { title: getValue(rawData, "state.message") },
    ],
    rid: rawData.id,
  }
}

const filtersDefinition = [
  { category: "name", categoryName: "Name", fieldType: "input", dataType: "string" },
  { category: "enabled", categoryName: "Enabled", fieldType: "enabled", dataType: "boolean" },
  { category: "description", categoryName: "Description", fieldType: "input", dataType: "string" },
  { category: "labels", categoryName: "Labels", fieldType: "label", dataType: "string" },
]

// supply required properties
List.defaultProps = {
  apiGetRecords: api.handler.list,
  apiDeleteRecords: api.handler.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  resourceName: "Handler(s)",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.actionHandler.loading,
  records: state.entities.actionHandler.records,
  pagination: state.entities.actionHandler.pagination,
  count: state.entities.actionHandler.count,
  lastUpdate: state.entities.actionHandler.lastUpdate,
  revision: state.entities.actionHandler.revision,
  filters: state.entities.actionHandler.filters,
  sortBy: state.entities.actionHandler.sortBy,
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
