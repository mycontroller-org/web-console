import React from "react"
import { connect } from "react-redux"
import PageLayoutExpandableNav from "./Layout"
import PageLayoutLogin from "./Login"
import ErrorBoundary from "../Components/ErrorBoundary/ErrorBoundary"
import { debounce } from "@patternfly/react-core"
import { updateWindowSize } from "../store/entities/globalSettings"

class IndexPage extends React.Component {
  // load window height and width to redux
  componentDidMount() {
    window.addEventListener(
      "resize",
      debounce(() => {
        // TODO: fix, this listener called often, seems called every 200ms
        const data = { height: window.innerHeight, width: window.innerWidth }
        const oldData = this.props.globalSettings.windowSize
        if (data.height !== oldData.height || data.width !== oldData.width) {
          this.props.updateWindowSize(data)
        }
      }, 200)
    )
  }

  render() {
    const component = this.props.isAuthenticated ? <PageLayoutExpandableNav /> : <PageLayoutLogin />
    return (
      <ErrorBoundary hasMargin hasOffset>
        {component}
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.entities.auth.authenticated,
  globalSettings: state.entities.globalSettings,
})

const mapDispatchToProps = (dispatch) => ({
  updateWindowSize: (data) => dispatch(updateWindowSize(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage)
