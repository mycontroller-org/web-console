import React from "react"
import PageContent from "../../Components/PageContent/PageContent"
import PageTitle from "../../Components/PageTitle/PageTitle"
import AsyncSelect from "../../Components/Select/AsyncSelect"

const dummyPage = () => {
  const date = new Date()
  return (
    <React.Fragment>
      <PageTitle title="Dummy Page" />
      <PageContent>
        <AsyncSelect />
      </PageContent>
    </React.Fragment>
  )
}

export default dummyPage
