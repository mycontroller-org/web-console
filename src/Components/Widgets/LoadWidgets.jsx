import { Card, CardBody, CardTitle, Flex, FlexItem } from "@patternfly/react-core"
import { CloseIcon, CogIcon } from "@patternfly/react-icons"
import React from "react"
import { cloneDeep } from "../../Util/Util"
import { IconButton } from "../Buttons/Buttons"
import { WidgetType } from "./Constants"
import EmptyPanel from "./EmptyPanel/EmptyPanel"
import LightPanel from "./LightPanel/LightPanel"
import SwitchPanel from "./SwitchPanel/SwitchPanel"
import UtilizationPanel from "./UtilizationPanel/UtilizationPanel"

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

    switch (widget.type) {
      case WidgetType.EmptyPanel:
        item.content = <EmptyPanel key={widgetKey} />
        break

      case WidgetType.SwitchPanel:
        item.content = <SwitchPanel key={widgetKey} config={widget.config} history={history} />
        break

      case WidgetType.LightPanel:
        item.content = <LightPanel key={widgetKey} config={widget.config} history={history} />
        break

      case WidgetType.UtilizationPanel:
        item.content = <UtilizationPanel key={widgetKey} config={widget.config} history={history} />
        break

      default:
      // print on console
    }
    items.push(item)
  })
  return cardWrapper(items, editEnabled, onEditClick, onDeleteClick)
}

export default LoadWidgets

// helper functions

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
          <IconButton key="btn-edit" icon={CogIcon} className="dashboard-card-action" onClick={onEditClickFunc} />
          <IconButton key="btn-close" icon={CloseIcon} className="dashboard-card-action" onClick={onDeleteClickFunc} />
        </FlexItem>
      )
    }

    let titleComponent = null
    if (item.showTitle || editEnabled) {
      titleComponent = (
        <CardTitle className="dashboard-card-title">
          <Flex>
            <FlexItem>
              <span style={{ color: "#434343" }}>{item.title}&nbsp;</span>
            </FlexItem>
            {actionButtons}
          </Flex>
        </CardTitle>
      )
    }
    return (
      <div key={item.key}>
        <Card isHoverable={false} isCompact={true} className="dashboard-card">
          {titleComponent}
          <CardBody id="dashboard-card" className="dashboard-card-body">
            {item.content}
          </CardBody>
        </Card>
      </div>
    )
  })
}
