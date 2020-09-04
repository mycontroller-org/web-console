import React from "react"

import PageTitle from "../../Components/PageTitle/PageTitle"
import PageContent from "../../Components/PageContent/PageContent"
import Selector from "../../Components/Selector/Seletor"

class DummyPage2 extends React.Component {
  render() {
    return (
      <>
        <PageTitle title="Dummy Page2" />
        <PageContent>
          <Selector />
        </PageContent>
      </>
    )
  }
}

export default DummyPage2
