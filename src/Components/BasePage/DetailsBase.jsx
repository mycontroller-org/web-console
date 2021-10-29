import { Divider, Tab, Tabs, TabTitleText } from "@patternfly/react-core"
import PropTypes from "prop-types"
import React from "react"
import { withTranslation } from "react-i18next"
import PageContent from "../PageContent/PageContent"
import PageTitle from "../PageTitle/PageTitle"
import "./DetailsBase.scss"

// tabs structure
// Tab {
//     name: "",
//     content: Object,
//     key: "",
// }

class DetailsPage extends React.Component {
  state = {
    activeTabKey: "",
    tabs: [],
  }

  componentDidMount() {
    if (this.props.tabs && this.props.tabs.length > 0) {
      const tabs = []
      this.props.tabs.forEach((tab, index) => {
        tabs.push({ ...tab, key: tab.name + "_" + index })
      })
      const firstTabKey = tabs[0].key
      this.setState({ activeTabKey: firstTabKey, tabs })
    }
  }

  onTabClick = (_event, tabKey) => {
    this.setState({ activeTabKey: tabKey })
  }

  render() {
    let tabsData = null
    let tabContent = null
    const { t, pageHeader } = this.props

    if (this.state.tabs.length > 0) {
      const tabElements = []
      this.state.tabs.forEach((tab) => {
        tabElements.push(
          <Tab
            key={tab.key}
            id={tab.key}
            eventKey={tab.key}
            title={<TabTitleText>{t(tab.name)}</TabTitleText>}
          ></Tab>
        )
        if (this.state.activeTabKey === tab.key) {
          tabContent = tab.content
        }
      })

      tabsData = (
        <Tabs
          key="rootTabs"
          style={{ marginBottom: "7px" }}
          activeKey={this.state.activeTabKey}
          onSelect={this.onTabClick}
          isBox={false}
        >
          {tabElements}
        </Tabs>
      )
    } else {
      tabContent = <span>No tabs supplied</span>
    }

    return (
      <>
        <PageTitle title={pageHeader} hideDivider={true} />
        <PageContent>
          <Divider component="hr" />
          {tabsData}
          {tabContent}
        </PageContent>
      </>
    )
  }
}

DetailsPage.propTypes = {
  pageHeader: PropTypes.string,
  actions: PropTypes.array,
  tabs: PropTypes.array,
}

export default withTranslation()(DetailsPage)
