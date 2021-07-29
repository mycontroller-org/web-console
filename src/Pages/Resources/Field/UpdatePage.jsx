import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Constants/Form"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { MetricTypeOptions } from "../../../Constants/Metric"

class UpdatePage extends React.Component {
  state = {
    loading: false,
  }

  componentDidMount() {}

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
        apiGetRecord={api.field.get}
        apiSaveRecord={api.field.update}
        minimapEnabled
        onSaveRedirectFunc={() => {
          r(this.props.history, rMap.resources.field.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.resources.field.list)
        }}
        getFormItems={(rootObject) => getFormItems(rootObject)}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="Add a Field" />
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

  // do not set id, new id will be updated on the server side
  const items = [
    {
      label: "ID",
      fieldId: "id",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
      isDisabled: true,
      helperText: "",
      helperTextInvalid: "",
      validated: "default",
      options: [],
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
      fieldType: FieldType.SelectTypeAheadAsync,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
      isDisabled: !rootObject.gatewayId,
      apiOptions: api.node.list,
      optionValueKey: "nodeId",
      getFiltersFunc: (value) => {
        return [
          { k: "gatewayId", o: "eq", v: rootObject.gatewayId },
          { k: "nodeId", o: "regex", v: value },
        ]
      },
      getOptionsDescriptionFunc: (item) => {
        return item.name
      },
    },
    {
      label: "Source ID",
      fieldId: "sourceId",
      fieldType: FieldType.SelectTypeAheadAsync,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
      isDisabled: !rootObject.nodeId || !rootObject.gatewayId,
      apiOptions: api.source.list,
      optionValueKey: "sourceId",
      getFiltersFunc: (value) => {
        return [
          { k: "gatewayId", o: "eq", v: rootObject.gatewayId },
          { k: "nodeId", o: "eq", v: rootObject.nodeId },
          { k: "sourceId", o: "regex", v: value },
        ]
      },
      getOptionsDescriptionFunc: (item) => {
        return item.name
      },
    },
    {
      label: "Field ID",
      fieldId: "fieldId",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Field ID. chars: min=1 and max=100",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {}, isID: {} },
    },
    {
      label: "Name",
      fieldId: "name",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid name. chars: min=2 and max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Unit",
      fieldId: "unit",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Metric Type",
      fieldId: "metricType",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: MetricTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
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
      validated: "default",
      validator: { isLabel: {} },
    },
    {
      label: "Value Formatter",
      fieldId: "!value_formatter",
      fieldType: FieldType.Divider,
    },
    {
      label: "On Receive",
      fieldId: "formatter.onReceive",
      fieldType: FieldType.ScriptEditor,
      dataType: DataType.String,
      value: "",
      saveButtonText: "Update",
      updateButtonText: "Update Javascript",
      language: "javascript",
      minimapEnabled: true,
      isRequired: false,
    },
  ]

  return items
}
