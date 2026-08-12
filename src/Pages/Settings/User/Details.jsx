import React from "react"
import { useTranslation } from "react-i18next"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { Labels } from "../../../Components/DataDisplay/Label"
import { LastSeen } from "../../../Components/Time/Time"
import { api } from "../../../Service/Api"

const TabDetails = ({ resourceId, history }) => {
  const { t } = useTranslation()
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.user.get}
      getDetailsFunc={(data) => getDetailsFuncImpl(data, t)}
    />
  )
}

export default TabDetails

const getDetailsFuncImpl = (data, t) => {
  const fieldsList1 = []
  const fieldsList2 = []

  fieldsList1.push({ key: "id", value: data.id })
  fieldsList1.push({ key: "username", value: data.username })
  fieldsList1.push({ key: "full_name", value: data.fullName })
  fieldsList1.push({ key: "email", value: data.email })
  fieldsList2.push({ key: "disabled", value: data.disabled ? t("true") : t("false") })
  fieldsList2.push({
    key: "policies",
    value: Array.isArray(data.policies) ? data.policies.join(", ") : "",
  })
  fieldsList2.push({ key: "modified_on", value: <LastSeen date={data.modifiedOn} tooltipPosition="top" /> })
  fieldsList2.push({ key: "labels", value: <Labels data={data.labels} /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}
