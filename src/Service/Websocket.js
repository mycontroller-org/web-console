import { api } from "../Service/Api"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { store } from "../store/persister"
import { updateEvent } from "../store/entities/websocket"

let wsClient = null
let wsUrl = null

const getWebsocketUrl = () => {
  // workaround to websocket proxy on development mode
  // call websocket http url once
  if (process.env.REACT_APP_IS_DEV_ENV === "true" && wsUrl === null) {
    api.websocket.get().catch((_e) => {})
  }

  wsUrl = new URL("/api/ws", window.location.href)
  wsUrl.protocol = wsUrl.protocol.replace("http", "ws")

  // add authorization token
  let token = ""
  const auth = store.getState().entities.auth
  if (auth.authenticated) {
    token = auth.token
  }
  return `${wsUrl.href}?access_token=${token}`
}

export const wsConnect = () => {
  wsClient = new W3CWebSocket(getWebsocketUrl())

  wsClient.onopen = () => {
    console.log("WebSocket Client Connected")
  }

  wsClient.onmessage = (message) => {
    store.dispatch(updateEvent({ response: message.data }))
  }

  wsClient.onclose = (err) => {
    console.log("websocket is closed", err.reason)
    if (wsClient !== null) {
      console.log("websocket reconnect will be attempted in 1 second")
    }
    setTimeout(function () {
      if (wsClient != null) {
        wsConnect()
      }
    }, 1000)
  }

  wsClient.onerror = (err) => {
    console.error("websocket encountered error: ", err.message, "Closing socket")
    wsClient.close()
  }
}

export const wsDisconnect = () => {
  if (wsClient != null) {
    const _wsClient = wsClient
    wsClient = null
    _wsClient.close()
  }
}
