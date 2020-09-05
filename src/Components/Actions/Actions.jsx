import React from "react"
import { DropdownItem, DropdownSeparator, Dropdown, DropdownToggle } from "@patternfly/react-core"
import {
  CaretDownIcon,
  CircleIcon,
  OutlinedCircleIcon,
  RetweetIcon,
  EditIcon,
  OutlinedTrashAltIcon,
  HeartbeatIcon,
  EraserIcon,
  PowerOffIcon,
  InfoAltIcon,
  RebootingIcon,
  UploadIcon,
  SearchIcon,
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
    const { items, isDisabled } = this.props

    const dropdownItems = items.map((item, index) => {
      switch (item.type) {
        case "enable":
          return drawItem("enable", "Enable", CircleIcon, item.disabled, item.onClick)
        case "disable":
          return drawItem("disable", "Disable", OutlinedCircleIcon, item.disabled, item.onClick)
        case "reload":
          return drawItem("reload", "Reload", RetweetIcon, item.disabled, item.onClick)
        case "discover":
          return drawItem("discover", "Discover", SearchIcon, item.disabled, item.onClick)
        case "edit":
          return drawItem("edit", "Edit", EditIcon, item.disabled, item.onClick)
        case "delete":
          return drawItem("delete", "Delete", OutlinedTrashAltIcon, item.disabled, item.onClick)
        case "reboot":
          return drawItem("reboot", "Reboot", RebootingIcon, item.disabled, item.onClick)
        case "heartbeat_request":
          return drawItem(
            "heartbeat_request",
            "Heartbeat Request",
            HeartbeatIcon,
            item.disabled,
            item.onClick
          )
        case "refresh_node_info":
          return drawItem("refresh_node_info", "Refresh", InfoAltIcon, item.disabled, item.onClick)
        case "firmware_update":
          return drawItem("firmware_update", "Firmware Update", UploadIcon, item.disabled, item.onClick)
        case "reset":
          return drawItem("reset", "Reset", EraserIcon, item.disabled, item.onClick)
        case "separator":
          return <DropdownSeparator key={"separator-" + index} />
        default:
          return <DropdownItem key={"el-" + index}>{item}</DropdownItem>
      }
    })
    return (
      <Dropdown
        className="mc-actions"
        onSelect={this.onSelect}
        toggle={
          <DropdownToggle
            isPlain={true}
            id="toggle-id"
            isDisabled={isDisabled}
            onToggle={this.onToggle}
            toggleIndicator={CaretDownIcon}
          >
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
