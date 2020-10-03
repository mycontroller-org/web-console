import React from "react"
import { api } from "../../../Service/Api"
import DetailBase from "../../../Components/BasePage/DetailBase"

import { getStatus } from "../../../Components/McIcons/McIcons"
import { KeyValueMap, Labels } from "../../../Components/Label/Label"
import { LastSeen } from "../../../Components/Time/Time"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { GridItem, Button } from "@patternfly/react-core"
import Table from "../../../Components/Table/Table"

class Detail extends DetailBase {
  componentDidMount() {
    this.loadDetail()
  }

  render() {
    return super.render()
  }
}

const renderFunc = (data, wrapFieldFunc, wrapCardFunc) => {
  const fields = []
  fields.push(wrapFieldFunc("ID", data.id))
  fields.push(wrapFieldFunc("Gateway ID", data.gatewayId))
  fields.push(wrapFieldFunc("Node ID", data.nodeId))
  fields.push(wrapFieldFunc("Name", data.name))
  fields.push(wrapFieldFunc("Status", getStatus(data.state.status)))
  fields.push(wrapFieldFunc("Last Seen", data.lastSeen))

  const others = []
  others.push(wrapFieldFunc("Labels", <Labels data={data.labels} />))
  others.push(wrapFieldFunc("Others", <KeyValueMap data={data.others} />))

  const jsonData = JSON.stringify(data, null, 2)
  const content = []

  content.push(wrapCardFunc("Overview", fields))
  content.push(wrapCardFunc("Labels and Others", others))
  content.push(wrapCardFunc("JSON", <pre>{jsonData}</pre>))

  return content
}

// Properties definition
const tableColumnsSensor = [
  { title: "Sensor ID", fieldKey: "sensorId", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Last Seen", fieldKey: "lastSeen", sortable: true },
]

const tableRowsSensor = (rawData, _index, history) => {
  return {
    cells: [
      {
        title: (
          <Button
            variant="link"
            isInline
            onClick={(_e) => {
              r(history, rMap.resources.sensor.detail, { id: rawData.id })
            }}
          >
            {rawData.sensorId}
          </Button>
        ),
      },
      rawData.name,
      { title: <LastSeen date={rawData.lastSeen} /> },
    ],
    rid: rawData.id,
  }
}

const updateSensorDataFunc = (self, data) => {
  const others = []
  const filters = { gatewayId: data.gatewayId, nodeId: data.nodeId }

  others.push(
    <GridItem key="sensor_table" sm={12}>
      <Table
        title="Sensors"
        apiGetRecords={api.sensor.list}
        tableColumns={tableColumnsSensor}
        toRowFunc={tableRowsSensor}
        history={self.props.history}
        filters={filters}
      />
    </GridItem>
  )
  self.setState({ others: others })
}

// supply required properties
Detail.defaultProps = {
  resourceName: "Node Details",
  apiGetRecord: api.node.get,
  renderFunc: renderFunc,
  redirectUpdatePage: "",
  updateOtherDataFunc: updateSensorDataFunc,
}

export default Detail
