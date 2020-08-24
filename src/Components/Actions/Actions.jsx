import React from "react"
import { DropdownItem, DropdownSeparator, Dropdown, DropdownToggle } from "@patternfly/react-core"
import {
  CaretDownIcon,
  CircleIcon,
  OutlinedCircleIcon,
  RetweetIcon,
  EditIcon,
  OutlinedTrashAltIcon,
} from "@patternfly/react-icons"

export default class Actions extends React.Component {
  state = {
    isOpen: false,
  }
  onToggle = (isOpen) => {
    this.setState({ isOpen })
  }
  onSelect = (event) => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { isOpen } = this.state
    const { items } = this.props

    const dropdownItems = items.map((item) => {
      switch (item.type) {
        case "enable":
          return drawItem("enable", "Enable", CircleIcon, item.disabled, item.onClick)
        case "disable":
          return drawItem("disable", "Disable", OutlinedCircleIcon, item.disabled, item.onClick)
        case "reload":
          return drawItem("reload", "Reload", RetweetIcon, item.disabled, item.onClick)
        case "edit":
          return drawItem("edit", "Edit", EditIcon, item.disabled, item.onClick)
        case "delete":
          return drawItem("delete", "Delete", OutlinedTrashAltIcon, item.disabled, item.onClick)
        case "separator":
          return <DropdownSeparator key="separator" />
      }
    })
    return (
      <Dropdown
        className="mc-actions"
        onSelect={this.onSelect}
        toggle={
          <DropdownToggle id="toggle-id" onToggle={this.onToggle} toggleIndicator={CaretDownIcon}>
            Actions
          </DropdownToggle>
        }
        isOpen={isOpen}
        dropdownItems={dropdownItems}
      />
    )
  }
}

const drawItem = (key, text, icon, disabled, onClickFn) => {
  const Icon = icon
  return (
    <DropdownItem key={key} isDisabled={disabled} icon={<Icon />} onClick={onClickFn ? onClickFn : () => {}}>
      {text}
    </DropdownItem>
  )
}
