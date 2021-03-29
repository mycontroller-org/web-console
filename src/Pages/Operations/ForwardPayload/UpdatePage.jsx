import objectPath from "object-path"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Constants/Form"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { v4 as uuidv4 } from "uuid"
import {ResourceType} from "../../../Constants/ResourcePicker"

class UpdatePage extends React.Component {
  render() {
    const { id } = this.props.match.params

    const isNewEntry = id === undefined || id === ""

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.forwardPayload.get}
        apiSaveRecord={api.forwardPayload.update}
        minimapEnabled
        onSaveRedirectFunc={() => {
          r(this.props.history, rMap.operations.forwardPayload.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.operations.forwardPayload.list)
        }}
        getFormItems={getFormItems}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="Add a Forward Payload" />
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
      validator: { isNotEmpty: {} },
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
      label: "Description",
      fieldId: "description",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Enabled",
      fieldId: "enabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
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
      validator: { isLabel: {} },
    },
    {
      label: "Mapping",
      fieldId: "!mapping",
      fieldType: FieldType.Divider,
    },
    {
      label: "Source Field",
      fieldId: "srcFieldId",
      fieldType: FieldType.SelectTypeAheadAsync,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
      apiOptions: api.field.list,
      getFiltersFunc: (value) => {
        return [{ k: "name", o: "regex", v: value }]
      },
      optionValueFunc: getResourceOptionValueFunc,
      getOptionsDescriptionFunc: getOptionsDescriptionFuncImpl,
    },
    {
      label: "Destination Field",
      fieldId: "dstFieldId",
      fieldType: FieldType.SelectTypeAheadAsync,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
      apiOptions: api.field.list,
      getFiltersFunc: (value) => {
        return [{ k: "name", o: "regex", v: value }]
      },
      optionValueFunc: getResourceOptionValueFunc,
      getOptionsDescriptionFunc: getOptionsDescriptionFuncImpl,
    },
  ]

  return items
}

// get display field name
const getOptionsDescriptionFuncImpl = (item) => {
  return item.name
}


const getResourceOptionValueFunc = (item) => {
  return `${ResourceType.Field}:${item.gatewayId}.${item.nodeId}.${item.sourceId}.${item.fieldId}`
}