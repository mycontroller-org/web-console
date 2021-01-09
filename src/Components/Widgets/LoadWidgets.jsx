import { Card, CardBody, CardTitle, Flex, FlexItem } from "@patternfly/react-core"
import { CloseIcon, CogIcon } from "@patternfly/react-icons"
import React from "react"
import { WidgetType } from "./Constants"
import SwitchPanel from "./SwitchPanel/SwitchPanel"

const LoadWidgets = (widgets, editEnabled, onEditClick, onDeleteClick) => {
  const items = []

  widgets.forEach((widget) => {
    const item = {
      key: widget.id,
      title: widget.title,
      showTitle: widget.showTitle,
      type: widget.type,
      config: widget,
    }

    switch (widget.type) {
      case WidgetType.SwitchPanel:
        item.content = <SwitchPanel config={widget.config} />
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
      actionButtons.push(
        <FlexItem align={{ default: "alignRight" }}>
          <CogIcon
            color="#333"
            className="dashboard-card-action"
            onClick={() => {
              onEditClick(item.config)
            }}
          />
          <CloseIcon
            color="#333"
            className="dashboard-card-action"
            onClick={() => {
              onDeleteClick(item.config)
            }}
          />
        </FlexItem>
      )
    }

    let titleComponent = null
    if (item.showTitle || editEnabled) {
      titleComponent = (
        <CardTitle className="dashboard-card-title">
          <Flex>
            <FlexItem>{item.title}&nbsp;</FlexItem>
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
