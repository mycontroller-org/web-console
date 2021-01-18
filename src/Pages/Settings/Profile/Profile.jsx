import React from "react"
import { connect } from "react-redux"
import Loading from "../../../Components/Loading/Loading"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { updateUser } from "../../../store/entities/auth"

class ProfilePage extends React.Component {
  state = {
    loading: true,
  }
  componentDidMount() {
    // update profile
    api.auth
      .profile()
      .then((res) => {
        const profile = { ...res.data }
        this.props.updateUserDetail(profile)
        this.setState({ loading: false })
      })
      .catch((_e) => {
        this.setState({ loading: false })
      })
  }
  render() {
    if (this.state.loading) {
      return <Loading />
    }

    const data = <pre>{JSON.stringify(this.props.userDetail, "", 2)}</pre>
    return (
      <React.Fragment>
        <PageTitle title="Profile" />
        <PageContent>{data}</PageContent>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  userDetail: state.entities.auth.user,
})

const mapDispatchToProps = (dispatch) => ({
  updateUserDetail: (data) => dispatch(updateUser(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
