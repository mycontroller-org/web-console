import React from "react"
import Dashboard from "../Pages/Dashboard/Dashboard"
import TopologyPage from "../Pages/Topology/Topology"
import DummyPage from "../Pages/DummyPage/DummyPage"
import DummyPage2 from "../Pages/DummyPage2/DummyPage2"
import { TachometerAltIcon } from "@patternfly/react-icons"
import GatewayListPage from "../Pages/Resources/Gateway/List"
import NodeListPage from "../Pages/Resources/Node/List"
import SensorListPage from "../Pages/Resources/Sensor/List"
import SensorFieldListPage from "../Pages/Resources/SensorField/List"
import GatewayDetailPage from "../Pages/Resources/Gateway/Detail"
import NodeDetailPage from "../Pages/Resources/Node/Detail"
import SensorDetailPage from "../Pages/Resources/Sensor/Detail"
import SensorFieldDetailPage from "../Pages/Resources/SensorField/Detail"

const routeMap = {
  home: "/",
  dashboard: "/dashboard",
  resources: {
    gateway: {
      list: "/resources/gateway",
      detail: "/resources/gateway/list/:id",
      update: "/resources/gateway/update/:id",
    },
    node: {
      list: "/resources/node",
      detail: "/resources/node/list/:id",
      update: "/resources/node/update/:id",
    },
    sensor: {
      list: "/resources/sensor",
      detail: "/resources/sensor/list/:id",
      update: "/resources/sensor/update/:id",
    },
    sensorField: {
      list: "/resources/field",
      detail: "/resources/field/list/:id",
      update: "/resources/field/update/:id",
    },
  },
}

const routes = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <TachometerAltIcon />,
    children: [
      {
        id: "dashboardMain",
        title: "Dashboard",
        to: "/dashboard/main",
        component: Dashboard,
        icon: <TachometerAltIcon />,
      },
      {
        id: "dashboardTopology",
        title: "Topology",
        to: "/dashboard/topology",
        component: TopologyPage,
      },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    children: [
      {
        id: "gateway",
        title: "Gateway",
        to: routeMap.resources.gateway.list,
        component: GatewayListPage,
      },
      {
        id: "node",
        title: "Node",
        to: routeMap.resources.node.list,
        component: NodeListPage,
      },
      {
        id: "sensor",
        title: "Sensor",
        to: routeMap.resources.sensor.list,
        component: SensorListPage,
      },
      {
        id: "field",
        title: "Sensor Field",
        to: routeMap.resources.sensorField.list,
        component: SensorFieldListPage,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    to: "/settings",
    component: DummyPage,
  },
  {
    id: "DropPage",
    title: "Drop Down test",
    to: "/dropdown",
    component: DummyPage2,
  },
]

const hiddenRoutes = [
  {
    to: routeMap.home,
    component: Dashboard,
  },
  {
    to: routeMap.resources.gateway.detail,
    component: GatewayDetailPage,
  },
  {
    to: routeMap.resources.node.detail,
    component: NodeDetailPage,
  },
  {
    to: routeMap.resources.sensor.detail,
    component: SensorDetailPage,
  },
  {
    to: routeMap.resources.sensorField.detail,
    component: SensorFieldDetailPage,
  },
]

const redirect = (history, to = routeMap.home, urlParams = {}) => {
  //console.log(history, to, urlParams)
  //const to = t(routeMap, name).safeString
  if (to) {
    let finalPath = to
    Object.keys(urlParams).forEach((key) => {
      finalPath = finalPath.replace(":" + key, urlParams[key])
    })
    history.push(finalPath)
  }
}

export { routes, hiddenRoutes, routeMap, redirect }
