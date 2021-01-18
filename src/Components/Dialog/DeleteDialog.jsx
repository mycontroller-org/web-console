import React from "react"
import { Modal, ModalVariant, Button } from "@patternfly/react-core"
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

export default DeleteDialog
