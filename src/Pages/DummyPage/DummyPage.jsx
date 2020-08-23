import React from "react"

import PageTitle from "../../Components/PageTitle/PageTitle"
import PageContent from "../../Components/PageContent/PageContent"

const dummyPage = () => {
  return (
    <React.Fragment>
      <PageTitle title="Dummy Page" />
      <PageContent content="Hello world" />
    </React.Fragment>
  )
}

export default dummyPage
