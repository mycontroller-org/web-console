import { TachometerAltIcon } from "@patternfly/react-icons"
import React from "react"
import Dashboard from "../Pages/Dashboard/Dashboard"
import GatewayUpdatePage from "../Pages/Resources/Gateway/UpdatePage"
// import DummyPage from "../Pages/DummyPage/DummyPage"
import { default as GatewayDetailPage } from "../Pages/Resources/Gateway/DetailsPage"
import GatewayListPage from "../Pages/Resources/Gateway/ListPage"
import NodeUpdatePage from "../Pages/Resources/Node/UpdatePage"
import NodeDetailPage from "../Pages/Resources/Node/DetailsPage"
import NodeListPage from "../Pages/Resources/Node/ListPage"
import SourceDetailPage from "../Pages/Resources/Source/DetailsPage"
import SourceListPage from "../Pages/Resources/Source/ListPage"
import SourceUpdatePage from "../Pages/Resources/Source/UpdatePage"
import FieldDetailPage from "../Pages/Resources/Field/DetailsPage"
import FieldListPage from "../Pages/Resources/Field/ListPage"
import FieldUpdatePage from "../Pages/Resources/Field/UpdatePage"
import ProfilePage from "../Pages/Settings/Profile/DetailsPage"
import ForwardPayloadListPage from "../Pages/Operations/ForwardPayload/ListPage"
import ForwardPayloadUpdatePage from "../Pages/Operations/ForwardPayload/UpdatePage"
import ForwardPayloadDetailPage from "../Pages/Operations/ForwardPayload/DetailsPage"
import FirmwareListPage from "../Pages/Resources/Firmware/ListPage"
import FirmwareUpdatePage from "../Pages/Resources/Firmware/UpdatePage"
import FirmwareDetailPage from "../Pages/Resources/Firmware/DetailsPage"
import DataRepositoryListPage from "../Pages/Resources/DataRepository/ListPage"
import DataRepositoryUpdatePage from "../Pages/Resources/DataRepository/UpdatePage"
import DataRepositoryDetailPage from "../Pages/Resources/DataRepository/DetailsPage"
import TaskListPage from "../Pages/Operations/Task/ListPage"
import TaskUpdatePage from "../Pages/Operations/Task/UpdatePage"
import TaskDetailPage from "../Pages/Operations/Task/DetailsPage"
import HandlerListPage from "../Pages/Operations/Handler/ListPage"
import HandlerUpdatePage from "../Pages/Operations/Handler/UpdatePage"
import HandlerDetailPage from "../Pages/Operations/Handler/DetailsPage"
import SchedulerListPage from "../Pages/Operations/Scheduler/ListPage"
import SchedulerUpdatePage from "../Pages/Operations/Scheduler/UpdatePage"
import SchedulerDetailPage from "../Pages/Operations/Scheduler/DetailsPage"
import SettingsSystemPage from "../Pages/Settings/System/DetailsPage"
import SystemBackupPage from "../Pages/Settings/Backup/ListPage"

// import dummyPage from "../Pages/DummyPage/DummyPage"
//import TopologyPage from "../Pages/Topology/Topology"

