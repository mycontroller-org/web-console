import React from "react"
import { Table, TableHeader, TableBody, TableVariant, RowWrapper, sortable } from "@patternfly/react-table"
import { Divider, Pagination, PaginationVariant, Flex, FlexItem } from "@patternfly/react-core"
import McToolbar from "../McToolbar/McToolbar"
import McSpinner from "../McSpinner/McSpinner"
import DeleteDialog from "../Dialog/DeleteDialog"
import PropTypes from "prop-types"
import moment from "moment"
import LastUpdate from "../LastUpdate/LastUpdate"
import { DATA_CACHE_TIMEOUT } from "../../config/globalConfig"

import "./ListBase.scss"
import Filters from "../Filters/Filters"

export default class ListPage extends React.Component {
  state = {
    rows: [],
    showDeleteDialog: false,
    filterTypeOpen: false,
    filterType: "name",
  }

  componentDidMount() {
    const lastUpdate = moment(this.props.lastUpdate)
    const now = moment()
    const duration = moment.duration(now.diff(lastUpdate)).asSeconds()
    if (!duration || duration > DATA_CACHE_TIMEOUT) {
      this.fetchRecords(this.props.pagination)
    } else {
      const rows = this.getRows(this.props.records)
      this.setState({ rows: rows })
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.revision > oldProps.revision) {
      this.fetchRecords(this.props.pagination)
    }
  }

  getRows = (records) => {
    const rows = records.map((d) => {
      return this.props.toRowFunc(d, this.props.history)
    })
    return rows
  }

  getFilters = () => {
    const filter = []
    const filters = this.props.filters ? this.props.filters : {}
    const keys = Object.keys(filters)
    // [{ k: "name", o: "regex", v: "log" }]

    keys.forEach((k) => {
      let definition = {}
      this.props.filtersDefinition.forEach((f) => {
        if (f.category === k) {
          definition = f
        }
      })

      // convert to target data type
      const values = filters[k].map((v) => {
        switch (definition.dataType) {
          case "boolean":
            return v === "true"
          default:
            return v
        }
      })

      switch (definition.dataType) {
        case "boolean":
          filter.push({ k: k, o: "in", v: values })
          break
        default:
          if (k === "labels") {
            values.forEach((value) => {
              const kv = value.split("=", 2)
              if (kv.length === 2) {
                filter.push({ k: "labels." + kv[0], o: "eq", v: kv[1] })
              }
            })
          } else {
            if (values.length === 1) {
              filter.push({ k: k, o: "regex", v: values[0] })
            } else if (values.length > 1) {
              filter.push({ k: k, o: "in", v: values })
            }
          }
          break
      }
    })
    // filter.push({ k: "provider.type", o: "eq", v: "MySensors" })
    // console.log(filter, this.props.filters)
    return filter
  }

  fetchRecords = (pagination) => {
    const filter = this.getFilters()

    const _page = {
      limit: pagination.limit,
      offset: pagination.limit * pagination.page,
      filter: filter,
    }

    // update sortBy
    if (this.props.sortBy.field) {
      _page.sortBy = [{ f: this.props.sortBy.field, o: this.props.sortBy.direction }]
    }

    this.props
      .apiGetRecords(_page)
      .then((res) => {
        if (res.data.count > 0 && res.data.data.length === 0) {
          const paginationNew = { ...pagination }
          paginationNew.page = pagination.page - 1
          _page.offset = _page.limit * paginationNew.page
          this.props
            .apiGetRecords(_page)
            .then((newRes) => {
              const rows = this.getRows(newRes.data.data)
              this.setState({ rows: rows }, () =>
                this.props.updateRecordsFunc({
                  records: newRes.data.data,
                  count: newRes.data.count,
                  pagination: paginationNew,
                })
              )
            })
            .catch((e) => {
              console.log(e)
              this.props.loadingFailedFunc()
            })
        } else {
          const rows = this.getRows(res.data.data)
          this.setState({ rows: rows }, () =>
            this.props.updateRecordsFunc({ records: res.data.data, count: res.data.count, pagination })
          )
        }
      })
      .catch((e) => {
        console.log(e)
        this.props.loadingFailedFunc()
      })
  }

  withRefresh = (actionFunc) => {
    if (actionFunc) {
      actionFunc(this.getSelectedRowIDs()).then((res) => {
        this.fetchRecords(this.props.pagination)
      })
    }
  }

  onPerPage = (_e, perPage) => {
    this.fetchRecords({ limit: perPage, page: 0 })
  }

  onPageSet = (_e, page) => {
    const pagination = { ...this.props.pagination }
    pagination.page = page - 1
    this.fetchRecords(pagination)
  }

  onSelect = (event, isSelected, rowId) => {
    //console.log(rowId, isSelected)
    this.setState((prevState) => {
      let rows
      if (rowId === -1) {
        rows = prevState.rows.map((row) => {
          row.selected = isSelected
          return row
        })
      } else {
        rows = [...prevState.rows]
        rows[rowId].selected = isSelected
      }
      return { rows }
    })
  }

  getSelectedRowIDs = () => {
    const selectedIDs = []
    this.state.rows.forEach((row) => {
      if (row.selected) {
        selectedIDs.push(row.rid)
      }
    })
    return selectedIDs
  }

  onDeleteActionClick = () => {
    this.setState({ showDeleteDialog: true })
  }

  onDeleteActionCloseClick = () => {
    this.setState({ showDeleteDialog: false })
  }

