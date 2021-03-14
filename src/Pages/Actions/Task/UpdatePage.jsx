import objectPath from "object-path"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Constants/Form"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import {
  Dampening,
  DampeningOptions,
  ResourceEventTypeOptions,
  EvaluationType,
  EvaluationTypeOptions,
} from "../../../Constants/Task"
import { CallerType } from "../../../Constants/ResourcePicker"

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
      label: "Execution Mode",
      fieldId: "execution_mode",
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
        isRequired: false,
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.ArrayString,
        options: ResourceEventTypeOptions,
        isMulti: true,
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
      label: "Execution Interval (0h0m0s)",
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
      isDisabled: true, // Enable this when this feature is implemented
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
      label: "Load Variables",
      fieldId: "!variables",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "variables",
      fieldType: FieldType.VariablesMap,
      keyLabel: "Variable Name",
      dataType: DataType.Object,
      showUpdateButton: true,
      callerType: CallerType.Variable,
      value: {},
    }
  )

  let evaluationType = objectPath.get(rootObject, "evaluationType", "")
  if (evaluationType === "" || evaluationType === undefined) {
    objectPath.set(rootObject, "evaluationType", EvaluationType.Rule, false)
  }
  evaluationType = objectPath.get(rootObject, "evaluationType", "")

  items.push(
    {
      label: "Evaluation",
      fieldId: "!evaluation",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "evaluationType",
      fieldType: FieldType.ToggleButtonGroup,
      dataType: DataType.String,
      options: EvaluationTypeOptions,
      value: "",
      resetFields: { evaluationConfig: { rule: {}, javascript: "", webhookApi: "" } },
    }
  )

  switch (evaluationType) {
    case EvaluationType.Rule:
      items.push(
        {
          label: "Match All",
          fieldId: "evaluationConfig.rule.matchAll",
          fieldType: FieldType.Switch,
          dataType: DataType.Boolean,
          value: false,
        },
        {
          label: "Conditions",
          fieldId: "evaluationConfig.rule.conditions",
          fieldType: FieldType.ConditionsArrayMap,
          dataType: DataType.ArrayObject,
          value: [],
        }
      )
      break

    case EvaluationType.Javascript:
      items.push({
        label: "Script",
        fieldId: "evaluationConfig.javascript",
        fieldType: FieldType.ScriptEditor,
        dataType: DataType.String,
        value: "",
        saveButtonText: "Update",
        updateButtonText: "Update Script",
        language: "javascript",
        minimapEnabled: true,
        isRequired: true,
        helperText: "",
        helperTextInvalid: "script should not be empty",
        validated: "default",
        validator: { isNotEmpty: {} },
      })
      break

    case EvaluationType.Webhook:
      items.push({
        label: "Webhook API",
        fieldId: "evaluationConfig.webhookApi",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        helperText: "",
        helperTextInvalid: "Invalid server URL",
        validated: "default",
        validator: { isNotEmpty: {}, isURL: {} },
      })
      break

    default:
  }

  items.push(
    {
      label: "Parameters to Handler",
      fieldId: "!parameters",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "handlerParameters",
      fieldType: FieldType.VariablesMap,
      keyLabel: "Name",
      showUpdateButton: true,
      callerType: CallerType.Parameter,
      dataType: DataType.Object,
      value: {},
    },
    {
      label: "Notify Handlers",
      fieldId: "!handlers",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "handlers",
      fieldType: FieldType.DynamicArray,
      dataType: DataType.ArrayString,
      value: [],
    }
  )

  return items
}
