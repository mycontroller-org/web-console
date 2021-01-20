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
} from "../../../store/entities/actions/forwardPayload"

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
        this.withRefresh(api.forwardPayload.enable)
      },
    },
    {
      type: "disable",
      onClick: () => {
        this.withRefresh(api.forwardPayload.disable)
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
        r(this.props.history, rMap.actions.forwardPayload.add)
      },
    },
  ]

  render() {
    return (
      <>
        <PageTitle title="Forward Payload" />
        <PageContent>{super.render()}</PageContent>
      </>
    )
  }
}

// Properties definition

const tableColumns = [
  { title: <div className="align-center">Enabled</div>, fieldKey: "enabled", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Description", fieldKey: "description", sortable: true },
  { title: "Source ID", fieldKey: "sourceId", sortable: true },
  { title: "Target ID", fieldKey: "targetId", sortable: true },
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
              r(history, rMap.actions.forwardPayload.detail, { id: rawData.id })
            }}
          >
            {rawData.name}
          </Button>
        ),
      },
      { title: rawData.description },
      {
        title: (
          <Button
            variant="link"
            isInline
            onClick={(_e) => {
              r(history, rMap.resources.sensorField.detail, { id: rawData.sourceId })
            }}
          >
            {rawData.sourceId}
          </Button>
        ),
      },
      {
        title: (
          <Button
            variant="link"
            isInline
            onClick={(_e) => {
              r(history, rMap.resources.sensorField.detail, { id: rawData.targetId })
            }}
          >
            {rawData.targetId}
          </Button>
        ),
      },
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
  apiGetRecords: api.forwardPayload.list,
  apiDeleteRecords: api.forwardPayload.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  resourceName: "Forward Payload(s)",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.actionForwardPayload.loading,
  records: state.entities.actionForwardPayload.records,
  pagination: state.entities.actionForwardPayload.pagination,
  count: state.entities.actionForwardPayload.count,
  lastUpdate: state.entities.actionForwardPayload.lastUpdate,
  revision: state.entities.actionForwardPayload.revision,
  filters: state.entities.actionForwardPayload.filters,
  sortBy: state.entities.actionForwardPayload.sortBy,
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
