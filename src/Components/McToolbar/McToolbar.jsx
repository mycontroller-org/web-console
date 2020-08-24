import React from "react"
import { Toolbar, ToolbarContent, ToolbarItem, ToolbarGroup } from "@patternfly/react-core"
import Actions from "../Actions/Actions"
import { AddButton } from "../Buttons/Buttons"

const McToolbar = ({ key, items, groupAlignment = {} }) => {
  const tbItems = {}
  items.forEach((item) => {
    const group = item.group
    if (tbItems[group] === undefined) {
      tbItems[group] = []
    }
    switch (item.type) {
      case "actions":
        tbItems[group].push(
          <ToolbarItem>
            <Actions items={item.actions} />
          </ToolbarItem>
        )
        break
      case "addButton":
        tbItems[group].push(
          <ToolbarItem>
            <AddButton onClick={item.onClick} />
          </ToolbarItem>
        )
        break
      case "separator":
        tbItems[group].push(<ToolbarItem variant="separator" />)
        break
      default:
      // nothing to do
    }
  })

  const finalItems = Object.keys(tbItems).map((g) => {
    const alignment = groupAlignment[g] ? groupAlignment[g] : "alignLeft"
    return <ToolbarGroup alignment={{ default: alignment }}> {tbItems[g]}</ToolbarGroup>
  })

  return (
    <Toolbar id="toolbar" key={key}>
      <ToolbarContent>{finalItems}</ToolbarContent>
    </Toolbar>
  )
}

export default McToolbar
