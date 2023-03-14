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
} from "../../../store/entities/system/serviceToken"

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
        r(this.props.history, rMap.settings.serviceToken.add)
      },
    },
  ]

  render() {
    return (
      <>
        <PageTitle title="service_tokens" />
        <PageContent>{super.render()}</PageContent>
      </>
    )
  }
}

// Properties definition
const tableColumns = [
  { title: "name", fieldKey: "name", sortable: true },
  { title: "description", fieldKey: "description", sortable: true },
  { title: "never_expire", fieldKey: "neverExpire", sortable: true },
  { title: "expires_on", fieldKey: "expiresOn", sortable: true },
  { title: "created_on", fieldKey: "createdOn", sortable: true },
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
              r(history, rMap.settings.serviceToken.detail, { id: rawData.id })
            }}
          >
            {rawData.name}
          </Button>
        ),
      },
      { title: rawData.description },
      { title: <div className="align-center">{getStatusBool(rawData.neverExpire)}</div> },
      { title: <LastSeen date={rawData.expiresOn} /> },
      { title: <LastSeen date={rawData.createdOn} /> },
    ],
    rid: rawData.id,
  }
}

const filtersDefinition = [
  { category: "name", categoryName: "name", fieldType: "input", dataType: "string" },
  { category: "description", categoryName: "description", fieldType: "input", dataType: "string" },
  { category: "neverExpire", categoryName: "never_expire", fieldType: "neverExpire", dataType: "boolean" },
  { category: "expiresOn", categoryName: "expires_on", fieldType: "input", dataType: "string" },
  { category: "createdOn", categoryName: "created_on", fieldType: "input", dataType: "string" },
]

// supply required properties
List.defaultProps = {
  apiGetRecords: api.serviceToken.list,
  apiDeleteRecords: api.serviceToken.delete,
  tableColumns: tableColumns,
  toRowFunc: toRowFuncImpl,
  deleteDialogTitle: "dialog.delete_title_service_token",
  filtersDefinition: filtersDefinition,
}

const mapStateToProps = (state) => ({
  loading: state.entities.settingsServiceToken.loading,
  records: state.entities.settingsServiceToken.records,
  pagination: state.entities.settingsServiceToken.pagination,
  count: state.entities.settingsServiceToken.count,
  lastUpdate: state.entities.settingsServiceToken.lastUpdate,
  revision: state.entities.settingsServiceToken.revision,
  filters: state.entities.settingsServiceToken.filters,
  sortBy: state.entities.settingsServiceToken.sortBy,
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
