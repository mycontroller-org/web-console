import React from "react"
import { connect } from "react-redux"
import PageLayoutExpandableNav from "./Layout"
import PageLayoutLogin from "./Login"
import ErrorBoundary from "../Components/ErrorBoundary/ErrorBoundary"
import { Banner } from "@patternfly/react-core"
import { updateDocumentationUrl, updateMetricsDBStatus } from "../store/entities/about"
import { api } from "../Service/Api"
import { URL_DOCUMENTATION } from "../Constants/Common"

class IndexPage extends React.Component {
  componentDidMount() {
    api.status
      .get()
      .then((res) => {
        // update documentation url
        const docUrl = res.data.documentationUrl
        this.props.updateDocUrl({ documentationUrl: docUrl !== "" ? docUrl : URL_DOCUMENTATION })
        this.props.updateMetricsDB({ metricsDBDisabled: res.data.metricsDBDisabled })
      })
      .catch((_e) => {
        this.setState({ loginData: { message: "Error on fetching login message" } })
      })
  }

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

const mapDispatchToProps = (dispatch) => ({
  updateDocUrl: (data) => dispatch(updateDocumentationUrl(data)),
  updateMetricsDB: (data) => dispatch(updateMetricsDBStatus(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage)