  onDeleteActionOkClick = () => {
    this.setState({ showDeleteDialog: false }, () => {
      this.withRefresh(this.props.apiDeleteRecords)
    })
  }

  onFilterTypeToggle = () => {
    this.setState((prevState) => {
      return { filterTypeOpen: !prevState.filterTypeOpen }
    })
  }

  onFilterTypeChange = (e, newType) => {
    this.setState({ filterType: newType, filterTypeOpen: false })
  }

  onFilterUpdate = (category, value) => {
    this.props.updateFilterFunc({ category, value })
  }

  onDeleteChipFunc = (category, value) => {
    this.props.deleteFilterValueFunc({ category, value })
  }

  onDeleteChipGroupFunc = (category) => {
    this.props.deleteFilterCategoryFunc({ category })
  }

  onClearAllFilters = () => {
    this.props.deleteAllFilterFunc()
  }

  onSortBy = (_event, index, direction) => {
    //console.log(index, direction, this.props.tableColumns[index])
    const header = this.props.tableColumns[index - 1]
    if (header) {
      this.props.onSortByFunc({ field: header.fieldKey, direction, index })
    }
  }

  render() {
    const elements = []

    // update table headers
    const tableColumns = this.props.tableColumns.map((tc) => {
      const header = { title: tc.title }
      if (tc.sortable) {
        header.transforms = [sortable]
      }
      return header
    })

    if (this.props.loading) {
      elements.push(<McSpinner key="spinner" />)
    } else {
      elements.push(
        <McToolbar
          key="tb1"
          rowsSelectionCount={this.getSelectedRowIDs().length}
          refreshFn={() => this.fetchRecords(this.props.pagination, this.state.filters)}
          items={this.toolbar}
          groupAlignment={{ right1: "alignRight" }}
          resourceName={this.resourceName}
          clearAllFilters={this.onClearAllFilters}
          //filters={this.props.filters(this.onFilterToggle, this.state.filterOpen)}
          filters={
            <Filters
              filters={this.props.filtersDefinition}
              selectedCategory={this.state.filterType}
              chips={this.props.filters}
              isTypeOpen={this.state.filterTypeOpen}
              typeToggleFunc={this.onFilterTypeToggle}
              onTypeChangeFunc={this.onFilterTypeChange}
              deleteChipFunc={this.onDeleteChipFunc}
              deleteChipGroupFunc={this.onDeleteChipGroupFunc}
              key="filters"
              onFilterUpdate={this.onFilterUpdate}
            />
          }
        />
      )
      const tbl = (
        <div key="main-table">
          <Table
            aria-label="Compact Table"
            variant={TableVariant.compact}
            cells={tableColumns}
            rows={this.state.rows}
            rowLabeledBy="rowIndex"
            canSelectAll={true}
            onSelect={this.onSelect}
            className="mc-table"
            sortBy={this.props.sortBy}
            onSort={this.onSortBy}
            rowWrapper={(props) => {
              // console.log(props)
              return <RowWrapper {...props} className={props.row.selected ? "table-row-selected" : ""} />
            }}
            borders={true}
          >
            <TableHeader />
            <TableBody
              rowKey="rid"
              //onRowClick={(e, cells, rowData) => this.onSelect(e, !cells.selected, rowData.rowIndex)}
            />
          </Table>
          <Flex>
            <FlexItem>
              <LastUpdate time={this.props.lastUpdate} />
            </FlexItem>
            <FlexItem align={{ default: "alignRight" }}>
              <Pagination
                itemCount={this.props.count}
                widgetId="pagination-options-menu-bottom"
                perPage={this.props.pagination.limit}
                page={this.props.pagination.page + 1}
                variant={PaginationVariant.bottom}
                onSetPage={this.onPageSet}
                onPerPageSelect={this.onPerPage}
              />
            </FlexItem>
          </Flex>
          <DeleteDialog
            resourceName={this.props.resourceName}
            show={this.state.showDeleteDialog}
            onCloseFn={this.onDeleteActionCloseClick}
            onOkFn={this.onDeleteActionOkClick}
          />
        </div>
      )
      elements.push(<Divider key="divider" />)
      elements.push(tbl)
      /*
      elements.push(
        <>
          <br></br>
          <Card>
            <CardBody>
              <pre>{JSON.stringify(this.state.data, null, 2)}</pre> 
            </CardBody>
          </Card>
        </>
      )
      */
    }

    return elements
  }
}

ListPage.propTypes = {
  apiGetRecords: PropTypes.func,
  apiDeleteRecords: PropTypes.func,
  tableColumns: PropTypes.array,
  toRowFunc: PropTypes.func,
  resourceName: PropTypes.string,
  filtersDefinition: PropTypes.array,

  // load from redux
  loading: PropTypes.bool,
  records: PropTypes.array,
  pagination: PropTypes.object,
  count: PropTypes.number,
  lastUpdate: PropTypes.number,
  revision: PropTypes.number,
  filters: PropTypes.object,
  sortBy: PropTypes.object,

  // map redux functions
  updateRecordsFunc: PropTypes.func,
  updatePaginationFunc: PropTypes.func,
  loadingFunc: PropTypes.func,
  loadingFailedFunc: PropTypes.func,
  updateFilterFunc: PropTypes.func,
  deleteFilterValueFunc: PropTypes.func,
  deleteFilterCategoryFunc: PropTypes.func,
  deleteAllFilterFunc: PropTypes.func,
  onSortByFunc: PropTypes.func,
}