const routeMap = {
  home: "/",
  dashboard: "/dashboard",
  resources: {
    gateway: {
      list: "/resources/gateway",
      detail: "/resources/gateway/list/:id",
      update: "/resources/gateway/update/:id",
      add: "/resources/gateway/add",
    },
    node: {
      list: "/resources/node",
      detail: "/resources/node/list/:id",
      update: "/resources/node/update/:id",
      add: "/resources/node/add",
    },
    source: {
      list: "/resources/source",
      detail: "/resources/source/list/:id",
      update: "/resources/source/update/:id",
      add: "/resources/source/add",
    },
    field: {
      list: "/resources/field",
      detail: "/resources/field/list/:id",
      update: "/resources/field/update/:id",
      add: "/resources/field/add",
    },
    firmware: {
      list: "/resources/firmware",
      detail: "/resources/firmware/list/:id",
      update: "/resources/firmware/update/:id",
      add: "/resources/firmware/add",
    },
    dataRepository: {
      list: "/resources/datarepository",
      detail: "/resources/datarepository/list/:id",
      update: "/resources/datarepository/update/:id",
      add: "/resources/datarepository/add",
    },
  },
  settings: {
    profile: "/settings/profile",
    system: "/settings/system",
    backup: "/settings/backup",
  },
  operations: {
    forwardPayload: {
      list: "/operations/forwardpayload",
      detail: "/operations/forwardpayload/list/:id",
      update: "/operations/forwardpayload/update/:id",
      add: "/operations/forwardpayload/add",
    },
    task: {
      list: "/operations/task",
      detail: "/operations/task/list/:id",
      update: "/operations/task/update/:id",
      add: "/operations/task/add",
    },
    handler: {
      list: "/operations/handler",
      detail: "/operations/handler/list/:id",
      update: "/operations/handler/update/:id",
      add: "/operations/handler/add",
    },
    scheduler: {
      list: "/operations/scheduler",
      detail: "/operations/scheduler/list/:id",
      update: "/operations/scheduler/update/:id",
      add: "/operations/scheduler/add",
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
      // {
      //   id: "dashboardTopology",
      //   title: "Topology",
      //   to: "/dashboard/topology",
      //   component: TopologyPage,
      // },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    children: [
      {
        id: "gateway",
        title: "Gateways",
        to: routeMap.resources.gateway.list,
        component: GatewayListPage,
      },
      {
        id: "node",
        title: "Nodes",
        to: routeMap.resources.node.list,
        component: NodeListPage,
      },
      {
        id: "source",
        title: "Sources",
        to: routeMap.resources.source.list,
        component: SourceListPage,
      },
      {
        id: "field",
        title: "Fields",
        to: routeMap.resources.field.list,
        component: FieldListPage,
      },
      {
        id: "seperator_1",
        isSeparator: true,
      },
      {
        id: "firmware",
        title: "Firmwares",
        to: routeMap.resources.firmware.list,
        component: FirmwareListPage,
      },
      {
        id: "dataRepository",
        title: "Data Repository",
        to: routeMap.resources.dataRepository.list,
        component: DataRepositoryListPage,
      },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    children: [
      {
        id: "task",
        title: "Tasks",
        to: routeMap.operations.task.list,
        component: TaskListPage,
      },
      {
        id: "scheduler",
        title: "Schedules",
        to: routeMap.operations.scheduler.list,
        component: SchedulerListPage,
      },
      {
        id: "handler",
        title: "Handlers",
        to: routeMap.operations.handler.list,
        component: HandlerListPage,
      },
      {
        id: "forwardpayload",
        title: "Forward Payload",
        to: routeMap.operations.forwardPayload.list,
        component: ForwardPayloadListPage,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    children: [
      {
        id: "profile",
        title: "Profile",
        to: routeMap.settings.profile,
        component: ProfilePage,
      },
      {
        id: "system",
        title: "System",
        to: routeMap.settings.system,
        component: SettingsSystemPage,
      },
      {
        id: "backup-restore",
        title: "Backup and Restore",
        to: routeMap.settings.backup,
        component: SystemBackupPage,
      },
    ],
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
    to: routeMap.resources.gateway.add,
    component: GatewayUpdatePage,
  },
  {
    to: routeMap.resources.node.detail,
    component: NodeDetailPage,
  },
  {
    to: routeMap.resources.node.add,
    component: NodeUpdatePage,
  },
  {
    to: routeMap.resources.source.detail,
    component: SourceDetailPage,
  },
  {
    to: routeMap.resources.source.add,
    component: SourceUpdatePage,
  },
  {
    to: routeMap.resources.field.detail,
    component: FieldDetailPage,
  },
  {
    to: routeMap.resources.field.add,
    component: FieldUpdatePage,
  },
  {
    to: routeMap.operations.forwardPayload.detail,
    component: ForwardPayloadDetailPage,
  },
  {
    to: routeMap.operations.forwardPayload.add,
    component: ForwardPayloadUpdatePage,
  },
  {
    to: routeMap.resources.firmware.detail,
    component: FirmwareDetailPage,
  },
  {
    to: routeMap.resources.firmware.add,
    component: FirmwareUpdatePage,
  },
  {
    to: routeMap.resources.dataRepository.detail,
    component: DataRepositoryDetailPage,
  },
  {
    to: routeMap.resources.dataRepository.add,
    component: DataRepositoryUpdatePage,
  },
  {
    to: routeMap.operations.task.detail,
    component: TaskDetailPage,
  },
  {
    to: routeMap.operations.task.add,
    component: TaskUpdatePage,
  },
  {
    to: routeMap.operations.handler.detail,
    component: HandlerDetailPage,
  },
  {
    to: routeMap.operations.handler.add,
    component: HandlerUpdatePage,
  },
  {
    to: routeMap.operations.scheduler.detail,
    component: SchedulerDetailPage,
  },
  {
    to: routeMap.operations.scheduler.add,
    component: SchedulerUpdatePage,
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
