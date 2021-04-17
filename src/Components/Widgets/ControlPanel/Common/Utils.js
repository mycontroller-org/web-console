import { api } from "../../../../Service/Api"
import { getQuickId, ResourceType } from "../../../../Constants/ResourcePicker"
import objectPath from "object-path"
import { ControlType } from "../../../../Constants/Widgets/ControlPanel"
import { getValue } from "../../../../Util/Util"

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

export const getResource = (
  resourceType,
  resource,
  resourceNameKey,
  resourceTimestampKey = "",
  controlType = ControlType.SwitchToggle
) => {
  const quickId = getQuickId(resourceType, resource)
  const defaultLabel = controlType !== ControlType.MixedControl ? "undefined" : resourceNameKey
  const label = getValue(resource, resourceNameKey, defaultLabel)

  switch (resourceType) {
    case ResourceType.Gateway:
    case ResourceType.Task:
    case ResourceType.Schedule:
    case ResourceType.Handler:
      return {
        id: resource.id,
        type: resourceType,
        label: label,
        payload: resource.enabled,
        timestamp:
          resourceTimestampKey === "" ? resource.lastSeen : getValue(resource, resourceTimestampKey, ""),
        quickId: quickId,
      }

    case ResourceType.Field:
      return {
        id: resource.id,
        type: resourceType,
        label: label,
        payload: resource.current.value,
        timestamp:
          resourceTimestampKey === "" ? resource.noChangeSince : getValue(resource, resourceTimestampKey, ""),
        quickId: quickId,
      }

    default:
      return { id: "", label: "unknown resource type" }
  }
}
