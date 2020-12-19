// https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html
import {
  Card,
  CardBody,
  CardTitle,



  Divider, PageSection,
  PageSectionVariants, Spinner
} from "@patternfly/react-core"
import "chartjs-plugin-colorschemes"
import React from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import PageContent from "../../Components/PageContent/PageContent"
import Selector from "../../Components/Selector/Seletor"
import SwitchPanel from "../../Components/Widgets/SwitchPanel/SwitchPanel"
import { api } from "../../Service/Api"
import "./Dashboard.scss"



const ResponsiveGridLayout = WidthProvider(Responsive)

class Dashboard extends React.Component {
  state = {
    loading: false,
    nData: [],
    isOpen: false,
    selected: "",
    searchValue: "",
    filteredItems: [],
    resources: [],
  }

  componentDidMount() {
    api.sensorField.list({ filter: [{ k: "metricType", v: "binary" }] }).then((res) => {
      const resources = res.data.data.map((f) => {
        return {
          id: f.id,
          label: f.name,
          isChecked: f.payload.value,
          quickId: "sf:" + f.gatewayId + "." + f.nodeId + "." + f.sensorId + "." + f.fieldId,
        }
      })
      this.setState({ resources })
    })
  }

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
          i: "id-0",
          x: 0,
          y: 0,
          w: 20,
          h: 60,
          isDraggable: true,
          isResizable: true,
        },
        {
          i: "id-1",
          x: 0,
          y: 0,
          w: 20,
          h: 20,
          isDraggable: true,
          isResizable: true,
        },
        {
          i: "id-2",
          x: 20,
          y: 0,
          w: 20,
          h: 20,
          isDraggable: true,
          isResizable: true,
        },
      ]

      const cardWrapper = (items) => {
        return items.map((item) => {
          return (
            <div key={item.key}>
              <Card isHoverable={false} isCompact={true} id="dashboard-card">
                {item.title ? (
                  <CardTitle className="dashboard-card-title">
                    {item.title}
                    <Divider />
                  </CardTitle>
                ) : null}
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

      const items = []

      items.push({
        key: "id-0",
        title: "Switches",
        content: <SwitchPanel resources={this.state.resources} />,
      })

      // items.push({
      //   key: "id-1",
      //   title: "hello",
      //   content: (
      //     <Switch
      //       id="simple-switch"
      //       label="Message when on"
      //       labelOff="Message when off"
      //       isChecked={true}
      //       onChange={() => {}}
      //     />
      //   ),
      // })
      // items.push({
      //   key: "id-2",
      //   content: (
      //     <Switch
      //       id="simple-switch"
      //       label="Message when on"
      //       labelOff="Message when off"
      //       isChecked={true}
      //       onChange={() => {}}
      //     />
      //   ),
      // })

      pageContent.push(
        // <ReactGridLayout
        //   key="dashboardLayout"
        //   className="layout"
        //   layout={layout}
        //   cols={100}
        //   rowHeight={1}
        //   isResizable={true}
        //   isDraggable={true}
        //   autoSize={true}
        //   margin={[7, 7]}
        //   containerPadding={[0, 0]}
        //   onLayoutChange={lChange}
        // >
        //   {cardWrapper(items)}
        // </ReactGridLayout>
        <ResponsiveGridLayout
          key="dashboardLayout"
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 100, md: 80, sm: 50, xs: 25, xxs: 10 }}
          rowHeight={1}
          autoSize={true}
          margin={[7, 7]}
          containerPadding={[0, 0]}
          onLayoutChange={lChange}
          preventCollision={false}
        >
          {cardWrapper(items)}
        </ResponsiveGridLayout>
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
