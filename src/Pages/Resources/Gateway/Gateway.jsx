import React from "react"

import PageTitle from "../../../Components/PageTitle/PageTitle"
import PageContent from "../../../Components/PageContent/PageContent"
import { Table, TableHeader, TableBody, TableVariant } from "@patternfly/react-table"
import { Card, CardBody } from "@patternfly/react-core"
import { api } from "../../../Service/Api"
import { CircleIcon, OutlinedCircleIcon } from "@patternfly/react-icons"

const columns = ["Enabled", "Name", "Provider", "Type", "Status", "Since", "Message"]
export default class GatewayPage extends React.Component {
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
    if (this.state.loading) {
      return <span>Loading...</span>
    }
    const rows = this.state.data.map((d) => {
      return [
        { title: d.enabled ? <CircleIcon /> : <OutlinedCircleIcon /> },
        d.name,
        d.providerConfig.type,
        d.providerConfig.gatewayType,
        d.state.status,
        d.state.since,
        d.state.message,
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
    return (
      <React.Fragment>
        <PageTitle title="Gateway" />
        <PageContent content="List Gateways">
          {tbl}
          <br></br>
          <Card>
            <CardBody>
              <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
            </CardBody>
          </Card>
        </PageContent>
      </React.Fragment>
    )
  }
}
