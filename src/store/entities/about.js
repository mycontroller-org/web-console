import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
  name: "about",
  initialState: {
    show: false,
  },
  reducers: {
    aboutShow: (about, action) => {
      about.show = true
    },

    aboutHide: (about, action) => {
      about.show = false
    },
  },
})

export default slice.reducer

export const { aboutShow, aboutHide } = slice.actions
