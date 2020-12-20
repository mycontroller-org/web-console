import React from "react"
import DetailRootPage from "../../../Components/BasePage/DetailsBase"
import CodeEditor from "../../../Components/CodeEditor/CodeEditor"
import { api } from "../../../Service/Api"
import TabDetails from "./TabDetails"

class GatewayDetailPage extends React.Component {
  render() {
    const { id } = this.props.match.params
    const tabs = [
      {
        name: "Details",
        content: <TabDetails resourceId={id} history={this.props.history} />,
      },
      {
        name: "Edit",
        content: <span>Edit tab</span>,
      },
      {
        name: "YAML",
        content: (
          <CodeEditor
            resourceId={id}
            language="yaml"
            apiGetRecord={api.gateway.get}
            apiSaveRecord={api.gateway.update}
            minimapEnabled
            onCancelFunc={() => {}}
          />
        ),
      },
    ]
    return <DetailRootPage pageHeader="Gateway Details" tabs={tabs} />
  }
}

export default GatewayDetailPage
