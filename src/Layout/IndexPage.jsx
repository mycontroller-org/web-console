import React from "react"
import { connect } from "react-redux"
import PageLayoutExpandableNav from "./Layout"
import PageLayoutLogin from "./Login"
import ErrorBoundary from "../Components/ErrorBoundary/ErrorBoundary"
import { Banner } from "@patternfly/react-core"

class IndexPage extends React.Component {
  render() {
    const component = this.props.isAuthenticated ? <PageLayoutExpandableNav /> : <PageLayoutLogin />
    const banner = this.props.metricsDBDisabled ? (
      <Banner key="banner-metrics-database" variant="warning">
        <strong>WARNING: Metrics database disabled!</strong>
      </Banner>
    ) : null
    return (
      <ErrorBoundary hasMargin hasOffset>
        {banner}
        {component}
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.entities.auth.authenticated,
  metricsDBDisabled: state.entities.about.metricsDBDisabled,
})

export default connect(mapStateToProps)(IndexPage)
