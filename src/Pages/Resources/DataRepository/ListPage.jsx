import { Button } from "@patternfly/react-core"
import React from "react"
import { connect } from "react-redux"
import ListBase from "../../../Components/BasePage/ListBase"
import { DisplayTrue } from "../../../Components/DataDisplay/Miscellaneous"
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
} from "../../../store/entities/resources/dataRepository"

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
        r(this.props.history, rMap.resources.dataRepository.add)
      },
    },
  ]

  render() {
    return (
      <>
        <PageTitle title="Data Repository" />
        <PageContent>{super.render()}</PageContent>
      </>
    )
  }
}

// Properties definition

const tableColumns = [
  { title: "ID", fieldKey: "id", sortable: true },
  { title: "Description", fieldKey: "description", sortable: true },
  { title: "Read Only", fieldKey: "readOnly", sortable: true },
  { title: "Modified On", fieldKey: "modifiedOn", sortable: true },
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
              r(history, rMap.resources.dataRepository.detail, { id: rawData.id })
            }}
          >
            {rawData.id}
          </Button>
        ),
      },
      { title: rawData.description },
      { title: <DisplayTrue data={rawData} field="readOnly" /> },
      { title: <LastSeen date={rawData.modifiedOn} /> },
    ],
    rid: rawData.id,
  }
}

const filtersDefinition = [
  { category: "name", categoryName: "Name", fieldType: "input", dataType: "string" },
  { category: "readOnly", categoryName: "Read Only", fieldType: "enabled", dataType: "boolean" },
  { category: "description", categoryName: "Description", fieldType: "input", dataType: "string" },
  { category: "labels", categoryName: "Labels", fieldType: "label", dataType: "string" },
]

// supply required properties
List.defaultProps = {
  apiGetRecords: api.dataRepository.list,
  apiDeleteRecords: api.dataRepository.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  resourceName: "Data Repository",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.resourceDataRepository.loading,
  records: state.entities.resourceDataRepository.records,
  pagination: state.entities.resourceDataRepository.pagination,
  count: state.entities.resourceDataRepository.count,
  lastUpdate: state.entities.resourceDataRepository.lastUpdate,
  revision: state.entities.resourceDataRepository.revision,
  filters: state.entities.resourceDataRepository.filters,
  sortBy: state.entities.resourceDataRepository.sortBy,
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
