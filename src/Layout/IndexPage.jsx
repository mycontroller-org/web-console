import React from "react"
import { connect } from "react-redux"
import PageLayoutExpandableNav from "./Layout"
import PageLayoutLogin from "./Login"
import ErrorBoundary from "../Components/ErrorBoundary/ErrorBoundary"

class IndexPage extends React.Component {
  render() {
    const component = this.props.isAuthenticated ? <PageLayoutExpandableNav /> : <PageLayoutLogin />
    return <ErrorBoundary hasMargin>{component}</ErrorBoundary>
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.entities.auth.authenticated,
})

export default connect(mapStateToProps)(IndexPage)
