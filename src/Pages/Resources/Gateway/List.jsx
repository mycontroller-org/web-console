import React from "react"

import PageTitle from "../../../Components/PageTitle/PageTitle"
import PageContent from "../../../Components/PageContent/PageContent"
import { Table, TableHeader, TableBody, TableVariant } from "@patternfly/react-table"
import { Card, CardBody, Divider } from "@patternfly/react-core"
import { api } from "../../../Service/Api"
import McToolbar from "../../../Components/McToolbar/McToolbar"
import McSpinner from "../../../Components/McSpinner/McSpinner"
import { DetailedView, getStatus, getStatusBool } from "../../../Components/McIcons/McIcons"

const columns = ["Enabled", "Name", "Provider", "Protocol", "Status", "Since", "Message", ""]
export default class GatewayListPage extends React.Component {
  state = {
    loading: true,
    data: [],
  }

  componentDidMount() {
    api.gateway.list({}).then((res) => {
      this.setState({ data: res.data, loading: false })
    })
  }

  onSelect(event, isSelected, rowId) {
    let rows
    if (rowId === -1) {
      rows = this.state.rows.map((oneRow) => {
        oneRow.selected = isSelected
        return oneRow
      })
    } else {
      rows = [...this.state.rows]
      rows[rowId].selected = isSelected
    }
    this.setState({
      rows,
    })
  }

  render() {
    const elements = []
    if (this.state.loading) {
      elements.push(<McSpinner />)
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
        { type: "actions", group: "right1", actions: actions },
        { type: "separator", group: "right1" },
        { type: "addButton", group: "right1", onClick: () => {} },
      ]

      elements.push(<McToolbar key="t1" items={toolbarItems} groupAlignment={{ right1: "alignRight" }} />)

      // table

      const rows = this.state.data.map((d) => {
        return [
          { title: getStatusBool(d.enabled) },
          d.name,
          d.provider.type,
          d.provider.protocolType,
          { title: getStatus(d.state.status) },
          d.state.since,
          d.state.message,
          { title: <DetailedView /> },
        ]
      })
      const tbl = (
        <Table
          aria-label="Compact Table"
          variant={TableVariant.compact}
          cells={columns}
          rows={rows}
          canSelectAll={true}
          onSelect={this.onSelect}
        >
          <TableHeader />
          <TableBody />
        </Table>
      )
      elements.push(<Divider />)
      elements.push(tbl)
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
    }

    return (
      <React.Fragment>
        <PageTitle title="Gateway" />
        <PageContent content="List Gateways">{elements}</PageContent>
      </React.Fragment>
    )
  }
}
