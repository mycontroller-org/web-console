import objectPath from "object-path"
import { api } from "../../../Service/Api"
import { ResourceType, CallerType, FieldDataType } from "./Constants"

export const updateValue = (rootObject = {}, onChange, onClose) => {
  const dataType = objectPath.get(rootObject, "type", FieldDataType.TypeString)

  let data = ""
  if (dataType !== FieldDataType.TypeString) {
    try {
      const narrowedRootObject = { type: rootObject.type, data: rootObject.data }
      data = JSON.stringify(narrowedRootObject)
    } catch (err) {
      data = err.toString()
    }
  } else {
    data = objectPath.get(rootObject, "string", "")
  }

  if (onChange) {
    onChange(data)
  }
  onClose()
}

export const getRootObject = (value = "") => {
  try {
    return JSON.parse(value)
  } catch (_err) {
    return { type: FieldDataType.TypeString, string: value }
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
