import { ActionList, ActionListGroup, ActionListItem, Button, Level, LevelItem } from "@patternfly/react-core"
import React from "react"

const actionListItem = ({ variant, text, onClickFunc, isDisabled }) => {
  return (
    <ActionListItem>
      <Button variant={variant} id={text} onClick={onClickFunc} isDisabled={isDisabled}>
        {text}
      </Button>
    </ActionListItem>
  )
}

const actionBar = ({ leftBar = [], rightBar = [] }) => {
  const leftActions = leftBar.map((action) => {
    return actionListItem(action)
  })
  const rightActions = rightBar.map((action) => {
    return actionListItem(action)
  })
  return (
    <Level>
      <LevelItem>
        <ActionList>
          <ActionListGroup>{leftActions}</ActionListGroup>
        </ActionList>
      </LevelItem>
      <LevelItem>
        <ActionList>
          <ActionListGroup>{rightActions}</ActionListGroup>
        </ActionList>
      </LevelItem>
    </Level>
  )
}

export default actionBar
