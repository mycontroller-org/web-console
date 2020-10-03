import React from "react"
import RGL, { WidthProvider } from "react-grid-layout"
import "chartjs-plugin-colorschemes"
// https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html

import {
  Card,
  CardBody,
  CardTitle,
  Spinner,
  PageSection,
  PageSectionVariants,
  Divider,
} from "@patternfly/react-core"

import PageContent from "../../Components/PageContent/PageContent"

import "./Dashboard.scss"
import Selector from "../../Components/Selector/Seletor"

const ReactGridLayout = WidthProvider(RGL)

class Dashboard extends React.Component {
  state = {
    loading: true,
    nData: [],
    isOpen: false,
    selected: "",
    searchValue: "",
    filteredItems: [],
  }

  componentDidMount() {}

  onToggle = (event, isOpen) => {
    this.setState({
      isOpen,
    })
  }

  onSelect = (event, value) => {
    this.setState({
      selected: value,
      isOpen: !this.state.isOpen,
    })
  }

  onSearchInputChange = (value) => {
    this.setState({ searchValue: value })
  }

  onSearchButtonClick = (event) => {
    const filtered =
      this.state.searchValue === ""
        ? this.items
        : this.items.filter((str) => str.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1)

    this.setState({ filteredItems: filtered || [] })
  }

  render() {
    const pageContent = []
    if (this.state.loading) {
      pageContent.push(<Spinner key="loading" size="md" />)
    } else {
      const layout = [
        {
          i: "id-1",
          x: 0,
          y: 0,
          w: 100,
          h: 40,
          isDraggable: true,
          isResizable: true,
        },
        {
          i: "id-2",
          x: 0,
          y: 0,
          w: 100,
          h: 60,
          isDraggable: true,
          isResizable: true,
        },
      ]

      const cardWrapper = (items) => {
        return items.map((item) => {
          return (
            <div key={item.key}>
              <Card isHoverable={false} isCompact={true} id="dashboard-card">
                {item.title ? <CardTitle className="dashboard-card-title">{item.title}</CardTitle> : null}
                <CardBody id="dashboard-card" className="dashboard-card-body">
                  {item.content}
                </CardBody>
              </Card>
            </div>
          )
        })
      }

      const lChange = (l) => {
        console.log(JSON.stringify(l, " ", 2))
      }

      pageContent.push(
        <ReactGridLayout
          key="dashboardLayout"
          className="layout"
          layout={layout}
          cols={100}
          rowHeight={1}
          isResizable={true}
          isDraggable={true}
          autoSize={true}
          margin={[7, 7]}
          containerPadding={[0, 0]}
          onLayoutChange={lChange}
        >
          {cardWrapper([])}
        </ReactGridLayout>
      )
    }

    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <Selector prefix="Dashboard" />
          <Divider component="li" style={{ marginTop: "2px" }} />
        </PageSection>

        <PageContent>{pageContent}</PageContent>
      </React.Fragment>
    )
  }
}

export default Dashboard
