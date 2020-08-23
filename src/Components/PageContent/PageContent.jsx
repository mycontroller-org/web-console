import React from "react"
import { PageSection, PageSectionVariants } from "@patternfly/react-core"

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
