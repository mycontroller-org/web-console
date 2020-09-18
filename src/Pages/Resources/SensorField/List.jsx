import React from "react"
import ListPage from "../../../Components/ListPage/ListPageNew"
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
} from "../../../store/entities/resources/sensorField"
import { connect } from "react-redux"
import { METRIC_TYPES } from "../../../config/globalConfig"

class List extends ListPage {
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
        <PageTitle title="Sensor Field" />
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
  { title: "Field ID", fieldKey: "fieldId", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Type", fieldKey: "type", sortable: true },
  { title: "Unit", fieldKey: "unit", sortable: true },
  { title: "Value", fieldKey: "payload.value", sortable: true },
  { title: "Previous Value", fieldKey: "previousPayload.value", sortable: true },
  { title: "Last Seen", fieldKey: "lastSeen", sortable: true },
  { title: "", fieldKey: "", sortable: false },
]

const toRowFuncImpl = (rawData) => {
  return {
    cells: [
      rawData.gatewayId,
      rawData.nodeId,
      rawData.sensorId,
      rawData.fieldId,
      rawData.name,
      METRIC_TYPES[rawData.type],
      rawData.unit,
      rawData.payload.value,
      rawData.previousPayload.value,
      { title: <LastSeen date={rawData.lastSeen} /> },
      { title: <DetailedView onClick={() => console.log("clicked details")} /> },
    ],
    rid: rawData.id,
  }
}

const filtersDefinition = [
  { category: "name", categoryName: "Name", fieldType: "input", dataType: "string" },
  { category: "gatewayId", categoryName: "Gateway ID", fieldType: "input", dataType: "string" },
  { category: "nodeId", categoryName: "Node ID", fieldType: "input", dataType: "string" },
  { category: "sensorId", categoryName: "Sensor ID", fieldType: "input", dataType: "string" },
  { category: "fieldId", categoryName: "Filed ID", fieldType: "input", dataType: "string" },
  { category: "labels", categoryName: "Labels", fieldType: "label", dataType: "string" },
]

// supply required properties
List.defaultProps = {
  apiGetRecords: api.sensorField.list,
  apiDeleteRecords: api.sensorField.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  resourceName: "Sensor Fields(s)",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.resourceSensorField.loading,
  records: state.entities.resourceSensorField.records,
  pagination: state.entities.resourceSensorField.pagination,
  count: state.entities.resourceSensorField.count,
  lastUpdate: state.entities.resourceSensorField.lastUpdate,
  revision: state.entities.resourceSensorField.revision,
  filters: state.entities.resourceSensorField.filters,
  sortBy: state.entities.resourceSensorField.sortBy,
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
