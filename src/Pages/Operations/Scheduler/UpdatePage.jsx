import objectPath from "object-path"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Constants/Form"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import {
  WeekDayOptions,
  ScheduleFrequency,
  ScheduleFrequencyOptions,
  ScheduleType,
  ScheduleTypeOptions,
} from "../../../Constants/Schedule"
import { CallerType, WebhookMethodTypeOptions } from "../../../Constants/ResourcePicker"
import { CustomVariableType, CustomVariableTypeOptions } from "../../../Constants/Schedule"

class UpdatePage extends React.Component {
  render() {
    const { id } = this.props.match.params

    const isNewEntry = id === undefined || id === ""

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.scheduler.get}
        apiSaveRecord={api.scheduler.update}
        minimapEnabled
        onSaveRedirectFunc={() => {
          r(this.props.history, rMap.operations.scheduler.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.operations.scheduler.list)
        }}
        getFormItems={(rootObject) => getFormItems(rootObject, id)}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="Add a Schedule" />
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
  const isOnDateJob = objectPath.get(rootObject, "spec.frequency", "") === ScheduleFrequency.OnDate

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
      helperTextInvalid: "Invalid id. chars: min=4, max=100, and space not allowed",
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
      label: "Validity",
      fieldId: "!validity",
      fieldType: FieldType.Divider,
    },
    {
      label: "Enabled",
      fieldId: "validity.enabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
      isDisabled: isOnDateJob,
    },
  ]

  const validityEnabled = objectPath.get(rootObject, "validity.enabled", false)

  if (validityEnabled) {
    items.push(
      {
        label: "Date (yyyy-mm-dd)",
        fieldId: "validity.date",
        fieldType: FieldType.DateRangePicker,
        dataType: DataType.Object,
        value: {},
        isRequired: false,
        //helperTextInvalid: "Invalid date",
        validated: "default",
        //validator: { isNotEmpty: {} },
      },
      {
        label: "Time (hh:mm:ss)",
        fieldId: "validity.time",
        fieldType: FieldType.TimeRangePicker,
        dataType: DataType.Object,
        value: {},
        isRequired: false,
        //helperTextInvalid: "Invalid date",
        validated: "default",
        // validator: { isNotEmpty: {} },
      },
      {
        label: "Validate Time Everyday",
        fieldId: "validity.validateTimeEveryday",
        fieldType: FieldType.Switch,
        dataType: DataType.Boolean,
        value: false,
      }
    )
  }

  items.push(
    {
      label: "Schedule",
      fieldId: "!schedule",
      fieldType: FieldType.Divider,
    },
    {
      label: "Schedule Type",
      fieldId: "type",
      isRequired: true,
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: ScheduleTypeOptions,
      value: "",
      resetFields: { spec: {} },
      validator: { isNotEmpty: {} },
    }
  )

  const scheduleType = objectPath.get(rootObject, "type", "")

  switch (scheduleType) {
    case ScheduleType.Repeat:
      items.push(
        {
          label: "Interval (0h0m0s)",
          fieldId: "spec.interval",
          fieldType: FieldType.Text,
          dataType: DataType.String,
          value: "",
          isRequired: true,
          validator: { isNotEmpty: {} },
        },
        {
          label: "Repeat Count",
          fieldId: "spec.repeatCount",
          fieldType: FieldType.Text,
          dataType: DataType.Integer,
          value: "",
          isRequired: true,
          helperTextInvalid: "Invalid repeat count",
          validated: "default",
          validator: { isInt: {}, isNotEmpty: {} },
        }
      )
      break

    case ScheduleType.Cron:
      items.push({
        label: "Cron Expression",
        fieldId: "spec.cronExpression",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        validator: { isNotEmpty: {} },
      })
      break

    case ScheduleType.Simple:
    case ScheduleType.Sunrise:
    case ScheduleType.Sunset:
      updateSimpleJob(rootObject, items)
      break

    default:
  }

  // add notify handlers
  items.push(
    {
      label: "Load Variables",
      fieldId: "!variables",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "variables",
      showUpdateButton: true,
      callerType: CallerType.Variable,
      fieldType: FieldType.VariablesMap,
      keyLabel: "Variable Name",
      dataType: DataType.Object,
      value: {},
    }
  )

  // load custom variables
  const customVariableItems = loadCustomVariablesItems(rootObject)
  items.push(...customVariableItems)

  items.push(
    {
      label: "Parameters to Handler",
      fieldId: "!parameters",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "handlerParameters",
      showUpdateButton: true,
      callerType: CallerType.Parameter,
      fieldType: FieldType.VariablesMap,
      keyLabel: "Name",
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

const updateOneTimeJobDependencies = (rootObject, newValue) => {
  const validity = objectPath.get(rootObject, "validity", {})
  const frequency = objectPath.get(rootObject, "spec.frequency", "")
  if (frequency === ScheduleFrequency.OnDate) {
    return {
      enabled: false,
      date: {
        from: "",
        to: "",
      },
      time: {
        from: "",
        to: "",
      },
      validateTimeEveryday: false,
    }
  }
  return validity
}

const updateSimpleJob = (rootObject, items = []) => {
  items.push({
    label: "Frequency",
    fieldId: "spec.frequency",
    isRequired: true,
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    options: ScheduleFrequencyOptions,
    value: "",
    resetFields: {
      "spec.dayOfWeek": "",
      "spec.date": "",
      "spec.dayOfMonth": "",
      validity: updateOneTimeJobDependencies,
    },
    validator: { isNotEmpty: {} },
  })

  const frequency = objectPath.get(rootObject, "spec.frequency", "")
  switch (frequency) {
    case ScheduleFrequency.Daily:
      items.push({
        label: "Days of Week",
        fieldId: "spec.dayOfWeek",
        isRequired: true,
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.String,
        options: WeekDayOptions,
        isMulti: true,
        value: "",
        validator: { isNotEmpty: {} },
      })
      break

    case ScheduleFrequency.Weekly:
      items.push({
        label: "Day of Week",
        fieldId: "spec.dayOfWeek",
        isRequired: true,
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.String,
        options: WeekDayOptions,
        value: "",
        validator: { isNotEmpty: {} },
      })
      break

    case ScheduleFrequency.Monthly:
      items.push({
        label: "Date of Month",
        fieldId: "spec.dateOfMonth",
        fieldType: FieldType.Text,
        dataType: DataType.Integer,
        value: "",
        isRequired: true,
        helperTextInvalid: "Invalid date of month",
        validated: "default",
        validator: { isNotEmpty: {}, isInt: { gt: 0, lt: 32 } },
      })
      break

    case ScheduleFrequency.OnDate:
      items.push({
        label: "Date (yyyy-mm-dd)",
        fieldId: "spec.date",
        fieldType: FieldType.DatePicker,
        dataType: DataType.String,
        value: {},
        isRequired: true,
        helperTextInvalid: "Invalid date",
        validated: "default",
        validator: { isNotEmpty: {} },
      })
      break

    default:
  }

  const scheduleType = objectPath.get(rootObject, "type", "")

  if (scheduleType === ScheduleType.Simple) {
    items.push({
      label: "Time (hh:mm:ss)",
      fieldId: "spec.time",
      fieldType: FieldType.TimePicker,
      dataType: DataType.String,
      value: "",
      placeholder: "hh:mm:ss",
      isRequired: true,
      helperTextInvalid: "Invalid time",
      validated: "default",
      validator: { isNotEmpty: {} },
    })
  } else if (scheduleType !== "") {
    items.push({
      label: "Offset(0h0m0s)",
      fieldId: "spec.offset",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperTextInvalid: "Invalid time",
      validated: "default",
      validator: { isNotEmpty: {} },
    })
  }
}

const loadCustomVariablesItems = (rootObject) => {
  let customVariableType = objectPath.get(rootObject, "customVariableType", "")
  if (customVariableType === "" || customVariableType === undefined) {
    objectPath.set(rootObject, "customVariableType", CustomVariableType.None, false)
  }
  customVariableType = objectPath.get(rootObject, "customVariableType", CustomVariableType.None)

  const items = [
    {
      label: "Load Custom Variables",
      fieldId: "!custom_variables",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "customVariableType",
      fieldType: FieldType.ToggleButtonGroup,
      dataType: DataType.String,
      options: CustomVariableTypeOptions,
      value: "",
      resetFields: { customVariableConfig: { javascript: "", webhookApi: "" } },
    },
  ]

  switch (customVariableType) {
    case CustomVariableType.None:
      // no action needed
      break

    case CustomVariableType.Javascript:
      items.push({
        label: "Script",
        fieldId: "customVariableConfig.javascript",
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

    case CustomVariableType.Webhook:
      const webhookItems = getWebhookItems(rootObject)
      items.push(...webhookItems)
      break

    default:
  }

  return items
}

const getWebhookItems = (_rootObject) => {
  const items = [
    {
      label: "URL",
      fieldId: "customVariableConfig.webhook.url",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid URL",
      validated: "default",
      validator: { isNotEmpty: {}, isURL: {} },
    },
    {
      label: "Method",
      fieldId: "customVariableConfig.webhook.method",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: WebhookMethodTypeOptions,
      value: "",
      isRequired: true,
      helperTextInvalid: "Select a method",
      validated: "default",
      validator: { isNotEmpty: {} },
    },
    {
      label: "Insecure Skip Verify",
      fieldId: "customVariableConfig.webhook.insecureSkipVerify",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Headers",
      fieldId: "customVariableConfig.webhook.headers",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.ArrayObject,
      value: {},
      validateKeyFunc: (key) => validate("isNotEmpty", key, {}),
      validateValueFunc: (value) => validate("isNotEmpty", value, {}),
    },
    {
      label: "Query Parameters",
      fieldId: "customVariableConfig.webhook.queryParameters",
      fieldType: FieldType.ScriptEditor,
      dataType: DataType.Object,
      language: "yaml",
      updateButtonText: "Update Query Parameters",
      value: {},
      isRequired: false,
    },
    {
      label: "Include Config",
      fieldId: "customVariableConfig.webhook.includeConfig",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
  ]
  return items
}
