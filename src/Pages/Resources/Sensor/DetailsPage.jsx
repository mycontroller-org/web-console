import React from "react"
import DetailRootPage from "../../../Components/BasePage/DetailsBase"
import CodeEditor from "../../../Components/CodeEditor/CodeEditor"
import { api } from "../../../Service/Api"
import TabDetails from "./TabDetails"

class NodeDetailPage extends React.Component {
  render() {
    const { id } = this.props.match.params

    const tabs = [
      {
        name: "Details",
        content: <TabDetails resourceId={id} history={this.props.history} />,
      },
      {
        name: "YAML",
        content: (
          <CodeEditor
            resourceId={id}
            language="yaml"
            apiGetRecord={api.sensor.get}
            apiSaveRecord={api.sensor.update}
            minimapEnabled
            onCancelFunc={() => {}}
          />
        ),
      },
    ]
    return <DetailRootPage pageHeader="Sensor Details" tabs={tabs} />
  }
}

export default NodeDetailPage
