import { Card, CardBody, CardTitle, Flex, FlexItem, Split, SplitItem } from "@patternfly/react-core"
import { CloseIcon, CogIcon } from "@patternfly/react-icons"
import React from "react"
import { cloneDeep } from "../../Util/Util"
import { IconButton } from "../Buttons/Buttons"
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary"
import { WidgetType } from "../../Constants/Widgets/Widgets"
import EmptyPanel from "./EmptyPanel/EmptyPanel"
import LightPanel from "./LightPanel/LightPanel"
import SwitchPanel from "./SwitchPanel/SwitchPanel"
import UtilizationPanel from "./UtilizationPanel/UtilizationPanel"
import "./Widget.scss"

const LoadWidgets = (widgets, editEnabled, onEditClick, onDeleteClick, history) => {
  const items = []

  widgets.forEach((widget, index) => {
    const item = {
      key: widget.id,
      title: widget.title,
      showTitle: widget.showTitle,
      type: widget.type,
      config: widget,
    }

    const widgetKey = widget.type + index

    // load panel
    item.content = <ErrorBoundary>{loadPanel(widget, history, widgetKey)}</ErrorBoundary>

    items.push(item)
  })
  return cardWrapper(items, editEnabled, onEditClick, onDeleteClick)
}

export default LoadWidgets

// helper functions

const loadPanel = (widget, history, widgetKey) => {
  switch (widget.type) {
    case WidgetType.EmptyPanel:
      return <EmptyPanel widgetId={widget.id} key={widgetKey} />

    case WidgetType.SwitchPanel:
      return <SwitchPanel key={widgetKey} widgetId={widget.id} config={widget.config} history={history} />

    case WidgetType.LightPanel:
      return <LightPanel key={widgetKey} widgetId={widget.id} config={widget.config} history={history} />

    case WidgetType.UtilizationPanel:
      return (
        <UtilizationPanel key={widgetKey} widgetId={widget.id} config={widget.config} history={history} />
      )

    default:
      return <span>Unknown widget type:{widget.type}</span>
  }
}

const cardWrapper = (items, editEnabled, onEditClick, onDeleteClick) => {
  return items.map((item) => {
    const actionButtons = []
    if (editEnabled) {
      const onEditClickFunc = () => {
        const widget = cloneDeep(item.config)
        onEditClick(widget)
      }
      const onDeleteClickFunc = () => {
        const widgetId = item.config.id
        onDeleteClick(widgetId)
      }
      actionButtons.push(
        <FlexItem key="edit-mode-btns" align={{ default: "alignRight" }}>
          <IconButton
            key="btn-edit"
            icon={CogIcon}
            className="dashboard-widget-action"
            onClick={onEditClickFunc}
          />
          <IconButton
            key="btn-close"
            icon={CloseIcon}
            className="dashboard-widget-action"
            onClick={onDeleteClickFunc}
          />
        </FlexItem>
      )
    }

    // &nbsp;
    let titleComponent = null
    const stickTitleOnTopClass = !item.showTitle ? "dashboard-widget-title-stick-top" : ""
    if (item.showTitle || editEnabled) {
      titleComponent = (
        <CardTitle className={"dashboard-widget-title " + stickTitleOnTopClass}>
          <Split>
            <SplitItem isFilled className="dashboard-widget-title-text">
              <span style={{ color: "#434343" }}>{item.title}</span>
            </SplitItem>
            <SplitItem>{actionButtons}</SplitItem>
          </Split>
        </CardTitle>
      )
    }
    return (
      <div key={item.key}>
        <Card isHoverable={false} isCompact={true} className="dashboard-widget">
          <CardBody id="dashboard-widget" className="dashboard-widget-body">
            {titleComponent}
            <div className="dashboard-widget-content no-space">{item.content}</div>
          </CardBody>
        </Card>
      </div>
    )
  })
}
