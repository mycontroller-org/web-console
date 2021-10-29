import objectPath from "object-path"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { DataType, FieldType } from "../../../Constants/Form"
import { CallerType, WebhookMethodTypeOptions } from "../../../Constants/ResourcePicker"
import {
  Dampening,
  DampeningOptions,
  EntityTypeOptions,
  EvaluationType,
  EvaluationTypeOptions,
  EventTypeOptions,
} from "../../../Constants/Task"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { FieldHandlersList } from "../../../Util/Common"
import { validate } from "../../../Util/Validator"

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
          r(this.props.history, rMap.operations.task.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.operations.task.list)
        }}
        getFormItems={(rootObject) => getFormItems(rootObject, id)}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="add_a_task" />
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
      label: "id",
      fieldId: "id",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: id ? true : false,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_id",
      validated: "default",
      validator: { isLength: { min: 4, max: 100 }, isNotEmpty: {}, isID: {} },
    },
    {
      label: "description",
      fieldId: "description",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "enabled",
      fieldId: "enabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "ignore_duplicate",
      fieldId: "ignoreDuplicate",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "auto_disable",
      fieldId: "autoDisable",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "labels",
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
      label: "execution_mode",
      fieldId: "execution_mode",
      fieldType: FieldType.Divider,
    },
    {
      label: "trigger_on_event",
      fieldId: "triggerOnEvent",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
  ]

  if (rootObject.triggerOnEvent) {
    items.push(
      {
        label: "event_filters",
        fieldId: "!event_filters",
        fieldType: FieldType.Divider,
      },
      {
        label: "entities",
        fieldId: "eventFilter.entityTypes",
        isRequired: false,
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.ArrayString,
        options: EntityTypeOptions,
        isMulti: true,
        value: [],
      },
      {
        label: "events",
        fieldId: "eventFilter.eventTypes",
        isRequired: false,
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.ArrayString,
        options: EventTypeOptions,
        isMulti: true,
        value: [],
      },
      {
        label: "filters",
        fieldId: "eventFilter.filters",
        fieldType: FieldType.KeyValueMap,
        dataType: DataType.Object,
        value: {},
      }
    )
  } else {
    items.push({
      label: "execution_interval_0h0m0s",
      fieldId: "executionInterval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_execution_interval_empty",
      validated: "default",
      validator: { isNotEmpty: {} },
    })
  }

  items.push(
    {
      label: "dampening",
      fieldId: "!dampening",
      fieldType: FieldType.Divider,
    },
    {
      label: "type",
      fieldId: "dampening.type",
      fieldType: FieldType.Select,
      dataType: DataType.String,
      options: DampeningOptions,
      isDisabled: true, // enable this when this feature is implemented also include i18n translations
      value: "",
      resetFields: { "dampening.occurrences": 0, "dampening.evaluations": 0, "dampening.activeTime": "" },
    }
  )

  // update dampening fields
  const dampeningType = objectPath.get(rootObject, "dampening.type", "")
  switch (dampeningType) {
    case Dampening.Consecutive:
      items.push({
        label: "occurrences",
        fieldId: "dampening.occurrences",
        fieldType: FieldType.Text,
        dataType: DataType.Integer,
        value: "",
      })
      break

    case Dampening.LastNEvaluations:
      items.push(
        {
          label: "evaluations",
          fieldId: "dampening.evaluations",
          fieldType: FieldType.Text,
          dataType: DataType.Integer,
          value: "",
        },
        {
          label: "occurrences",
          fieldId: "dampening.occurrences",
          fieldType: FieldType.Text,
          dataType: DataType.Integer,
          value: "",
        }
      )
      break
    case Dampening.ActiveTime:
      items.push({
        label: "active_time",
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
      label: "variables",
      fieldId: "!variables",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "variables",
      fieldType: FieldType.VariablesMap,
      keyLabel: "variable_name",
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
      label: "evaluation",
      fieldId: "!evaluation",
      fieldType: FieldType.Divider,
    },
    {
      label: "type",
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
          label: "match_all",
          fieldId: "evaluationConfig.rule.matchAll",
          fieldType: FieldType.Switch,
          dataType: DataType.Boolean,
          value: false,
        },
        {
          label: "conditions",
          fieldId: "evaluationConfig.rule.conditions",
          fieldType: FieldType.ConditionsArrayMap,
          dataType: DataType.ArrayObject,
          direction: "up",
          value: [],
        }
      )
      break

    case EvaluationType.Javascript:
      items.push({
        label: "script",
        fieldId: "evaluationConfig.javascript",
        fieldType: FieldType.ScriptEditor,
        dataType: DataType.String,
        value: "",
        saveButtonText: "update",
        updateButtonText: "update_script",
        language: "javascript",
        minimapEnabled: true,
        isRequired: true,
        helperText: "",
        helperTextInvalid: "helper_text.invalid_script_empty",
        validated: "default",
        validator: { isNotEmpty: {} },
      })
      break

    case EvaluationType.Webhook:
      const webhookItems = getWebhookItems(rootObject)
      items.push(...webhookItems)
      break

    default:
  }

  items.push(
    {
      label: "parameters_to_handler",
      fieldId: "!parameters",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "handlerParameters",
      fieldType: FieldType.VariablesMap,
      keyLabel: "name",
      showUpdateButton: true,
      callerType: CallerType.Parameter,
      dataType: DataType.Object,
      value: {},
    },
    {
      label: "handlers",
      fieldId: "!handlers",
      fieldType: FieldType.Divider,
    },
    { ...FieldHandlersList }
  )

  return items
}

const getWebhookItems = (_rootObject) => {
  const items = [
    {
      label: "url",
      fieldId: "evaluationConfig.webhook.url",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_url",
      validated: "default",
      validator: { isNotEmpty: {}, isURL: {} },
    },
    {
      label: "method",
      fieldId: "evaluationConfig.webhook.method",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: WebhookMethodTypeOptions,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "insecure_skip_verify",
      fieldId: "evaluationConfig.webhook.insecureSkipVerify",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "headers",
      fieldId: "evaluationConfig.webhook.headers",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.ArrayObject,
      value: {},
      validateKeyFunc: (key) => validate("isNotEmpty", key, {}),
      validateValueFunc: (value) => validate("isNotEmpty", value, {}),
    },
    {
      label: "query_parameters",
      fieldId: "evaluationConfig.webhook.queryParameters",
      fieldType: FieldType.ScriptEditor,
      dataType: DataType.Object,
      language: "yaml",
      updateButtonText: "update_query_parameters",
      value: {},
      isRequired: false,
    },
    {
      label: "include_config",
      fieldId: "evaluationConfig.webhook.includeConfig",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
  ]
  return items
}
