import React from "react"
import { Modal, ModalVariant, Button, List, ListItem } from "@patternfly/react-core"
import "./Dialog.scss"

const DeleteDialog = ({ resourceName, show, onCloseFn, onOkFn }) => {
  return (
    <Modal
      className="mc-model"
      variant={ModalVariant.small}
      title={"Delete " + resourceName + "?"}
      isOpen={show}
      onClose={onCloseFn}
      showClose={false}
      actions={[
        <Button key="cancel" variant="secondary" onClick={onCloseFn}>
          Cancel
        </Button>,
        <Button key="confirm" variant="danger" onClick={onOkFn}>
          Delete
        </Button>,
      ]}
    >
      Are you sure you want to delete the selected resource?
      <br />
      Resource name: {resourceName}
    </Modal>
  )
}

export const NodeRebootDialog = ({ show, onCloseFn, onOkFn }) => {
  return dialog(
    "Reboot Node(s)?",
    show,
    onCloseFn,
    onOkFn,
    "Reboot",
    "Are you sure you want to reboot the selected node(s)?"
  )
}

export const NodeResetDialog = ({ show, onCloseFn, onOkFn }) => {
  const message = (
    <>
      Are you sure you want to reset the selected node(s)?
      <br />
      After this action:
      <List>
        <ListItem>Configuration will be restored to factory settings.</ListItem>
        <ListItem> you may lose access to the selected node(s) from MyController!</ListItem>
      </List>
    </>
  )
  return dialog("Reset Node(s)?", show, onCloseFn, onOkFn, "Reset", message)
}

export const RestoreDialog = ({ show, fileName, onCloseFn, onOkFn }) => {
  const message = (
    <>
      Are you sure you want to restore to selected backup file?
      <br />
      After this action:
      <List>
        <ListItem>Server configuration and data will be restored to <b>{fileName}</b></ListItem>
        <ListItem>You cannot rollback this action</ListItem>
        <ListItem>Always take a backup before performing a restore action</ListItem>
        <ListItem>You may need to start the server manually in backend</ListItem>
      </List>
    </>
  )
  return dialog("Perform server restore operation?", show, onCloseFn, onOkFn, "Restore", message)
}

const dialog = (
  title = "",
  isOpen = false,
  onCloseFn = () => {},
  onOkFn = () => {},
  okBtnName = "NoName",
  message = ""
) => {
  return (
    <Modal
      key={title}
      className="mc-model"
      variant={ModalVariant.small}
      title={title}
      isOpen={isOpen}
      onClose={onCloseFn}
      showClose={false}
      actions={[
        <Button key="cancel" variant="secondary" onClick={onCloseFn}>
          Cancel
        </Button>,
        <Button key="confirm" variant="danger" onClick={onOkFn}>
          {okBtnName}
        </Button>,
      ]}
    >
      {message}
    </Modal>
  )
}

export default DeleteDialog
