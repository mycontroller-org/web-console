import React from "react"

import PageTitle from "../../../Components/PageTitle/PageTitle"
import PageContent from "../../../Components/PageContent/PageContent"
import { Table, TableHeader, TableBody, TableVariant, RowWrapper } from "@patternfly/react-table"
import { Divider, Pagination, PaginationVariant } from "@patternfly/react-core"
import { api } from "../../../Service/Api"
import McToolbar from "../../../Components/McToolbar/McToolbar"
import McSpinner from "../../../Components/McSpinner/McSpinner"
import { DetailedView, getStatus, getStatusBool } from "../../../Components/McIcons/McIcons"
import "./List.css"

const columns = [
  <span className="align-center">Enabled</span>,
  "Name",
  "Provider",
  "Protocol",
  <span className="align-center">Status</span>,
  "Since",
  "Message",
  "",
]
export default class GatewayListPage extends React.Component {
  state = {
    loading: true,
    rows: [],
  }

  componentDidMount() {
    api.gateway.list({ offset: 0, limit: 10 }).then((res) => {
      const rows = res.data.data.map((d) => {
        return {
          cells: [
            { title: getStatusBool(d.enabled) },
            d.name,
            d.provider.type,
            d.provider.protocolType,
            { title: getStatus(d.state.status) },
            d.state.since,
            d.state.message,
            { title: <DetailedView onClick={() => console.log("clicked details")} /> },
          ],
          rid: d.id,
        }
      })
      this.setState({ rows: rows, data: res.data, loading: false })
    })
  }

  onSelect = (event, isSelected, rowId) => {
    console.log(rowId, isSelected)
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
      // toolbar
      const actions = [
        {
          type: "enable",
          onClick: () => {
            console.log("Enabled clicked")
          },
        },
        { type: "disable" },
        { type: "reload" },
        { type: "separator" },
        { type: "edit", disabled: true },
        { type: "delete" },
      ]

      const toolbarItems = [
        { type: "actions", group: "right1", actions: actions, disabled: false },
        { type: "separator", group: "right1" },
        {
          type: "addButton",
          group: "right1",
          onClick: () => {
            console.log("clicked details")
          },
        },
      ]

      elements.push(<McToolbar key="tb1" items={toolbarItems} groupAlignment={{ right1: "alignRight" }} />)

      const tbl = (
        <div key="main-table">
          <Table
            aria-label="Compact Table"
            variant={TableVariant.compact}
            cells={columns}
            rows={this.state.rows}
            canSelectAll={true}
            onSelect={this.onSelect}
            className="mc-table"
            rowWrapper={(props) => {
              console.log(props)
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
            itemCount={this.state.data.count}
            widgetId="pagination-options-menu-bottom"
            perPage={this.state.data.limit}
            page={this.state.data.offset + 1}
            variant={PaginationVariant.bottom}
            onSetPage={() => {}}
            onPerPageSelect={() => {}}
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
        <PageTitle title="Gateway" />
        <PageContent content="List Gateways">{elements}</PageContent>
      </React.Fragment>
    )
  }
}
