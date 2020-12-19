import { Button, ButtonVariant } from "@patternfly/react-core"
import { PlusIcon, SyncAltIcon } from "@patternfly/react-icons"
import React from "react"
import { redirect as r } from "../../Service/Routes"

export const AddButton = ({ onClick }) => {
  return button("Add", ButtonVariant.primary, PlusIcon, onClick)
}

export const RefreshButton = ({ onClick }) => {
  return button(null, ButtonVariant.plain, SyncAltIcon, onClick)
}

const button = (text, variant, icon, onClickFn) => {
  const Icon = icon
  if (text === undefined || text === null || text === "") {
    return (
      <Button isSmall={false} onClick={onClickFn} variant={variant}>
        {icon ? <Icon /> : null}
      </Button>
    )
  } else {
    return (
      <Button isSmall icon={icon ? <Icon /> : null} onClick={onClickFn} variant={variant}>
        {text}
      </Button>
    )
  }
}

export const RouteLink = ({ history, path, id, text }) => {
  return (
    <Button
      variant="link"
      isInline
      onClick={(_e) => {
        r(history, path, { id: id })
      }}
    >
      {text}
    </Button>
  )
}
