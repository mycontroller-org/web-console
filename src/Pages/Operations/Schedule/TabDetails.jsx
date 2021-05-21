import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { KeyValueMap, Labels } from "../../../Components/DataDisplay/Label"
import { api } from "../../../Service/Api"
import { DisplayList, DisplayTrue } from "../../../Components/DataDisplay/Miscellaneous"
import { ResourceVariables } from "../../../Components/DataDisplay/Resource"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.schedule.get}
      getDetailsFunc={getDetailsFuncImpl}
    />
  )
}

export default tabDetails

// helper functions

const getDetailsFuncImpl = (data) => {
  const fieldsList1 = []
  const fieldsList2 = []

  fieldsList1.push({ key: "ID", value: data.id })
  fieldsList1.push({ key: "Description", value: data.description })
  fieldsList1.push({ key: "Enabled", value: <DisplayTrue data={data} field="enabled" /> })
  fieldsList1.push({ key: "Labels", value: <Labels data={data.labels} /> })
  fieldsList1.push({ key: "Type", value: data.type })
  fieldsList1.push({ key: "State", value: <KeyValueMap data={data.state} /> })
  fieldsList2.push({ key: "Validity", value: <KeyValueMap data={data.validity} /> })
  fieldsList2.push({ key: "Spec", value: <KeyValueMap data={data.spec} /> })
  fieldsList2.push({
    key: "Variables",
    value: <ResourceVariables data={data.variables} originalType="variable" />,
  })
  fieldsList2.push({
    key: "Handler Parameters",
    value: <ResourceVariables data={data.handlerParameters} originalType="parameter" />,
  })
  fieldsList2.push({ key: "Handlers", value: <DisplayList data={data} field="handlers" /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}
