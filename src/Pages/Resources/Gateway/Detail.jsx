import React from "react"
import YAML from "js-yaml"
import { api } from "../../../Service/Api"
import DetailBase from "../../../Components/BasePage/DetailBase"

import { getStatus } from "../../../Components/McIcons/McIcons"
import { KeyValueMap, Labels } from "../../../Components/Label/Label"
import { LastSeen } from "../../../Components/Time/Time"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { GridItem, Button } from "@patternfly/react-core"
import Table from "../../../Components/Table/Table"
import CodeEditor from "../../../Components/CodeEditor/CodeEditor"

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
  fields.push(wrapFieldFunc("Name", data.name))
  fields.push(wrapFieldFunc("Enabled", data.enabled ? "true" : "false"))
  fields.push(wrapFieldFunc("Status", <>{getStatus(data.state.status)}</>))
  fields.push(wrapFieldFunc("Acknowledgement", <KeyValueMap data={data.ack} />))
  fields.push(wrapFieldFunc("Labels", <Labels data={data.labels} />))

  const provider = []
  provider.push(wrapFieldFunc("Type", data.provider.type))
  provider.push(wrapFieldFunc("Protocol", data.provider.protocol.type))

  provider.push(wrapFieldFunc("Configuration", <KeyValueMap data={data.provider.config} />))

  const yamlData = YAML.safeDump(data)
  const content = []

  content.push(wrapCardFunc("Overview", fields))
  content.push(wrapCardFunc("Provider", provider))
  content.push(wrapCardFunc("YAML", <CodeEditor data={yamlData} />))

  return content
}

// Properties definition
const tableColumnsNode = [
  { title: "Node ID", fieldKey: "nodeId", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Version", fieldKey: "labels.version", sortable: true },
  { title: "Library Version", fieldKey: "labels.library_version", sortable: true },
  { title: "Status", fieldKey: "state.status", sortable: true },
  { title: "Last Seen", fieldKey: "lastSeen", sortable: true },
]

const tableRowsNode = (rawData, _index, history) => {
  return {
    cells: [
      {
        title: (
          <Button
            variant="link"
            isInline
            onClick={(_e) => {
              r(history, rMap.resources.node.detail, { id: rawData.id })
            }}
          >
            {rawData.nodeId}
          </Button>
        ),
      },
      rawData.name,
      rawData.labels.version,
      rawData.labels.library_version,
      { title: getStatus(rawData.state.status) },
      { title: <LastSeen date={rawData.lastSeen} /> },
    ],
    rid: rawData.id,
  }
}

const updateNodeDataFunc = (self, data) => {
  const others = []
  const filters = { gatewayId: data.id }

  others.push(
    <GridItem key="node_table" sm={12}>
      <Table
        title="Nodes"
        apiGetRecords={api.node.list}
        tableColumns={tableColumnsNode}
        toRowFunc={tableRowsNode}
        history={self.props.history}
        filters={filters}
      />
    </GridItem>
  )
  self.setState({ others: others })
}

// supply required properties
Detail.defaultProps = {
  resourceName: "Gateway Details",
  apiGetRecord: api.gateway.get,
  renderFunc: renderFunc,
  redirectUpdatePage: "",
  updateOtherDataFunc: updateNodeDataFunc,
}

export default Detail
