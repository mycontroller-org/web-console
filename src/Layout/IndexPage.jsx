import { Banner } from "@patternfly/react-core"
import React from "react"
import { withTranslation } from "react-i18next"
import { connect } from "react-redux"
import t from "typy"
import ErrorBoundary from "../Components/ErrorBoundary/ErrorBoundary"
import { URL_DOCUMENTATION } from "../Constants/Common"
import i18n from "../i18n/i18n"
import { api } from "../Service/Api"
import { updateDocumentationUrl, updateMetricsDBStatus } from "../store/entities/about"
import PageLayoutExpandableNav from "./Layout"
import PageLayoutLogin from "./Login"

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
        this.setState({ loginData: { message: t("error_on_getting_login_message") } })
      })
  }

  // listens language change event from redux and updates
  updateLocale = () => {
    const { languageSelected } = this.props
    if (i18n.language !== languageSelected) {
      i18n.changeLanguage(languageSelected)
    }
  }

  render() {
    const { isAuthenticated, metricsDBDisabled, t } = this.props

    // update locale
    this.updateLocale()
    const component = isAuthenticated ? <PageLayoutExpandableNav /> : <PageLayoutLogin />
    const banner = metricsDBDisabled ? (
      <Banner key="banner-metrics-database" variant="warning">
        <strong>{t("metrics_database_disabled")}</strong>
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
  languageSelected: state.entities.locale.language,
})

const mapDispatchToProps = (dispatch) => ({
  updateDocUrl: (data) => dispatch(updateDocumentationUrl(data)),
  updateMetricsDB: (data) => dispatch(updateMetricsDBStatus(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(IndexPage))
