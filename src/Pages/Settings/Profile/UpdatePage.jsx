import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Constants/Form"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { getValue } from "../../../Util/Util"

class UpdatePage extends React.Component {
  render() {
    const { id } = this.props.match.params

    const editor = (
      <Editor
        key="editor"
        resourceId={id ? id : "none"}
        language="yaml"
        apiGetRecord={api.auth.profile}
        apiSaveRecord={api.auth.updateProfile}
        minimapEnabled
        onSaveRedirectFunc={() => {
          r(this.props.history, rMap.dashboard)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.dashboard)
        }}
        getFormItems={getFormItems}
      />
    )

    return editor
  }
}

export default UpdatePage

// support functions
const getFormItems = (rootObject) => {
  const newPassword = getValue(rootObject, "newPassword", "")
  const confirmPassword = getValue(rootObject, "confirmPassword", "")

  let passwordValidator = null
  let isNewPasswordRequired = false

  if (newPassword !== "" || confirmPassword !== "") {
    isNewPasswordRequired = true
    passwordValidator = { isLength: { min: 3, max: 100 }, isNotEmpty: {} }
  }

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
      label: "Username",
      fieldId: "username",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      isRequired: true,
      value: "",
      helperText: "",
      helperTextInvalid: "Invalid username. chars: min=3, max=100, and space not allowed",
      validated: "default",
      validator: { isLength: { min: 3, max: 100 }, isNotEmpty: {}, isID: {} },
    },
    {
      label: "Email",
      fieldId: "email",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      isRequired: true,
      value: "",
      helperText: "",
      helperTextInvalid: "Invalid email.",
      validated: "default",
      validator: { isEmail: {} },
    },
    {
      label: "Full Name",
      fieldId: "fullName",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      isRequired: true,
      value: "",
      helperText: "",
      helperTextInvalid: "Invalid name. chars: min=3, max=100, and space not allowed",
      validated: "default",
      validator: { isLength: { min: 3, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Current Password",
      fieldId: "currentPassword",
      fieldType: FieldType.Password,
      dataType: DataType.String,
      isRequired: true,
      value: "",
      helperText: "",
      helperTextInvalid: "Enter your current password",
      validated: "default",
    },
    {
      label: "New Password",
      fieldId: "newPassword",
      fieldType: FieldType.Password,
      dataType: DataType.String,
      isRequired: isNewPasswordRequired,
      value: "",
      helperText: "",
      helperTextInvalid: "Invalid password. chars: min=3, max=100",
      validated: "default",
      validator: passwordValidator,
    },
    {
      label: "Confirm Password",
      fieldId: "confirmPassword",
      fieldType: FieldType.Password,
      dataType: DataType.String,
      isRequired: isNewPasswordRequired,
      value: "",
      helperText: "",
      helperTextInvalid: "Invalid password. chars: min=3, max=100",
      validated: "default",
      validator: passwordValidator,
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
      value: {},
    },
  ]

  return items
}
