import React from "react"
import { connect } from "react-redux"
import PageLayoutExpandableNav from "./Layout"
import PageLayoutLogin from "./Login"

class IndexPage extends React.Component {
  render() {
    return this.props.isAuthenticated ? <PageLayoutExpandableNav /> : <PageLayoutLogin />
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.entities.auth.authenticated,
})

export default connect(mapStateToProps)(IndexPage)
