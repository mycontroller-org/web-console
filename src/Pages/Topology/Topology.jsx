import React from "react"
import { Spinner } from "@patternfly/react-core"
import "./Topology.css"
import {
  TopologyView,
  TopologyControlBar,
  createTopologyControlButtons,
  TopologySideBar,
} from "@patternfly/react-topology"
import PageContent from "../../Components/PageContent/PageContent"
import PageTitle from "../../Components/PageTitle/PageTitle"

import { ItemDetails } from "./ItemDetails"
import { ViewToolbar } from "./ViewToolbar"
import { ProjectToolbar } from "./ProjectToolbar"

class TopologyPage extends React.Component {
  state = {
    loading: false,
    nData: [],
    isOpen: false,
    selected: "",
    searchValue: "",
    filteredItems: [],
    detailsShown: false,
  }

  componentDidMount() {}

  render() {
    const { detailsShown } = this.state

    const elements = []
    if (this.state.loading) {
      elements.push(<Spinner key="loading" size="md" />)
    } else {
      const controlButtons = createTopologyControlButtons()
      const sideBar = (
        <ItemDetails show={detailsShown} onClose={() => this.setState({ detailsShown: false })} />
      )
      elements.push(
        <TopologyView
          className="ws-react-c-topology"
          contextToolbar={<ProjectToolbar />}
          viewToolbar={<ViewToolbar />}
          controlBar={<TopologyControlBar controlButtons={controlButtons} />}
          sideBar={sideBar}
          sideBarOpen={detailsShown}
        >
          <button onClick={() => this.setState({ detailsShown: !detailsShown })}>
            {detailsShown ? "Hide Details" : "Show Details"}
          </button>
        </TopologyView>
      )
    }

    return (
      <React.Fragment>
        <PageTitle title="Topology" />
        <PageContent>{elements}</PageContent>
      </React.Fragment>
    )
  }
}

export default TopologyPage
