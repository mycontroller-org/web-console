import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Constants/Form"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { v4 as uuidv4 } from "uuid"
import objectPath from "object-path"

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
      return <span>Loading...</span>
    }

    const { id } = this.props.match.params

    const isNewEntry = id === undefined || id === ""

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.node.get}
        apiSaveRecord={api.node.update}
        minimapEnabled
        onSaveRedirectFunc={() => {
          r(this.props.history, rMap.resources.node.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.resources.node.list)
        }}
        getFormItems={getFormItems}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="Add a Node" />
          <PageContent hasNoPaddingTop>{editor} </PageContent>
        </>
      )
    }
    return editor
  }
}

export default UpdatePage

// support functions

const getFormItems = (rootObject) => {
  // set ID, if not set
  const newID = uuidv4().toString()
  objectPath.set(rootObject, "id", newID, true)
  const items = [
    {
      label: "ID",
      fieldId: "id",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: true,
      helperText: "",
      helperTextInvalid: "",
      validated: "default",
      validator: { isNotEmpty: {} },
    },
    {
      label: "Gateway",
      fieldId: "gatewayId",
      fieldType: FieldType.SelectTypeAheadAsync,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
      apiOptions: api.gateway.list,
      getFiltersFunc: (value) => {
        return [{ k: "id", o: "regex", v: value }]
      },
      getOptionsDescriptionFunc: (item) => {
        return item.description
      },
    },
    {
      label: "Node ID",
      fieldId: "nodeId",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Node ID. chars: min=1 and max=100",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isID: {}, isNotEmpty: {} },
    },
    {
      label: "Name",
      fieldId: "name",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid name. chars: min=4 and max=100",
      validated: "default",
      validator: { isLength: { min: 4, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Assigned Firmware",
      fieldId: "labels.assigned_firmware",
      fieldType: FieldType.SelectTypeAheadAsync,
      dataType: DataType.String,
      value: "",
      isRequired: false,
      apiOptions: api.firmware.list,
      optionValueKey: "id",
      getFiltersFunc: (value) => {
        return [{ k: "id", o: "regex", v: value }]
      },
      getOptionsDescriptionFunc: (item) => {
        return item.description
      },
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
