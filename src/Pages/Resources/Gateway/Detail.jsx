import React from "react"
import { api } from "../../../Service/Api"
import DetailBase from "../../../Components/BasePage/DetailBase"

import { getStatus } from "../../../Components/McIcons/McIcons"
import { KeyValueMap, Labels } from "../../../Components/Label/Label"

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
  provider.push(wrapFieldFunc("Protocol", data.provider.protocolType))

  provider.push(wrapFieldFunc("Configuration", <KeyValueMap data={data.provider.config} />))

  const jsonData = JSON.stringify(data, null, 2)
  const content = []

  content.push(wrapCardFunc("Overview", fields))
  content.push(wrapCardFunc("Provider", provider))
  content.push(wrapCardFunc("JSON", <pre>{jsonData}</pre>))

  return content
}

// supply required properties
Detail.defaultProps = {
  resourceName: "Gateway",
  apiGetRecord: api.gateway.get,
  renderFunc: renderFunc,
  redirectUpdatePage: "",
}

export default Detail
