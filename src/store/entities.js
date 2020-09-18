import { combineReducers } from "redux"
import notificationReducer from "./entities/notification"
import toasterReducer from "./entities/toaster"
import spinnerReducer from "./entities/globalSpinner"
import aboutReducer from "./entities/about"
import resourceGatewayReducer from "./entities/resources/gateway"
import resourceNodeReducer from "./entities/resources/node"
import resourceSensorReducer from "./entities/resources/sensor"
import resourceSensorFieldReducer from "./entities/resources/sensorField"

export default combineReducers({
  notification: notificationReducer,
  toaster: toasterReducer,
  about: aboutReducer,
  spinner: spinnerReducer,
  resourceGateway: resourceGatewayReducer,
  resourceNode: resourceNodeReducer,
  resourceSensor: resourceSensorReducer,
  resourceSensorField: resourceSensorFieldReducer,
})
