import React from "react"
import { Provider } from "react-redux"
//import './App.css';
import "./custom.scss"
import IndexPage from "./Layout/IndexPage"
// import Login from "./Layout/Login"
import store from "./store/configureStore"

function App() {
  return (
    <Provider store={store}>
      <IndexPage />
    </Provider>
  )
  //return <Login />
}

export default App
