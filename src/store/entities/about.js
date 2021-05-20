import { createSlice } from "@reduxjs/toolkit"
import { URL_DOCUMENTATION } from "../../Constants/Common"

const slice = createSlice({
  name: "about",
  initialState: {
    show: false,
    documentationUrl: URL_DOCUMENTATION,
  },
  reducers: {
    aboutShow: (about, action) => {
      about.show = true
    },

    aboutHide: (about, action) => {
      about.show = false
    },

    updateDocumentationUrl: (about, action) => {
      about.documentationUrl = action.payload.documentationUrl
    },
  },
})

export default slice.reducer

export const { aboutShow, aboutHide, updateDocumentationUrl } = slice.actions
