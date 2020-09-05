import axios from "axios"
import qs from "qs"

import * as u from "../Util/Util"

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
    //console.log('Request:', request)
    return request
  },
  (error) => {
    console.log("REQ-Error:", error)
    return Promise.reject(error)
  }
)

// Add a response interceptor
myAxios.interceptors.response.use(
  (response) => {
    //console.log('Response:', response)
    return response
  },
  (error) => {
    // do some action
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
      qp[k] = u.toString(qp[k])
    }
  })
  return qp
}

const newRequest = (method, url, queryParams, data, headers) =>
  myAxios.request({
    method: method,
    //url: "/api" + url,
    url: "http://localhost:8080/api" + url,
    data: data,
    headers: { ...getHeaders(), ...headers },
    params: updateFilter(queryParams),
  })

export const api = {
  status: {
    get: () => newRequest(HTTP_VERBS.GET, "/status", {}, {}),
  },
  version: {
    get: () => newRequest(HTTP_VERBS.GET, "/version", {}, {}),
  },
  gateway: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/gateway", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/gateway/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/gateway/", {}, data),
  },
  node: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/node", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/node/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/node/", {}, data),
  },
  sensor: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/sensor", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/sensor/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/sensor/", {}, data),
  },
  sensorField: {
    list: (filter) => newRequest(HTTP_VERBS.GET, "/sensorfield", filter, {}),
    get: (id) => newRequest(HTTP_VERBS.GET, "/sensorfield/" + id, {}, {}),
    update: (data) => newRequest(HTTP_VERBS.POST, "/sensorfield/", {}, data),
  },
  settings: {
    get: (filter) => newRequest(HTTP_VERBS.GET, "/settings", filter, {}),
    getByKey: (key) => newRequest(HTTP_VERBS.GET, "/settings/" + key, {}, {}),
  },
}
