import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
  name: "auth",
  initialState: {
    authenticated: false,
    token: "",
    user: {},
  },
  reducers: {
    authSuccess: (state, action) => {
      state.authenticated = true
      state.user = {
        ...action.payload,
      }
      state.token = action.payload.token
    },
    clearAuth: (state, action) => {
      state.authenticated = false
      state.token = ""
      state.user = {}
    },
    updateUser: (state, action) => {
      state.user = {
        ...action.payload,
      }
    },
  },
})

export default slice.reducer

export const { authSuccess, clearAuth, updateUser } = slice.actions
