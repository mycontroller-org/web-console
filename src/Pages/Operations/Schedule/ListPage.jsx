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
} from "../../../store/entities/operations/scheduler"
import { getLastSeen, LastSeen } from "../../../Components/Time/Time"
import { DisplaySuccess } from "../../../Components/DataDisplay/Miscellaneous"

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
        this.actionFuncWithRefresh(api.schedule.enable)
      },
    },
    {
      type: "disable",
      onClick: () => {
        this.actionFuncWithRefresh(api.schedule.disable)
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
        r(this.props.history, rMap.operations.scheduler.add)
      },
    },
  ]

  render() {
    return (
      <>
        <PageTitle title="Schedules" />
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
  { title: "Type", fieldKey: "type", sortable: true },
  { title: "Executed Count", fieldKey: "state.executedCount", sortable: true },
  { title: "Last Run", fieldKey: "state.lastRun", sortable: true },
  { title: "Last Status", fieldKey: "state.lastStatus", sortable: true },
  { title: "Message", fieldKey: "state.message", sortable: true },
]

const toRowFuncImpl = (rawData, history) => {
  // get last run status
  const lastRun = getLastSeen(getValue(rawData, "state.lastRun"), "")
  return {
    cells: [
      {
        title: (
          <Button
            variant="link"
            isInline
            onClick={(_e) => {
              r(history, rMap.operations.scheduler.detail, { id: rawData.id })
            }}
          >
            {rawData.id}
          </Button>
        ),
      },
      { title: rawData.description },
      { title: <div className="align-center">{getStatusBool(rawData.enabled)}</div> },
      { title: rawData.type },
      { title: getValue(rawData, "state.executedCount") },
      { title: <LastSeen date={rawData.state.lastRun} /> },
      { title: lastRun !== "-" ? <DisplaySuccess data={rawData} field="state.lastStatus" /> : "-" },
      { title: getValue(rawData, "state.message") },
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
  apiGetRecords: api.schedule.list,
  apiDeleteRecords: api.schedule.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  resourceName: "Schedule(s)",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.operationScheduler.loading,
  records: state.entities.operationScheduler.records,
  pagination: state.entities.operationScheduler.pagination,
  count: state.entities.operationScheduler.count,
  lastUpdate: state.entities.operationScheduler.lastUpdate,
  revision: state.entities.operationScheduler.revision,
  filters: state.entities.operationScheduler.filters,
  sortBy: state.entities.operationScheduler.sortBy,
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
