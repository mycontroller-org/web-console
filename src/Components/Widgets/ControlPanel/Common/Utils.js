import { api } from "../../../../Service/Api"
import { getQuickId, ResourceType } from "../../../../Constants/ResourcePicker"
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
    case ResourceType.DataRepository:
      return api.dataRepository.list
    default:
      return () => {}
  }
}

export const getResource = (
  resourceType,
  resource,
  resourceNameKey,
  resourceTimestampKey = "",
  controlType = ControlType.SwitchToggle,
  selector = ""
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
        selector: selector,
      }

    case ResourceType.DataRepository:
      return {
        id: resource.id,
        type: resourceType,
        label: label,
        payload: selector !== "" ? getValue(resource, `data.${selector}`, "") : "",
        timestamp:
          resourceTimestampKey === "" ? resource.modifiedOn : getValue(resource, resourceTimestampKey, ""),
        quickId: quickId,
        selector: selector,
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
        selector: selector,
      }

    default:
      return { id: "", label: "unknown resource type" }
  }
}
