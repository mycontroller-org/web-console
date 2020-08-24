import React from "react"
import { Button, ButtonVariant } from "@patternfly/react-core"
import { PlusIcon } from "@patternfly/react-icons"

export const AddButton = ({ onClick }) => {
  return button("Add", ButtonVariant.primary, PlusIcon, onClick)
}

const button = (text, variant, icon, onClickFn) => {
  const Icon = icon
  return (
    <Button isSmall icon={<Icon />} onClick={onClickFn} variant={variant}>
      {text}
    </Button>
  )
}
