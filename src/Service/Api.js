import axios from "axios"
import qs from "qs"
import { clearAuth } from "../store/entities/auth"
import { spinnerHide, spinnerShow } from "../store/entities/globalSpinner"
import { notificationAdd } from "../store/entities/notification"
import { toasterAdd } from "../store/entities/toaster"
//import store from "../store/configureStore"
import { store } from "../store/persister"

export const HTTP_CODES = {
  OK: 200,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  REQUEST_FAILED: 422,
  INTERNAL_SERVER: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
}

export const HTTP_VERBS = {
  DELETE: "delete",
  GET: "get",
  PATCH: "patch",
  POST: "post",
  PUT: "put",
}

const myAxios = axios.create({
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
})

// Add a request interceptor
myAxios.interceptors.request.use(
  (request) => {
    // console.log("request:", request)
    store.dispatch(spinnerShow())
    return request
  },
  (error) => {
    store.dispatch(spinnerHide())
    console.log("REQ-Error:", error)
    return Promise.reject(error)
  }
)

// Add a response interceptor
myAxios.interceptors.response.use(
  (response) => {
    //console.log('Response:', response)
    store.dispatch(spinnerHide())
    return response
  },
  (error) => {
    const alert = {
      type: "danger",
      title: error.message,
      description: ["URL: " + error.config.url],
    }
    if (error.response && error.response.data) {
      alert.description.push("Message: " + JSON.stringify(error.response.data))
    }
    // update redux, if authenticated
    if (store.getState().entities.auth.authenticated) {
      // if unauthorized clear auth data
      if (error.response.status === 401) {
        store.dispatch(clearAuth())
      }
      store.dispatch(spinnerHide())
      store.dispatch(notificationAdd(alert))
      store.dispatch(toasterAdd(alert))
    }

    return Promise.reject(error)
  }
)

// Default headers will be included on all requests
const getHeaders = () => {
  return {
    "X-Auth-Type-Browser-UI": "1",
  }
}

// Converts object to JSON string
const updateFilter = (qp) => {
  const keys = ["filter", "sortBy"]
  keys.forEach((k) => {
    if (qp[k]) {
      // qp[k] = u.toString(qp[k])
      qp[k] = JSON.stringify(qp[k])
    }
  })
  return qp
}

const newRequest = (method, url, queryParams, data, headers) => {
  // grab current state
  const auth = store.getState().entities.auth
  if (auth.authenticated) {
    const token = "Bearer " + (auth.authenticated ? auth.token : "")
    headers = { ...headers, Authorization: token }
  }

  return myAxios.request({
    method: method,
    url: "/api" + url,
    //url: "http://localhost:8080/api" + url,
    data: data,
    headers: { ...getHeaders(), ...headers },
    params: updateFilter(queryParams),
  })
}

export const api = {
  status: {
    get: () => newRequest(HTTP_VERBS.GET, "/status", {}, {}),
  },
  version: {
    get: () => newRequest(HTTP_VERBS.GET, "/version", {}, {}),
  },
  auth: {
    login: (data) => newRequest(HTTP_VERBS.POST, "/user/login", {}, data),
    profile: () => newRequest(HTTP_VERBS.GET, "/user/profile", {}, {}),
  },
  gateway: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/gateway", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/gateway/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/gateway", {}, data),
    enable: (data) => newRequest(HTTP_VERBS.POST, "/gateway/enable", {}, data),
    disable: (data) => newRequest(HTTP_VERBS.POST, "/gateway/disable", {}, data),
    reload: (data) => newRequest(HTTP_VERBS.POST, "/gateway/reload", {}, data),
    delete: (data) => newRequest(HTTP_VERBS.DELETE, "/gateway", {}, data),
  },
  node: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/node", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/node/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/node", {}, data),
    delete: (data) => newRequest(HTTP_VERBS.DELETE, "/node", {}, data),
  },
  sensor: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/sensor", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/sensor/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/sensor", {}, data),
    delete: (data) => newRequest(HTTP_VERBS.DELETE, "/sensor", {}, data),
  },
  sensorField: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/sensorfield", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/sensorfield/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/sensorfield", {}, data),
    delete: (data) => newRequest(HTTP_VERBS.DELETE, "/sensorfield", {}, data),
  },
  metric: {
    fetch: (queries) => newRequest(HTTP_VERBS.POST, "/metric", {}, queries),
  },
  action: {
    send: (queries) => newRequest(HTTP_VERBS.GET, "/action", queries, {}),
    nodeAction: (queries) => newRequest(HTTP_VERBS.GET, "/action/node", queries, {}),
  },
  settings: {
    get: (filter) => newRequest(HTTP_VERBS.GET, "/settings", filter, {}),
    getByKey: (key) => newRequest(HTTP_VERBS.GET, "/settings/" + key, {}, {}),
  },
  dashboard: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/dashboard", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/dashboard/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/dashboard", {}, data),
    delete: (data) => newRequest(HTTP_VERBS.DELETE, "/dashboard", {}, data),
  },
  forwardPayload: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/forwardpayload", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/forwardpayload/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/forwardpayload", {}, data),
    delete: (data) => newRequest(HTTP_VERBS.DELETE, "/forwardpayload", {}, data),
    enable: (data) => newRequest(HTTP_VERBS.POST, "/forwardpayload/enable", {}, data),
    disable: (data) => newRequest(HTTP_VERBS.POST, "/forwardpayload/disable", {}, data),
  },
  firmware: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/firmware", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/firmware/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/firmware", {}, data),
    delete: (data) => newRequest(HTTP_VERBS.DELETE, "/firmware", {}, data),
    upload: (id, data, headers) => newRequest(HTTP_VERBS.POST, "/firmware/upload/" + id, {}, data, headers),
  },
  task: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/task", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/task/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/task", {}, data),
    delete: (data) => newRequest(HTTP_VERBS.DELETE, "/task", {}, data),
    enable: (data) => newRequest(HTTP_VERBS.POST, "/task/enable", {}, data),
    disable: (data) => newRequest(HTTP_VERBS.POST, "/task/disable", {}, data),
  },
  handler: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/handler", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/handler/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/handler", {}, data),
    enable: (data) => newRequest(HTTP_VERBS.POST, "/handler/enable", {}, data),
    disable: (data) => newRequest(HTTP_VERBS.POST, "/handler/disable", {}, data),
    reload: (data) => newRequest(HTTP_VERBS.POST, "/handler/reload", {}, data),
    delete: (data) => newRequest(HTTP_VERBS.DELETE, "/handler", {}, data),
  },
  scheduler: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/scheduler", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/scheduler/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/scheduler", {}, data),
    delete: (data) => newRequest(HTTP_VERBS.DELETE, "/scheduler", {}, data),
    enable: (data) => newRequest(HTTP_VERBS.POST, "/scheduler/enable", {}, data),
    disable: (data) => newRequest(HTTP_VERBS.POST, "/scheduler/disable", {}, data),
  },
}
