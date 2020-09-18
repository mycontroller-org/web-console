import React from "react"

import PageLayoutExpandableNav from "./Layout/Layout"
import { Provider } from "react-redux"
// import Login from "./Layout/Login"
import store from "./store/configureStore"

//import './App.css';
import "./custom.css"

function App() {
  return (
    <Provider store={store}>
      <PageLayoutExpandableNav />
    </Provider>
  )
  //return <Login />
}

export default App
