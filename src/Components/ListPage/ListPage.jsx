import React from "react"
import PageTitle from "../PageTitle/PageTitle"
import PageContent from "../PageContent/PageContent"
import { Table, TableHeader, TableBody, TableVariant, RowWrapper } from "@patternfly/react-table"
import { Divider, Pagination, PaginationVariant } from "@patternfly/react-core"
import McToolbar from "../McToolbar/McToolbar"
import McSpinner from "../McSpinner/McSpinner"
import "./ListPage.css"
import DeleteDialog from "../Dialog/DeleteDialog"

export default class ListPage extends React.Component {
  state = {
    loading: true,
    rows: [],
    count: 0,
    pagination: {
      limit: 10,
      page: 0,
    },
  }

  fetchRecords = (pagination) => {
    const _page = {
      limit: pagination.limit,
      offset: pagination.limit * pagination.page,
    }
    this.props
      .listFn(_page)
      .then((res) => {
        const rows = res.data.data.map((d) => {
          return this.props.rowFn(d)
        })
        this.setState({ rows: rows, data: res.data, loading: false, pagination, count: res.data.count })
      })
      .catch((e) => {
        this.setState({ loading: false })
      })
  }

  componentDidMount() {
    const pagination = { limit: 10, page: 0 }
    this.fetchRecords(pagination)
  }

  onPerPage = (e, perPage) => {
    console.log("per page called")
    this.fetchRecords({ limit: perPage, page: 0 })
  }

  onPageSet = (e, page) => {
    const pagination = { ...this.state.pagination }
    pagination.page = page - 1
    this.fetchRecords(pagination)
  }

  /*
  // onPageSet called on the below actions

  onNextPage = () => {
    console.log("next called")
    const pagination = { ...this.state.pagination }
    pagination.page = pagination.page + 1
    this.fetchRecords(pagination)
  }

  onPreviousPage = () => {
    const pagination = { ...this.state.pagination }
    pagination.page = pagination.page - 1
    this.fetchRecords(pagination)
  }

  onFirstPage = (e, page) => {
    const pagination = { ...this.state.pagination }
    pagination.page = page - 1
    this.fetchRecords(pagination)
  }

  onLastPage = (e, page) => {
    const pagination = { ...this.state.pagination }
    pagination.page = page - 1
    this.fetchRecords(pagination)
  }
  */

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

  render() {
    const elements = []
    if (this.state.loading) {
      elements.push(<McSpinner key="spinner" />)
    } else {
      elements.push(
        <McToolbar
          key="tb1"
          rows={this.state.rows}
          refreshFn={() => this.fetchRecords(this.state.pagination)}
          items={this.props.toolbar}
          groupAlignment={{ right1: "alignRight" }}
          resourceName={this.props.resourceName}
        />
      )

      const tbl = (
        <div key="main-table">
          <Table
            aria-label="Compact Table"
            variant={TableVariant.compact}
            cells={this.props.columns}
            rows={this.state.rows}
            canSelectAll={true}
            onSelect={this.onSelect}
            className="mc-table"
            rowWrapper={(props) => {
              // console.log(props)
              return <RowWrapper {...props} className={props.row.selected ? "table-row-selected" : ""} />
            }}
            borders={true}
          >
            <TableHeader />
            <TableBody
            //onRowClick={(e, cells, rowData) => this.onSelect(e, !cells.selected, rowData.rowIndex)}
            />
          </Table>
          <Pagination
            itemCount={this.state.count}
            widgetId="pagination-options-menu-bottom"
            perPage={this.state.pagination.limit}
            page={this.state.pagination.page + 1}
            variant={PaginationVariant.bottom}
            onSetPage={this.onPageSet}
            onPerPageSelect={this.onPerPage}
            //onNextClick={this.onNextPage}
            //onPreviousClick={this.onPreviousPage}
            //onFirstClick={this.onFirstPage}
            //onLastClick={this.onLastPage}
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

    return (
      <React.Fragment>
        <PageTitle title={this.props.title} />
        <PageContent>{elements}</PageContent>
      </React.Fragment>
    )
  }
}
