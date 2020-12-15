import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
  name: "auth",
  initialState: {
    authenticated: false,
    user: {},
  },
  reducers: {
    authSuccess: (state, action) => {
      state.authenticated = true
      state.user = {
        ...action.payload,
      }
    },

    clearAuth: (state, action) => {
      state.authenticated = false
      state.user = {}
    },
  },
})

export default slice.reducer

export const { authSuccess, clearAuth } = slice.actions
