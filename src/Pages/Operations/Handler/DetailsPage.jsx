import React from "react"
import DetailRootPage from "../../../Components/BasePage/DetailsBase"
import TabDetails from "./TabDetails"
import UpdatePage from "./UpdatePage"

class GatewayDetailPage extends React.Component {
  render() {
    const { id } = this.props.match.params
    const { history, match } = this.props
    const tabs = [
      {
        name: "details",
        content: <TabDetails resourceId={id} history={history} />,
      },
      {
        name: "edit",
        content: <UpdatePage match={match} history={history} />,
      },
    ]
    return <DetailRootPage pageHeader="handler_details" tabs={tabs} />
  }
}

export default GatewayDetailPage
