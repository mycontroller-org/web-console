import htmlParser from "html-react-parser"
import React from "react"
import { useTranslation } from "react-i18next"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { getKeyValue } from "../../../Components/DataDisplay/Label"
import { DisplayEnabled } from "../../../Components/DataDisplay/Miscellaneous"
import { getLanguage } from "../../../i18n/languages"
import { api } from "../../../Service/Api"
import { getValue } from "../../../Util/Util"

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

  fieldsList1.push({ key: "geo_location", value: <GeoLocation data={data.spec.geoLocation} /> })
  fieldsList2.push({ key: "login", value: <Login data={data.spec.login} /> })
  fieldsList2.push({ key: "language", value: getLanguage(data.spec.language) })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}

const GeoLocation = ({ data = {} }) => {
  const { t } = useTranslation()

  return [
    getKeyValue(t("auto_update"), <DisplayEnabled data={data} field={"autoUpdate"} />),
    getKeyValue(t("location_name"), data.locationName),
    getKeyValue(t("latitude"), data.latitude),
    getKeyValue(t("longitude"), data.longitude),
  ]
}

const Login = ({ data = {} }) => {
  const { t } = useTranslation()
  const loginText = getValue(data, "message", "")
  return getKeyValue(t("message"), htmlParser(loginText))
}
