import React from "react"
import DetailRootPage from "../../../Components/BasePage/DetailRoot"
import YamlBase from "../../../Components/BasePage/YamlBase"
import { api } from "../../../Service/Api"
import TabDetails from "./TabDetails"

class NodeDetailPage extends React.Component {
  render() {
    const myTabs = [
      // {
      //   name: "Nodes",
      //   content: <NodesList match={this.props.match} history={this.props.history} />,
      // },
      {
        name: "Details",
        content: <TabDetails match={this.props.match} history={this.props.history} />,
      },
      {
        name: "Edit",
        content: <span>Edit tab</span>,
      },
      {
        name: "YAML",
        content: (
          <YamlBase
            apiGetRecord={api.sensor.get}
            apiSaveRecord={api.sensor.update}
            match={this.props.match}
            options={{ minimap: { enabled: true }, readOnly: false }}
          />
        ),
      },
    ]
    return <DetailRootPage pageHeader="Sensor Details" tabs={myTabs} />
  }
}

export default NodeDetailPage
