import React from "react"
import PageContent from "../../Components/PageContent/PageContent"
import PageTitle from "../../Components/PageTitle/PageTitle"


const dummyPage = () => {
  const date = new Date()
  return (
    <React.Fragment>
      <PageTitle title="Dummy Page" />
      <PageContent content={"Hello world. Date:" + date} />
    </React.Fragment>
  )
}

export default dummyPage
