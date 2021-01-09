import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Components/Form/Constants"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"

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
      return <span>Loading...</span>
    }

    const editor = (
      <Editor
        key="editor"
        language="yaml"
        apiGetRecord={api.auth.profile}
        apiSaveRecord={api.auth.profile}
        minimapEnabled
        onSave={() => {
          r(this.props.history, rMap.resources.gateway.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.resources.gateway.list)
        }}
        getFormItems={getFormItems}
      />
    )

    return (
      <>
        <PageTitle key="page-title" title="Profile" />
        <PageContent hasNoPaddingTop>{editor} </PageContent>
      </>
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


// support functions

const getFormItems = (rootObject) => {
  const items = [
    {
      label: "ID",
      fieldId: "id",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: true,
    },
    {
      label: "Full Name",
      fieldId: "fullName",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Full Name. chars: min=2 and max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Username",
      fieldId: "username",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid username. chars: min=2 and max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Email",
      fieldId: "email",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      helperTextInvalid: "Invalid email id.",
      validated: "default",
      validator: { isEmail: {} },
    },
    {
      label: "Password",
      fieldId: "password",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      helperTextInvalid: "Invalid password. chars: min=2 and max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Labels",
      fieldId: "!labels",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "labels",
      fieldType: FieldType.Labels,
      dataType: DataType.Object,
      value: "",
    },
  ]

  return items
}
