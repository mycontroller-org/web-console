import { combineReducers } from "redux"
import aboutReducer from "./entities/about"
import authReducer from "./entities/auth"
import dashboardReducer from "./entities/dashboard"
import spinnerReducer from "./entities/globalSpinner"
import notificationReducer from "./entities/notification"
import resourceGatewayReducer from "./entities/resources/gateway"
import resourceNodeReducer from "./entities/resources/node"
import resourceSourceReducer from "./entities/resources/source"
import resourceFieldReducer from "./entities/resources/field"
import resourceFirmwareReducer from "./entities/resources/firmware"
import resourceDataRepositoryReducer from "./entities/resources/dataRepository"
import operationForwardPayloadReducer from "./entities/operations/forwardPayload"
import operationTaskReducer from "./entities/operations/task"
import operationHandlerReducer from "./entities/operations/handler"
import operationSchedulerReducer from "./entities/operations/scheduler"
import systemBackupReducer from "./entities/system/backup"
import websocketReducer from "./entities/websocket"
import toasterReducer from "./entities/toaster"

export default combineReducers({
  notification: notificationReducer,
  toaster: toasterReducer,
  about: aboutReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  spinner: spinnerReducer,
  resourceGateway: resourceGatewayReducer,
  resourceNode: resourceNodeReducer,
  resourceSource: resourceSourceReducer,
  resourceField: resourceFieldReducer,
  resourceFirmware: resourceFirmwareReducer,
  resourceDataRepository: resourceDataRepositoryReducer,
  operationForwardPayload: operationForwardPayloadReducer,
  operationTask: operationTaskReducer,
  operationHandler: operationHandlerReducer,
  operationScheduler: operationSchedulerReducer,
  systemBackup: systemBackupReducer,
  websocket: websocketReducer,
})
