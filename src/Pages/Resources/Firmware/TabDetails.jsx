import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { KeyValueMap, Labels } from "../../../Components/DataDisplay/Label"
import { LastSeen } from "../../../Components/Time/Time"
import { api } from "../../../Service/Api"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.firmware.get}
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
  fieldsList1.push({ key: "Modified On", value: <LastSeen date={data.modifiedOn} /> })
  fieldsList1.push({ key: "Labels", value: <Labels data={data.labels} /> })

  fieldsList2.push({ key: "File Details", value: <KeyValueMap data={data.file} /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}
