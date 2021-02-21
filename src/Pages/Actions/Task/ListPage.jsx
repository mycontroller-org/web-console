import { Button } from "@patternfly/react-core"
import React from "react"
import { connect } from "react-redux"
import ListBase from "../../../Components/BasePage/ListBase"
import { getStatusBool } from "../../../Components/Icons/Icons"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
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
} from "../../../store/entities/actions/task"
import { LastSeen } from "../../../Components/Time/Time"

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
        this.actionFuncWithRefresh(api.task.enable)
      },
    },
    {
      type: "disable",
      onClick: () => {
        this.actionFuncWithRefresh(api.task.disable)
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
        r(this.props.history, rMap.actions.task.add)
      },
    },
  ]

  render() {
    return (
      <>
        <PageTitle title="Tasks" />
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
  { title: "Ignore Duplicate", fieldKey: "ignoreDuplicate", sortable: true },
  { title: "Auto Disable", fieldKey: "autoDisable", sortable: true },
  { title: "Trigger On Event", fieldKey: "triggerOnEvent", sortable: true },
  { title: "Last Evaluation", fieldKey: "state.lastEvaluation", sortable: true },
  { title: "Last Success", fieldKey: "state.lastSuccess", sortable: true },
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
              r(history, rMap.actions.task.detail, { id: rawData.id })
            }}
          >
            {rawData.id}
          </Button>
        ),
      },
      { title: rawData.description },
      { title: <div className="align-center">{getStatusBool(rawData.ignoreDuplicate)}</div> },
      { title: <div className="align-center">{getStatusBool(rawData.autoDisable)}</div> },
      { title: <div className="align-center">{getStatusBool(rawData.triggerOnEvent)}</div> },
      { title: <LastSeen date={rawData.state.lastEvaluation} /> },
      { title: <LastSeen date={rawData.state.lastEvaluation} /> },
      { title: rawData.state.message },
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
  apiGetRecords: api.task.list,
  apiDeleteRecords: api.task.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  resourceName: "Task(s)",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.actionTask.loading,
  records: state.entities.actionTask.records,
  pagination: state.entities.actionTask.pagination,
  count: state.entities.actionTask.count,
  lastUpdate: state.entities.actionTask.lastUpdate,
  revision: state.entities.actionTask.revision,
  filters: state.entities.actionTask.filters,
  sortBy: state.entities.actionTask.sortBy,
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
