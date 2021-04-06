import { createSlice } from "@reduxjs/toolkit"
import { getValue } from "../../Util/Util"

const slice = createSlice({
  name: "websocket",
  initialState: {
    subscription: {},
    data: {},
  },
  reducers: {
    subscribe: (state, action) => {
      const { subscribe = [] } = action.payload
      state.subscription = subscribe
    },

    unsubscribe: (state, action) => {
      const { unsubscribe = [] } = action.payload
      if (unsubscribe.length === 0) {
        state.subscription = []
      } else {
        // TODO: remove specific subscriptions
      }
    },

    loadData: (state, action) => {
      const { key, resources = [] } = action.payload
      let data = { ...state.data }
      data[key] = resources
      state.data = data
    },

    unloadData: (state, action) => {
      const { key } = action.payload
      let data = { ...state.data }
      delete data[key]
      state.data = data
    },

    updateResource: (state, action) => {
      const { response } = action.payload
      let data = { ...state.data }
      state.data = updateItem(data, response)
    },
  },
})

export default slice.reducer

export const { subscribe, unsubscribe, loadData, unloadData, updateResource } = slice.actions

// helpers
const updateItem = (data = {}, responseString = "{}") => {
  // console.log("received:", responseString)
  const keys = Object.keys(data)
  const response = JSON.parse(responseString)
  const responseData = response.data
  if (response.type !== "resource" || responseData === undefined) {
    return data
  }

  

  const quickId = responseData.quickId
  const resource = responseData.resource

  keys.forEach((key) => {
    const items = getValue(data, key, {})
    if (items[quickId] !== undefined) {
      //console.log("updated:", responseString)
      items[quickId] = resource
      data[key] = items
    }
  })
  return data
}
