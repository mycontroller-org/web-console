import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Constants/Form"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { v4 as uuidv4 } from "uuid"
import objectPath from "object-path"
import Loading from "../../../Components/Loading/Loading"
import { getValue } from "../../../Util/Util"

class UpdatePage extends React.Component {
  state = {
    loading: true,
  }

  componentDidMount() {
    this.setState({ loading: false })
  }

  render() {
    const { loading } = this.state

    if (loading) {
      return <Loading key="loading" />
    }

    const { id } = this.props.match.params

    const isNewEntry = id === undefined || id === ""

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.firmware.get}
        apiSaveRecord={api.firmware.update}
        minimapEnabled
        onSaveRedirectFunc={() => {
          r(this.props.history, rMap.resources.firmware.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.resources.firmware.list)
        }}
        getFormItems={(rootObject) => getFormItems(rootObject, id)}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="Add a Firmware" />
          <PageContent hasNoPaddingTop>{editor} </PageContent>
        </>
      )
    }
    return editor
  }
}

export default UpdatePage

// support functions

const getFormItems = (_rootObject, id) => {
  const items = [
    {
      label: "ID",
      fieldId: "id",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: id ? true : false,
      helperText: "",
      helperTextInvalid: "Invalid id. chars: min=3 and max=100",
      validated: "default",
      validator: { isLength: { min: 3, max: 100 }, isNotEmpty: {}, isID: {} },
    },
    {
      label: "Description",
      fieldId: "description",
      fieldType: FieldType.Text,
      dataType: DataType.String,
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
      value: "",
    },
  ]

  return items
}
