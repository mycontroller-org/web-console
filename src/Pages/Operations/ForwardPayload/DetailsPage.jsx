import React from "react"
import DetailRootPage from "../../../Components/BasePage/DetailsBase"
import TabDetails from "./TabDetails"
import UpdatePage from "./UpdatePage"
import { withTranslation } from "react-i18next"

class GatewayDetailPage extends React.Component {
  render() {
    const { id } = this.props.match.params
    const { t } = this.props
    const tabs = [
      {
        name: t("details"),
        content: <TabDetails resourceId={id} history={this.props.history} />,
      },
      {
        name: t("edit"),
        content: <UpdatePage match={this.props.match} history={this.props.history} />,
      },
    ]
    return <DetailRootPage pageHeader={t("forward_payload_details")} tabs={tabs} />
  }
}

export default withTranslation()(GatewayDetailPage)
