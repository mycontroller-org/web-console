import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { Labels } from "../../../Components/DataDisplay/Label"
import { LastSeen } from "../../../Components/Time/Time"
import { api } from "../../../Service/Api"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.dataRepository.get}
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
  fieldsList1.push({ key: "Read Only", value: data.enabled ? "true" : "false" })
  fieldsList2.push({ key: "Labels", value: <Labels data={data.labels} /> })
  fieldsList2.push({ key: "Modified On", value: <LastSeen date={data.modifiedOn} tooltipPosition="top" /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}
