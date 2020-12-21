import { Flex, Toolbar as PfToolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from "@patternfly/react-core"
import React from "react"
import Actions from "../Actions/Actions"
import { AddButton, RefreshButton } from "../Buttons/Buttons"
import "./Toolbar.scss"

const Toolbar = ({
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
        <Flex alignSelf>{tbItems[g]}</Flex>
      </ToolbarGroup>
    )
  })

  return (
    <PfToolbar
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
    </PfToolbar>
  )
}

export default Toolbar
