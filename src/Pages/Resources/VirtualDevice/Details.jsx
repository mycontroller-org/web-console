import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { RouteLink } from "../../../Components/Buttons/Buttons"
import { KeyValueMap, Labels } from "../../../Components/DataDisplay/Label"
import { getStatusBool } from "../../../Components/Icons/Icons"
import { LastSeen } from "../../../Components/Time/Time"
import InputField from "../../../Components/Widgets/ControlPanel/Common/InputField"
import { FieldDataType, getQuickId, ResourceType } from "../../../Constants/ResourcePicker"
import { api } from "../../../Service/Api"
import { routeMap as rMap } from "../../../Service/Routes"
import { getFieldValue, getValue } from "../../../Util/Util"

const updateTraits = (resourceId, filter = { offset: 0, limit: 10 }) =>
  new Promise(function (resolve, reject) {
    api.virtualDevice
      .get(resourceId)
      .then((res) => {
        const traitsObj = getValue(res, "data.traits", {})
        const traits = Object.keys(traitsObj)
        traits.sort()
        let start = filter.offset
        let end = start + filter.limit
        if (start > traits.length) {
          start = 0
        }
        if (end > traits.length) {
          end = traits.length
        }
        const response = traits.slice(start, end).map((k) => {
          return { trait: k, resource: traitsObj[k] }
        })
        resolve({ data: { count: traits.length, limit: traits.length, offset: 0, data: response } })
      })
      .catch((e) => {
        reject(e)
      })
  })

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.virtualDevice.get}
      apiListTablesRecord={(filter) => updateTraits(resourceId, filter)}
      tableTitle="traits"
      getTableFilterFunc={getTableFilterFuncImpl}
      tableColumns={tableColumns}
      getTableRowsFunc={getTableRowsFuncImpl}
      getDetailsFunc={getDetailsFuncImpl}
      cardTitle="details"
    />
  )
}

export default tabDetails

// helper functions

const getDetailsFuncImpl = (data) => {
  const fieldsList1 = []
  const fieldsList2 = []

  fieldsList1.push({ key: "id", value: data.id })
  fieldsList1.push({ key: "name", value: data.name })
  fieldsList1.push({ key: "description", value: data.description })
  fieldsList1.push({ key: "enabled", value: getStatusBool(data.enabled) })
  fieldsList2.push({ key: "type", value: data.deviceType })
  fieldsList2.push({ key: "labels", value: <Labels data={data.labels} /> })
  fieldsList1.push({ key: "modified_on", value: <LastSeen date={data.modifiedOn} tooltipPosition="top" /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}

// Properties definition
const tableColumns = [
  { title: "trait", fieldKey: "trait", sortable: false },
  { title: "resource", fieldKey: "resource", sortable: false },
]

const getTableRowsFuncImpl = (rawData, _index, _history) => {
  const resource = getValue(rawData, "resource", {})
  let resourceData = null
  if (resource.type === FieldDataType.TypeResourceByQuickId) {
    resourceData = `${resource.resourceType}: ${resource.quickId}`
  } else if (resource.type === FieldDataType.TypeResourceByLabels) {
    resourceData = `${resource.resourceType}: ${JSON.stringify(resource.labels)}`
  } else {
    resourceData = JSON.stringify(resource)
  }
  return [{ title: rawData.trait }, { title: resourceData }]
}

const getTableFilterFuncImpl = (data) => {
  return {}
}
