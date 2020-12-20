import React from "react"
import CodeEditor from "../../../Components/CodeEditor/CodeEditor"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"

class AddPage extends React.Component {
  render() {
    return (
      <>
        <PageTitle title="Add a Node" />
        <PageContent>
          <CodeEditor
            apiGetRecord={api.node.get}
            apiSaveRecord={api.node.update}
            match={this.props.match}
            options={{ minimap: { enabled: true }, readOnly: false }}
            onSave={() => {
              r(this.props.history, rMap.resources.gateway.list)
            }}
          />
        </PageContent>
      </>
    )
  }
}

export default AddPage
