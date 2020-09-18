import React from "react"
import { Modal, ModalVariant, Button } from "@patternfly/react-core"
import "./Dialog.css"

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
        <Button key="confirm" isSmall variant="danger" onClick={onOkFn}>
          Delete
        </Button>,
        <Button key="cancel" isSmall variant="secondary" onClick={onCloseFn}>
          Cancel
        </Button>,
      ]}
    >
      Are you sure you want to delete the selected {resourceName}?
    </Modal>
  )
}

export default DeleteDialog
