import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { KeyValueMap } from "../../../Components/DataDisplay/Label"
import { getLanguage } from "../../../i18n/languages"
import { api } from "../../../Service/Api"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId ? resourceId : "none"}
      history={history}
      apiGetRecord={api.settings.getSystemSettings}
      getDetailsFunc={getDetailsFuncImpl}
    />
  )
}

export default tabDetails

// helper functions

const getDetailsFuncImpl = (data) => {
  const fieldsList1 = []
  const fieldsList2 = []

  fieldsList1.push({ key: "geo_location", value: <KeyValueMap data={data.spec.geoLocation} /> })
  fieldsList2.push({ key: "login", value: <KeyValueMap data={data.spec.login} /> })
  fieldsList2.push({ key: "language", value: getLanguage(data.spec.language) })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}
