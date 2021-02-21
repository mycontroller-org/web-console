import objectPath from "object-path"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Components/Form/Constants"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { v4 as uuidv4 } from "uuid"
import { Dampening, DampeningOptions } from "../../Constants"

class UpdatePage extends React.Component {
  render() {
    const { id } = this.props.match.params

    const isNewEntry = id === undefined || id === ""

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.task.get}
        apiSaveRecord={api.task.update}
        minimapEnabled
        onSaveRedirectFunc={() => {
          r(this.props.history, rMap.actions.task.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.actions.task.list)
        }}
        getFormItems={(rootObject) => getFormItems(rootObject, id)}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="Add a Task" />
          <PageContent hasNoPaddingTop>{editor} </PageContent>
        </>
      )
    }
    return editor
  }
}

export default UpdatePage

// support functions

const getFormItems = (rootObject, id) => {
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
      helperTextInvalid: "Invalid name. chars: min=4, max=100, and space not allowed",
      validated: "default",
      validator: { isLength: { min: 4, max: 100 }, isNotEmpty: {}, isID: {} },
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
      label: "Ignore Duplicate",
      fieldId: "ignoreDuplicate",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Auto Disable",
      fieldId: "autoDisable",
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
    },
    {
      label: "",
      fieldId: "!labels_end",
      fieldType: FieldType.Divider,
    },
    {
      label: "Trigger On Event",
      fieldId: "triggerOnEvent",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
  ]

  if (rootObject.triggerOnEvent) {
    items.push(
      {
        label: "Event Filters",
        fieldId: "!event_filters",
        fieldType: FieldType.Divider,
      },
      {
        label: "Resource Types",
        fieldId: "eventFilter.resourceTypes",
        fieldType: FieldType.DynamicArray,
        dataType: DataType.ArrayString,
        value: [],
      },
      {
        label: "Selectors",
        fieldId: "eventFilter.selectors",
        fieldType: FieldType.KeyValueMap,
        dataType: DataType.Object,
        value: {},
      }
    )
  } else {
    items.push({
      label: "Execution Interval",
      fieldId: "executionInterval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    })
  }

  items.push(
    {
      label: "Dampening",
      fieldId: "!dampening",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "dampening.type",
      fieldType: FieldType.Select,
      dataType: DataType.String,
      options: DampeningOptions,
      value: "",
      resetFields: { "dampening.occurrences": 0, "dampening.evaluations": 0, "dampening.activeTime": "" },
    }
  )

  // update dampening fields
  const dampeningType = objectPath.get(rootObject, "dampening.type", "")
  switch (dampeningType) {
    case Dampening.Consecutive:
      items.push({
        label: "Occurrences",
        fieldId: "dampening.occurrences",
        fieldType: FieldType.Text,
        dataType: DataType.Integer,
        value: "",
      })
      break

    case Dampening.LastNEvaluations:
      items.push(
        {
          label: "Evaluations",
          fieldId: "dampening.evaluations",
          fieldType: FieldType.Text,
          dataType: DataType.Integer,
          value: "",
        },
        {
          label: "Occurrences",
          fieldId: "dampening.occurrences",
          fieldType: FieldType.Text,
          dataType: DataType.Integer,
          value: "",
        }
      )
      break
    case Dampening.ActiveTime:
      items.push({
        label: "Active Time",
        fieldId: "dampening.activeTime",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
      })
      break

    default:
  }

  items.push(
    {
      label: "Variables",
      fieldId: "!variables",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "variables",
      fieldType: FieldType.VariablesMap,
      keyLabel: "Variable Name",
      dataType: DataType.Object,
      value: {},
    }
  )

  if (rootObject.remoteCall) {
  } else {
    items.push(
      {
        label: "Rule",
        fieldId: "!rule",
        fieldType: FieldType.Divider,
      },
      {
        label: "Match All",
        fieldId: "rule.matchAll",
        fieldType: FieldType.Switch,
        dataType: DataType.Boolean,
        value: false,
      },
      {
        label: "Conditions",
        fieldId: "rule.conditions",
        fieldType: FieldType.ConditionsArrayMap,
        dataType: DataType.ArrayObject,
        value: [],
      }
    )
  }

  items.push(
    {
      label: "Notify",
      fieldId: "!notify",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "notify",
      valueLabel: "Handler",
      fieldType: FieldType.DynamicArray,
      dataType: DataType.ArrayString,
      value: [],
    }
  )

  return items
}
