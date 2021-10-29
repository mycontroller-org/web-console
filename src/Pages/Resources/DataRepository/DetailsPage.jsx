import React from "react"
import DetailRootPage from "../../../Components/BasePage/DetailsBase"
import TabDetails from "./TabDetails"
import UpdatePage from "./UpdatePage"

class GatewayDetailPage extends React.Component {
  render() {
    const { id } = this.props.match.params
    const tabs = [
      {
        name: "details",
        content: <TabDetails resourceId={id} history={this.props.history} />,
      },
      {
        name: "edit",
        content: <UpdatePage match={this.props.match} history={this.props.history} />,
      },
    ]
    return <DetailRootPage pageHeader="data_repository_modify_an_entry" tabs={tabs} />
  }
}

export default GatewayDetailPage
