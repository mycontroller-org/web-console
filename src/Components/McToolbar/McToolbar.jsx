import React from "react"
import { Toolbar, ToolbarContent, ToolbarItem, ToolbarGroup } from "@patternfly/react-core"
import Actions from "../Actions/Actions"
import { AddButton } from "../Buttons/Buttons"

const McToolbar = ({ items, groupAlignment = {} }) => {
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
            <Actions isDisabled={item.disabled} items={item.actions} />
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
    <Toolbar id="toolbar" key="toolbar">
      <ToolbarContent toolbarId={"t1"} clearAllFilters={() => {}}>{finalItems}</ToolbarContent>
    </Toolbar>
  )
}

export default McToolbar
