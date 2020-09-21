import React from "react"
import ListBase from "../../../Components/BasePage/ListBase"
import { api } from "../../../Service/Api"
import { DetailedView } from "../../../Components/McIcons/McIcons"
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
} from "../../../store/entities/resources/sensor"
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
        <PageTitle title="Sensor" />
        <PageContent>{super.render()}</PageContent>
      </>
    )
  }
}

// Properties definition
const tableColumns = [
  { title: "Gateway ID", fieldKey: "gatewayId", sortable: true },
  { title: "Node ID", fieldKey: "nodeId", sortable: true },
  { title: "Sensor ID", fieldKey: "sensorId", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Last Seen", fieldKey: "lastSeen", sortable: true },
  { title: "", fieldKey: "", sortable: false },
]

const toRowFuncImpl = (rawData, history) => {
  return {
    cells: [
      rawData.gatewayId,
      rawData.nodeId,
      rawData.sensorId,
      rawData.name,
      { title: <LastSeen date={rawData.lastSeen} /> },
      {
        title: (
          <DetailedView
            key="detailed"
            onClick={(e) => {
              r(history, rMap.resources.sensor.detail, { id: rawData.id })
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
  { category: "gatewayId", categoryName: "Gateway ID", fieldType: "input", dataType: "string" },
  { category: "nodeId", categoryName: "Node ID", fieldType: "input", dataType: "string" },
  { category: "sensorId", categoryName: "Sensor ID", fieldType: "input", dataType: "string" },
  { category: "labels", categoryName: "Labels", fieldType: "label", dataType: "string" },
]

// supply required properties
List.defaultProps = {
  apiGetRecords: api.sensor.list,
  apiDeleteRecords: api.sensor.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  resourceName: "Sensor(s)",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.resourceSensor.loading,
  records: state.entities.resourceSensor.records,
  pagination: state.entities.resourceSensor.pagination,
  count: state.entities.resourceSensor.count,
  lastUpdate: state.entities.resourceSensor.lastUpdate,
  revision: state.entities.resourceSensor.revision,
  filters: state.entities.resourceSensor.filters,
  sortBy: state.entities.resourceSensor.sortBy,
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
