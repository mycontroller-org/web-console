import { api } from "../../../Service/Api"
import { ResourceType } from "../../../Constants/ResourcePicker"
import { routeMap as rMap } from "../../../Service/Routes"
import objectPath from "object-path"

export const getListAPI = (resourceType) => {
  switch (resourceType) {
    case ResourceType.Gateway:
      return api.gateway.list
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

export const getField = (resourceType, resource, resourceNameKey) => {
  switch (resourceType) {
    case ResourceType.Gateway:
    case ResourceType.Task:
    case ResourceType.Schedule:
    case ResourceType.Handler:
      return {
        id: resource.id,
        label: objectPath.get(resource, resourceNameKey, "undefined"),
        isChecked: resource.enabled,
        quickId: resourceType + ":" + resource.id,
      }

    case ResourceType.SensorField:
      return {
        id: resource.id,
        label: objectPath.get(resource, resourceNameKey, "undefined"),
        isChecked: resource.payload.value,
        quickId:
          resourceType +
          ":" +
          resource.gatewayId +
          "." +
          resource.nodeId +
          "." +
          resource.sensorId +
          "." +
          resource.fieldId,
      }

    default:
      return { id: "", label: "unknown resource type" }
  }
}

export const getDetailPage = (resourceType) => {
  switch (resourceType) {
    case ResourceType.Gateway:
      return rMap.resources.gateway.detail
    case ResourceType.SensorField:
      return rMap.resources.sensorField.detail
    case ResourceType.Task:
      return rMap.actions.task.detail
    case ResourceType.Schedule:
      return rMap.actions.scheduler.detail
    case ResourceType.Handler:
      return rMap.actions.handler.detail
    default:
      return ""
  }
}
