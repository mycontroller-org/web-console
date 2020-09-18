import React from "react"
import { Toolbar, ToolbarContent, ToolbarItem, ToolbarGroup } from "@patternfly/react-core"
import Actions from "../Actions/Actions"
import { AddButton, RefreshButton } from "../Buttons/Buttons"

import "./McToolbar.css"

const McToolbar = ({
  rowsSelectionCount,
  items,
  groupAlignment = {},
  refreshFn = () => {},
  resourceName,
  filters = null,
  clearAllFilters,
}) => {
  const tbItems = {}
  items.forEach((item, index) => {
    const group = item.group
    if (tbItems[group] === undefined) {
      tbItems[group] = []
    }
    switch (item.type) {
      case "actions":
        tbItems[group].push(
          <ToolbarItem key={"tb-items-" + index}>
            <Actions
              resourceName={resourceName}
              rowsSelectionCount={rowsSelectionCount}
              isDisabled={item.disabled}
              items={item.actions}
              refreshFn={refreshFn}
            />
          </ToolbarItem>
        )
        break
      case "addButton":
        tbItems[group].push(
          <ToolbarItem key={"tb-items-" + index}>
            <AddButton onClick={item.onClick} />
          </ToolbarItem>
        )
        break
      case "refresh":
        tbItems[group].push(
          <ToolbarItem key={"tb-items-" + index}>
            <RefreshButton onClick={item.onClick ? item.click : refreshFn} />
          </ToolbarItem>
        )
        break
      case "separator":
        tbItems[group].push(<ToolbarItem key={"tb-items-" + index} variant="separator" />)
        break
      default:
      // nothing to do
    }
  })

  const finalItems = Object.keys(tbItems).map((g, index) => {
    const alignment = groupAlignment[g] ? groupAlignment[g] : "alignLeft"
    return (
      <ToolbarGroup key={"tbg-items-" + index} alignment={{ default: alignment }}>
        {tbItems[g]}
      </ToolbarGroup>
    )
  })

  return (
    <Toolbar
      id="toolbar"
      key="toolbar"
      isExpanded={false}
      toggleIsExpanded={() => {}}
      clearAllFilters={clearAllFilters}
    >
      <ToolbarContent toolbarId={"t1"} isExpanded={false}>
        {filters}
        {finalItems}
      </ToolbarContent>
    </Toolbar>
  )
}

export default McToolbar
