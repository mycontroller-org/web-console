import { PageSection, PageSectionVariants } from "@patternfly/react-core"
import React from "react"

const PageContent = ({ children }) => {
  return (
    <PageSection
      // style={{paddingTop: "0px"}}
      variant={PageSectionVariants.light}
    >
      {children}
    </PageSection>
  )
}

export default PageContent
