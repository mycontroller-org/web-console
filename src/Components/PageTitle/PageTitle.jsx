import {
  Divider,
  Grid,
  GridItem, PageSection,
  PageSectionVariants,
  Text,
  Title
} from "@patternfly/react-core"
import React from "react"

const PageTitle = ({ title, description, actions, hideDivider = false }) => {
  const divider = hideDivider ? null : (
    <GridItem span={12}>
      <Divider component="hr" />
    </GridItem>
  )
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Grid hasGutter={false}>
        <GridItem span={6}>
          <Title headingLevel="h2" size="xl">
            {title}
          </Title>
          {description ? (
            <Text>
              <small>{description}</small>
            </Text>
          ) : null}
        </GridItem>
        <GridItem span={6}>
          <div style={{ float: "right", marginBottom: "1px" }}>{actions}</div>
        </GridItem>
        {divider}
      </Grid>
    </PageSection>
  )
}

export default PageTitle
