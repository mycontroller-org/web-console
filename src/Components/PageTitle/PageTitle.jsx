import React from "react"
import {
  PageSection,
  PageSectionVariants,
  Text,
  Title,
  Divider,
  Grid,
  GridItem,
} from "@patternfly/react-core"

const PageTitle = ({ title, description, actions }) => {
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
        <GridItem span={12}>
          <Divider component="hr" />
        </GridItem>
      </Grid>
    </PageSection>
  )
}

export default PageTitle
