// https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html
import { AddCircleOIcon, CheckIcon, CloseIcon, EditIcon, TrashAltIcon } from "@patternfly/react-icons"
import "chartjs-plugin-colorschemes"
import React from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import { LinkButton } from "../../Components/Buttons/Buttons"
import PageContent from "../../Components/PageContent/PageContent"
import PageTitle from "../../Components/PageTitle/PageTitle"
import Selector from "../../Components/Selector/Seletor"
import { api } from "../../Service/Api"
import { getRandomId } from "../../Util/Util"
import "./Dashboard.scss"
import EditWidget from "../../Components/Widgets/EditWidget"
import LoadWidgets from "../../Components/Widgets/LoadWidgets"
import Actions from "../../Components/Actions/Actions"

const ResponsiveGridLayout = WidthProvider(Responsive)

class Dashboard extends React.Component {
  state = {
    loading: false,
    editEnabled: false,
    dashboards: [],
    selectionId: "",
    dashboardOnEdit: {},
    showEditWidget: false,
    targetWidget: {},
  }

  componentDidMount() {
    api.dashboard
      .list({})
      .then((res) => {
        this.setState({ dashboards: res.data.data, loading: false })
      })
      .catch((_e) => {
        this.setState({ loading: false })
      })
  }

  onEditClick = () => {
    this.setState((prevState) => {
      const { dashboards, selectionId } = prevState
      const dashboard = getItemById(dashboards, selectionId)
      return { editEnabled: true, dashboardOnEdit: dashboard }
    })
  }

  onAddWidgetClick = () => {}

  onSaveClick = () => {
    this.setState((prevState) => {
      api.dashboard.update(prevState.dashboardOnEdit).then((_res) => {
        this.setState({ editEnabled: false })
      })
      return {}
    })
  }

  onLayoutChange = (layouts) => {
    // console.log(JSON.stringify(layouts, " ", 2))
    if (!layouts || layouts.length == 0) {
      return
    }
    const layout = layouts[0]
    this.setState((prevState) => {
      const dashboardOnEdit = prevState.dashboardOnEdit
      const widgets = dashboardOnEdit.widgets
      if (!widgets) {
        return {}
      }
      for (let index = 0; index < widgets.length; index++) {
        if (widgets[index].id === layout.i) {
          const widget = widgets[index]
          widgets[index].layout = {
            ...widget.layout,
            ...layout,
          }
          break
        }
      }
      return { dashboardOnEdit }
    })
  }

  onCancelClick = () => {
    this.setState({ editEnabled: false })
  }

  onNewDashboardClick = () => {
    this.setState((prevState) => {
      const dashboard = getNewDashboard()
      const dashboards = prevState.dashboards
      dashboards.push(dashboard)
      return { selectionId: dashboard.id, dashboards: dashboards, editEnabled: true }
    })
  }

  onDeleteClick = () => {}

  onWidgetEdit = (config) => {
    console.log(config)
    this.setState({ showEditWidget: true, targetWidget: config })
  }

  onWidgetDelete = (widget) => {}

  onWidgetEditHide = () => {
    this.setState({ showEditWidget: false })
  }

  render() {
    const { loading, dashboards, selectionId, editEnabled, showEditWidget, targetWidget } = this.state

    const pageContent = []
    let title = ""
    const dashboardItems = []

    if (loading) {
      pageContent.push(<span>Loading</span>)
    } else if (dashboards.length === 0) {
      pageContent.push(<span>No dashboards found. Create new</span>)
    } else {
      const dashboard = selectionId === "" ? dashboards[0] : getItemById(dashboards, selectionId)

      title = dashboard.title

      // update dashboards
      dashboards.forEach((d) => {
        dashboardItems.push({
          id: d.id,
          text: d.title,
          bookmarked: d.bookmarked,
          disabled: d.disabled,
        })
      })

      const layouts = []
      dashboard.widgets.forEach((widget) => {
        layouts.push({
          i: widget.id,
          x: widget.layout.x,
          y: widget.layout.y,
          w: widget.layout.w,
          h: widget.layout.h,
          static: widget.static,
          isDraggable: editEnabled,
          isResizable: editEnabled,
        })
      })

      const widgetsLoaded = LoadWidgets(
        dashboard.widgets,
        editEnabled,
        this.onWidgetEdit,
        this.onWidgetDelete
      )

      pageContent.push(
        <ResponsiveGridLayout
          key="dashboardLayout"
          className="layout"
          layouts={{ lg: layouts }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 100, md: 80, sm: 50, xs: 25, xxs: 10 }}
          rowHeight={1}
          autoSize={true}
          margin={[7, 7]}
          containerPadding={[0, 0]}
          onLayoutChange={this.onLayoutChange}
          preventCollision={false}
        >
          {widgetsLoaded}
        </ResponsiveGridLayout>
      )
    }

    const actions = []

    if (editEnabled) {
      actions.push(
        <LinkButton text="Title" icon={EditIcon} onClick={this.onEditClick} />,
        <LinkButton text="Widget" icon={AddCircleOIcon} onClick={this.onAddWidgetClick} />,
        <LinkButton text="Save" icon={CheckIcon} onClick={this.onSaveClick} />,
        <LinkButton text="Cancel" icon={CloseIcon} onClick={this.onCancelClick} />
      )
    } else {
      const actionItems = [
        { type: "edit", onClick: this.onEditClick },
        { type: "new", onClick: this.onNewDashboardClick },
        { type: "delete", onClick: this.onDeleteClick },
      ]
      actions.push(<Actions items={actionItems} isDisabled={false} />)
    }

    return (
      <React.Fragment>
        <EditWidget showEditWidget={showEditWidget} widget={targetWidget} onCancel={this.onWidgetEditHide} />
        <PageTitle
          title={
            <Selector
              prefix="Dashboard"
              isDisabled={editEnabled}
              items={dashboardItems}
              selection={{ text: title }}
            />
          }
          actions={actions}
        />
        <PageContent>{pageContent}</PageContent>
      </React.Fragment>
    )
  }
}

export default Dashboard

// helper functions

const getItemById = (items, id) => {
  if (id === "") {
    return items[0]
  }
  for (let index = 0; index < items.length; index++) {
    if (items[index].id === id) {
      return items[index]
    }
  }
  return {}
}

// creates new default dashboard
const getNewDashboard = () => {
  const dashboard = {
    id: getRandomId(),
    type: "desktop",
    title: "new-dashboard",
    bookmarked: false,
    labels: {},
    widgets: [
      {
        id: getRandomId(),
        title: "Switches",
        showTitle: true,
        type: "widget_switches",
        static: false,
        layout: {
          w: 20,
          h: 60,
          x: 0,
          y: 0,
        },
        config: {
          labels: {},
        },
      },
    ],
  }

  return dashboard
}
