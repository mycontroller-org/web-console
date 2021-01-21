import React from "react"
import DetailRootPage from "../../../Components/BasePage/DetailsBase"
import TabDetails from "./TabDetails"
import UpdatePage from "./UpdatePage"
import FirmwareFileUpload from "./Upload"

class NodeDetailPage extends React.Component {
  render() {
    const { id } = this.props.match.params

    const tabs = [
      {
        name: "Details",
        content: <TabDetails resourceId={id} history={this.props.history} />,
      },
      {
        name: "Edit",
        content: <UpdatePage match={this.props.match} history={this.props.history} />,
      },
      {
        name: "Upload Firmware",
        content: <FirmwareFileUpload resourceId={id} />,
      },
    ]
    return <DetailRootPage pageHeader="Firmware Details" tabs={tabs} />
  }
}

export default NodeDetailPage
