import React from "react"

// default Colors
const defaultTheme = {
  "--mc-background-color": "#fff",
  "--mc-components-background-color": "#fff",
  "--mc-dashboard-background-color": "#f7f7f7",
  "--mc-widget-background-color": "#fff",
  "--mc-widget-title-background-color": "#f6f6f6",
}

class Theme extends React.Component {
  state = {
    themes: [],
  }

  componentDidMount() {
    this.setState({ themes: [] })
  }

  updateTheme = (themeSettings = {}) => {
    const settings = { ...defaultTheme, ...themeSettings }
    const keys = Object.keys(settings)
    keys.map((key) => {
      document.documentElement.style.setProperty(key, settings[key])
    })
  }

  render() {
    this.updateTheme({})
    return null
  }
}

export default Theme
