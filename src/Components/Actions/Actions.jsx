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
  InfoAltIcon,
  RebootingIcon,
  UploadIcon,
  SearchIcon,
  AddCircleOIcon,
} from "@patternfly/react-icons"
import DeleteDialog from "../Dialog/Dialog"

export default class Actions extends React.Component {
  state = {
    isOpen: false,
  }

  onToggle = (isOpen) => {
    this.setState({ isOpen })
  }
  onSelect = (_event) => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { isOpen } = this.state
    const { items, isDisabled, rowsSelectionCount = 1 } = this.props

    const dropdownItems = items.map((item, index) => {
      switch (item.type) {
        case "new":
          return drawItem("new", "New", AddCircleOIcon, item.disabled, item.onClick)
        case "enable":
          return drawItem("enable", "Enable", CircleIcon, item.disabled, item.onClick)
        case "disable":
          return drawItem("disable", "Disable", OutlinedCircleIcon, item.disabled, item.onClick)
        case "reload":
          return drawItem("reload", "Reload", RetweetIcon, item.disabled, item.onClick)
        case "discover":
          return drawItem("discover", "Discover", SearchIcon, item.disabled, item.onClick)
        case "edit":
          return drawItem("edit", "Edit", EditIcon, rowsSelectionCount !== 1 || item.disabled, item.onClick)
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
          return drawItem("refresh_node_info", "Fetch Info", InfoAltIcon, item.disabled, item.onClick)
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
      <>
        <Dropdown
          className="mc-actions"
          onSelect={this.onSelect}
          toggle={
            <DropdownToggle
              isPlain={true}
              id="toggle-id"
              isDisabled={isDisabled || rowsSelectionCount === 0}
              onToggle={this.onToggle}
              toggleIndicator={CaretDownIcon}
            >
              Actions
            </DropdownToggle>
          }
          isOpen={isOpen}
          dropdownItems={dropdownItems}
        />
        <DeleteDialog
          key="deleteDialog"
          resourceName={this.props.resourceName}
          show={this.state.showDeleteDialog}
          onCloseFn={this.onCloseDeleteDialog}
          onOkFn={this.onConfirmDeleteDialog}
        />
      </>
    )
  }
}

const drawItem = (key, text, icon, disabled, onClickFn) => {
  const Icon = icon
  return (
    <DropdownItem key={key} isDisabled={disabled} icon={<Icon />} onClick={onClickFn}>
      {text}
    </DropdownItem>
  )
}
