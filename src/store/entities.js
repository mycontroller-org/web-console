import { combineReducers } from "redux"
import aboutReducer from "./entities/about"
import authReducer from "./entities/auth"
import dashboardReducer from "./entities/dashboard"
import spinnerReducer from "./entities/globalSpinner"
import notificationReducer from "./entities/notification"
import resourceGatewayReducer from "./entities/resources/gateway"
import resourceNodeReducer from "./entities/resources/node"
import resourceSensorReducer from "./entities/resources/sensor"
import resourceSensorFieldReducer from "./entities/resources/sensorField"
import resourceFirmwareReducer from "./entities/resources/firmware"
import actionForwardPayloadReducer from "./entities/actions/forwardPayload"
import actionTaskReducer from "./entities/actions/task"
import actionHandlerReducer from "./entities/actions/handler"
import actionSchedulerReducer from "./entities/actions/scheduler"
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
  resourceSensor: resourceSensorReducer,
  resourceSensorField: resourceSensorFieldReducer,
  resourceFirmware: resourceFirmwareReducer,
  actionForwardPayload: actionForwardPayloadReducer,
  actionTask: actionTaskReducer,
  actionHandler: actionHandlerReducer,
  actionScheduler: actionSchedulerReducer,
})
