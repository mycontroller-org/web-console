import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { KeyValueMap, Labels } from "../../../Components/DataDisplay/Label"
import { DisplayTrue } from "../../../Components/DataDisplay/Miscellaneous"
import { LastSeen } from "../../../Components/Time/Time"
import { api } from "../../../Service/Api"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.policy.get}
      getDetailsFunc={getDetailsFuncImpl}
    />
  )
}

export default tabDetails

const getDetailsFuncImpl = (data) => {
  const fieldsList1 = []
  const fieldsList2 = []

  fieldsList1.push({ key: "id", value: data.id })
  fieldsList1.push({ key: "description", value: data.description })
  fieldsList1.push({ key: "system", value: <DisplayTrue data={data} field="system" /> })
  fieldsList1.push({ key: "labels", value: <Labels data={data.labels} /> })

  fieldsList2.push({ key: "modified_on", value: <LastSeen date={data.modifiedOn} tooltipPosition="top" /> })

  const statements = Array.isArray(data.statements) ? data.statements : []
  const statementsMap = {}
  statements.forEach((st, index) => {
    const n = index + 1
    statementsMap[`${n}.effect`] = st.effect || "Allow"
    statementsMap[`${n}.actions`] = Array.isArray(st.actions) ? st.actions.join(", ") : ""
    statementsMap[`${n}.resources`] = Array.isArray(st.resources) ? st.resources.join(", ") : ""
  })
  fieldsList2.push({ key: "statements", value: <KeyValueMap data={statementsMap} /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}
