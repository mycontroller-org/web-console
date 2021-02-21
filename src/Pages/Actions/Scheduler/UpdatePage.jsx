import objectPath from "object-path"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Components/Form/Constants"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import {
  Dampening,
  DampeningOptions,
  HandlerType,
  WeekDayOptions,
  ScheduleFrequency,
  ScheduleFrequencyOptions,
  ScheduleType,
  ScheduleTypeOptions,
} from "../../Constants"

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
          r(this.props.history, rMap.actions.scheduler.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.actions.scheduler.list)
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
    },
    {
      label: "Validity",
      fieldId: "!validity",
      fieldType: FieldType.Divider,
    },
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
    },
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
    },
  ]

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
    case ScheduleType.Moonrise:
    case ScheduleType.Moonset:
      updateSimpleJob(rootObject, items)
      break

    default:
  }

  // add notify handlers
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

const updateSimpleJob = (rootObject, items = []) => {
  items.push({
    label: "Frequency",
    fieldId: "spec.frequency",
    isRequired: true,
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    options: ScheduleFrequencyOptions,
    value: "",
    //resetFields: { spec: {} },
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
        multi: true,
        value: [],
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

    default:
  }

  const scheduleType = objectPath.get(rootObject, "type", "")

  if (scheduleType === ScheduleType.Simple) {
    items.push({
      label: "Time",
      fieldId: "spec.time",
      fieldType: FieldType.TimePicker,
      dataType: DataType.String,
      value: "",
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
