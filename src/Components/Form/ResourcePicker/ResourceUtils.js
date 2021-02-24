import objectPath from "object-path"
import { api } from "../../../Service/Api"
import { splitWithTail } from "../../../Util/Util"
import { ValueType, FieldKey, ResourceType, CallerType } from "./Constants"

export const updateValue = (rootObject = {}, callerType, onChange, onClose) => {
  const valueType = objectPath.get(rootObject, "valueType", ValueType.TypeString)
  let value = ""
  switch (valueType) {
    case ValueType.TypeString:
      value = rootObject.value
      break

    case ValueType.TypeResourceByQuickID:
      const dataQID = []
      dataQID.push("--qid=" + rootObject.resourceType + ":" + rootObject.quickId)
      if (callerType === CallerType.Parameter) {
        dataQID.push("--payload=" + rootObject.payload)
        dataQID.push("--preDelay=" + rootObject.preDelay)
      } else if (callerType === CallerType.Variable) {
        dataQID.push("--selector=" + rootObject.selector)
      }
      value = dataQID.join(",")
      break

    case ValueType.TypeResourceByLabels:
      const dataLabels = []
      dataLabels.push("--labels=true")
      dataLabels.push("--type=" + rootObject.resourceType)
      if (callerType === CallerType.Parameter) {
        dataLabels.push("--payload=" + rootObject.payload)
        dataLabels.push("--preDelay=" + rootObject.preDelay)
      } else if (callerType === CallerType.Variable) {
        dataQID.push("--selector=" + rootObject.selector)
      }
      const labels = objectPath.get(rootObject, "labels", {})
      const keys = Object.keys(labels)
      keys.forEach((key) => {
        dataLabels.push(key + "=" + labels[key])
      })
      value = dataLabels.join(",")

    default:
  }
  if (onChange) {
    onChange(value)
  }
  onClose()
}

export const getRootObject = (value = "") => {
  if (value.startsWith(FieldKey.TypeLabels)) {
    const data = getKeyValueMap(value)
    return { valueType: ValueType.TypeResourceByLabels, ...data }
  } else if (value.startsWith(FieldKey.TypeQID)) {
    const data = getKeyValueMap(value)
    return { valueType: ValueType.TypeResourceByQuickID, ...data }
  } else {
    return { valueType: ValueType.TypeString, value: value }
  }
}

export const getKeyValueMap = (value = "") => {
  const updatedValue = value.replace("\\,", "@#$@")
  const dataMap = updatedValue.split(",")
  let payload = ""
  let preDelay = ""
  let selector = ""
  let quickId = ""
  let resourceType = ""
  const keyValueMap = {}
  const formatValue = (keyValue) => {
    if (keyValue.length == 2) {
      return keyValue[1].replace("@#$@", "\\,")
    }
    return ""
  }
  dataMap.map((data) => {
    const keyValue = splitWithTail(data, "=", 2)
    const key = keyValue[0]
    if (key === FieldKey.ResourcePayload) {
      payload = formatValue(keyValue)
    } else if (key === FieldKey.ResourcePreDelay) {
      preDelay = formatValue(keyValue)
    } else if (key === FieldKey.ResourceSelector) {
      selector = formatValue(keyValue)
    } else if (key === FieldKey.ResourceType) {
      const typeId = getResourceType(formatValue(keyValue))
      resourceType = typeId[0]
    } else if (key === FieldKey.TypeQID) {
      const typeId = getResourceType(formatValue(keyValue))
      resourceType = typeId[0]
      quickId = typeId[1]
    } else if (key !== FieldKey.TypeLabels) {
      keyValueMap[key] = formatValue(keyValue)
    }
  })
  return {
    labels: keyValueMap,
    quickId: quickId,
    payload: payload,
    preDelay: preDelay,
    selector: selector,
    resourceType: resourceType,
  }
}

export const getResourceType = (quickId) => {
  if (quickId === "") {
    return ["", ""]
  }
  const resource = quickId.split(":", 1)[0]
  const id = quickId.substring(resource.length + 1)
  switch (quickId.split(":", 1)[0]) {
    case ResourceType.Gateway:
    case ResourceType.GatewayShort:
      return [ResourceType.Gateway, id]

    case ResourceType.Node:
    case ResourceType.NodeShort:
      return [ResourceType.Node, id]

    case ResourceType.Sensor:
    case ResourceType.SensorShort:
      return [ResourceType.Sensor, id]

    case ResourceType.SensorField:
    case ResourceType.SensorFieldShort:
      return [ResourceType.SensorField, id]

    case ResourceType.Task:
    case ResourceType.TaskShort:
      return [ResourceType.Task, id]

    case ResourceType.Schedule:
    case ResourceType.ScheduleShort:
      return [ResourceType.Schedule, id]

    case ResourceType.Handler:
    case ResourceType.HandlerShort:
      return [ResourceType.Handler, id]

    default:
      return ["", quickId]
  }
}

export const getResourceOptionsAPI = (resourceType) => {
  switch (resourceType) {
    case ResourceType.Gateway:
      return api.gateway.list

    case ResourceType.Node:
      return api.node.list

    case ResourceType.Sensor:
      return api.sensor.list

    case ResourceType.SensorField:
      return api.sensorField.list

    case ResourceType.Task:
      return api.task.list

    case ResourceType.Schedule:
      return api.scheduler.list

    case ResourceType.Handler:
      return api.handler.list

    default:
      return () => {}
  }
}

export const getResourceOptionValueFunc = (resourceType) => {
  switch (resourceType) {
    case ResourceType.Gateway:
    case ResourceType.Task:
    case ResourceType.Schedule:
    case ResourceType.Handler:
      return (item) => {
        return item.id
      }

    case ResourceType.Node:
      return (item) => {
        return item.gatewayId + "." + item.nodeId
      }

    case ResourceType.Sensor:
      return (item) => {
        return item.gatewayId + "." + item.nodeId + "." + item.sensorId
      }

    case ResourceType.SensorField:
      return (item) => {
        return item.gatewayId + "." + item.nodeId + "." + item.sensorId + "." + item.fieldId
      }

    default:
      return null
  }
}

export const getResourceFilterFunc = (resourceType) => {
  switch (resourceType) {
    case ResourceType.Gateway:
    case ResourceType.Task:
    case ResourceType.Schedule:
    case ResourceType.Handler:
      return (value) => {
        return [{ k: "id", o: "regex", v: value }]
      }

    case ResourceType.Node:
    case ResourceType.Sensor:
    case ResourceType.SensorField:
      return (value) => {
        return [{ k: "name", o: "regex", v: value }]
      }

    default:
      return null
  }
}

export const getOptionsDescriptionFunc = (resourceType) => {
  switch (resourceType) {
    case ResourceType.Gateway:
      return (item) => {
        return item.name
      }

    case ResourceType.Task:
    case ResourceType.Schedule:
    case ResourceType.Handler:
      return (item) => {
        return item.description
      }

    case ResourceType.Node:
    case ResourceType.Sensor:
    case ResourceType.SensorField:
      return (item) => {
        return item.name
      }

    default:
      return null
  }
}
