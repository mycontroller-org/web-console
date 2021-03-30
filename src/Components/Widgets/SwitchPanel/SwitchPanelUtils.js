import { api } from "../../../Service/Api"
import { ResourceType } from "../../../Constants/ResourcePicker"
import { routeMap as rMap } from "../../../Service/Routes"
import objectPath from "object-path"

export const getListAPI = (resourceType) => {
  switch (resourceType) {
    case ResourceType.Gateway:
      return api.gateway.list
    case ResourceType.Field:
      return api.field.list
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
        type: resourceType,
        label: objectPath.get(resource, resourceNameKey, "undefined"),
        isChecked: resource.enabled,
        quickId: `${resourceType}:${resource.id}`,
      }

    case ResourceType.Field:
      return {
        id: resource.id,
        type: resourceType,
        label: objectPath.get(resource, resourceNameKey, "undefined"),
        isChecked: resource.current.value,
        quickId: `${resourceType}:${resource.gatewayId}.${resource.nodeId}.${resource.sourceId}.${resource.fieldId}`,
      }

    default:
      return { id: "", label: "unknown resource type" }
  }
}

export const getDetailPage = (resourceType) => {
  switch (resourceType) {
    case ResourceType.Gateway:
      return rMap.resources.gateway.detail
    case ResourceType.Field:
      return rMap.resources.field.detail
    case ResourceType.Task:
      return rMap.operations.task.detail
    case ResourceType.Schedule:
      return rMap.operations.scheduler.detail
    case ResourceType.Handler:
      return rMap.operations.handler.detail
    default:
      return ""
  }
}
