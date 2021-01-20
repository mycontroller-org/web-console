import { combineReducers } from "redux"
import aboutReducer from "./entities/about"
import authReducer from "./entities/auth"
import spinnerReducer from "./entities/globalSpinner"
import notificationReducer from "./entities/notification"
import resourceGatewayReducer from "./entities/resources/gateway"
import resourceNodeReducer from "./entities/resources/node"
import resourceSensorReducer from "./entities/resources/sensor"
import resourceSensorFieldReducer from "./entities/resources/sensorField"
import actionForwardPayloadReducer from "./entities/actions/forwardPayload"
import toasterReducer from "./entities/toaster"

export default combineReducers({
  notification: notificationReducer,
  toaster: toasterReducer,
  about: aboutReducer,
  auth: authReducer,
  spinner: spinnerReducer,
  resourceGateway: resourceGatewayReducer,
  resourceNode: resourceNodeReducer,
  resourceSensor: resourceSensorReducer,
  resourceSensorField: resourceSensorFieldReducer,
  actionForwardPayload: actionForwardPayloadReducer,
})
