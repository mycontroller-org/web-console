import React from "react"
import { t } from "typy"
import Dashboard from "../Pages/Dashboard/Dashboard"
import DummyPage from "../Pages/DummyPage/DummyPage"
import DummyPage2 from "../Pages/DummyPage2/DummyPage2"
import { TachometerAltIcon } from "@patternfly/react-icons"
import GatewayListPage from "../Pages/Resources/Gateway/List"
import NodeListPage from "../Pages/Resources/Node/List"
import SensorListPage from "../Pages/Resources/Sensor/Sensor"
import SensorFieldListPage from "../Pages/Resources/SensorField/SensorField"

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
        component: Dashboard,
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
        to: "/resources/gateway",
        component: GatewayListPage,
      },
      {
        id: "node",
        title: "Node",
        to: "/resources/node",
        component: NodeListPage,
      },
      {
        id: "sensor",
        title: "Sensor",
        to: "/resources/sensor",
        component: SensorListPage,
      },
      {
        id: "field",
        title: "Sensor Field",
        to: "/resources/field",
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
    to: "/",
    component: Dashboard,
  },
]

const routeMap = {
  home: "/",
  dashboard: "/dashboard",
}

const redirect = (history, name = "home", urlParams = {}) => {
  const to = t(routeMap, name).safeString
  if (to) {
    let finalPath = to
    Object.keys(urlParams).forEach((key) => {
      finalPath = finalPath.replace(":" + key, urlParams[key])
    })
    history.push(finalPath)
  }
}

export { routes, hiddenRoutes, routeMap, redirect }
