import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Constants/Form"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"

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

const getFormItems = (_rootObject) => {
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
      label: "Password",
      fieldId: "password",
      fieldType: FieldType.Password,
      dataType: DataType.String,
      isRequired: false,
      value: "",
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
