import React from "react"
import {
  Title,
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
} from "@patternfly/react-core"
import CubesIcon from "@patternfly/react-icons/dist/js/icons/cubes-icon"

const EmptyState = ({ title, message, primaryAction = {}, secondaryActions = [] }) => {
  const secActions = secondaryActions.map((action, index) => {
    return (
      <Button key={index} variant="link" onClick={action.onClick}>
        {action.text}
      </Button>
    )
  })
  return (
    <EmptyState>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h4" size="lg">
        {title}
      </Title>
      <EmptyStateBody>{message}</EmptyStateBody>
      <Button variant="primary" onClick={primaryAction.onClick}>
        primaryAction.text
      </Button>
      <EmptyStateSecondaryActions>{secActions}</EmptyStateSecondaryActions>
    </EmptyState>
  )
}

export default EmptyState
