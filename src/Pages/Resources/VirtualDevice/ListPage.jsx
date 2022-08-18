import { Button } from "@patternfly/react-core"
import React from "react"
import { withTranslation } from "react-i18next"
import { connect } from "react-redux"
import ListBase from "../../../Components/BasePage/ListBase"
import { getStatusBool } from "../../../Components/Icons/Icons"
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
} from "../../../store/entities/resources/source"

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

  actions = [{ type: "delete", onClick: this.onDeleteActionClick }]

  toolbar = [
    { type: "refresh", group: "right1" },
    { type: "actions", group: "right1", actions: this.actions, disabled: false },
    {
      type: "addButton",
      group: "right1",
      onClick: () => {
        r(this.props.history, rMap.resources.virtualDevice.add)
      },
    },
  ]

  render() {
    return (
      <>
        <PageTitle title="virtual_devices" />
        <PageContent>{super.render()}</PageContent>
      </>
    )
  }
}

// Properties definition
const tableColumns = [
  { title: "enabled", fieldKey: "enabled", sortable: true },
  { title: "name", fieldKey: "name", sortable: true },
  { title: "description", fieldKey: "description", sortable: true },
  { title: "location", fieldKey: "location", sortable: true },
  { title: "device_type", fieldKey: "deviceType", sortable: true },
  { title: "modified_on", fieldKey: "modifiedOn", sortable: true },
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
              r(history, rMap.resources.virtualDevice.detail, { id: rawData.id })
            }}
          >
            {rawData.name}
          </Button>
        ),
      },
      { title: rawData.description },
      { title: rawData.location },
      { title: rawData.deviceType },
      { title: <LastSeen date={rawData.modifiedOn} /> },
    ],
    rid: rawData.id,
  }
}

const filtersDefinition = [
  { category: "name", categoryName: "name", fieldType: "input", dataType: "string" },
  { category: "description", categoryName: "description", fieldType: "input", dataType: "string" },
  { category: "enabled", categoryName: "enabled", fieldType: "enabled", dataType: "boolean" },
  { category: "deviceType", categoryName: "type", fieldType: "input", dataType: "string" },
  { category: "labels", categoryName: "labels", fieldType: "label", dataType: "string" },
]

// supply required properties
List.defaultProps = {
  apiGetRecords: api.virtualDevice.list,
  apiDeleteRecords: api.virtualDevice.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  deleteDialogTitle: "dialog.delete_title_source",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.resourceSource.loading,
  records: state.entities.resourceSource.records,
  pagination: state.entities.resourceSource.pagination,
  count: state.entities.resourceSource.count,
  lastUpdate: state.entities.resourceSource.lastUpdate,
  revision: state.entities.resourceSource.revision,
  filters: state.entities.resourceSource.filters,
  sortBy: state.entities.resourceSource.sortBy,
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(List))
