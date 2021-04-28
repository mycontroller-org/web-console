import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import "./app.scss"

import IndexPage from "./Layout/IndexPage"
// import Login from "./Layout/Login"
//import store from "./store/configureStore"
import { persistor, store } from "./store/persister"

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexPage />
      </PersistGate>
    </Provider>
  )
  //return <Login />
}

export default App
