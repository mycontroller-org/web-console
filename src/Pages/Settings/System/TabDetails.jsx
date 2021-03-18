import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { KeyValueMap, Labels } from "../../../Components/DataDisplay/Label"
import { api } from "../../../Service/Api"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId ? resourceId : "none"}
      history={history}
      apiGetRecord={api.settings.getSystem}
      getDetailsFunc={getDetailsFuncImpl}
    />
  )
}

export default tabDetails

// helper functions

const getDetailsFuncImpl = (data) => {
  const fieldsList1 = []
  const fieldsList2 = []

  fieldsList1.push({ key: "GEO Location", value: <KeyValueMap data={data.spec.geoLocation} /> })
  fieldsList2.push({ key: "Login", value: <KeyValueMap data={data.spec.login} /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}
