import {
  Checkbox,
  DatePicker,
  Divider,
  Form as PfForm,
  FormGroup,
  Grid,
  SelectVariant,
  Switch,
  TextInput,
  TimePicker,
} from "@patternfly/react-core"
import React from "react"
import KeyValueMapForm from "./KeyValueMapForm"
import { DataType, FieldType } from "../../Constants/Form"
import "./Form.scss"
import Select from "./Select"
import AsyncSelect from "../Select/AsyncSelect"
import { validate } from "../../Util/Validator"
import ThresholdsColorForm from "./ThresholdsColorForm"
import DynamicArrayForm from "./DynamicArrayForm"
import ConditionArrayMapForm from "./ConditionArrayForm"
import DateRangePicker from "./RangePicker/DateRangePicker"
import TimeRangePicker from "./RangePicker/TimeRangePicker"
import ToggleButtonGroup from "./ToggleButtonGroup/ToggleButtonGroup"
import ScriptEditor from "./ScriptEditor/ScriptEditor"
import SimpleSlider from "./Slider/Simple"
import ColorBox from "../Color/ColorBox/ColorBox"

// item sample
// const item = {
//   label: "Title",
//   fieldId: "abc.xyz",
//   fieldType: FieldType.Text,
//   dataType: DataType.String,
//   value: null,
//   fields: [],
//   isRequired: false,
//   helperText: "",
//   helperTextInvalid: "",
//   validated: "", //success, warning, error, default
//   resetFields: {},
// }

export const Form = ({ isHorizontal = false, isWidthLimited = true, items = [], onChange = () => {} }) => {
  const formGroups = []
  items.forEach((item, index) => {
    const onChangeWithItem = (data) => {
      onChange(item, data)
    }
    const field = getField(item, onChangeWithItem)
    const withGroup =
      item.fieldType !== FieldType.Divider
        ? wrapWithFormGroup(item, field, index)
        : wrapWithoutFormGroup(item, field, index)
    formGroups.push(withGroup)
  })

  const form = (
    <PfForm className="mc-form" isHorizontal={isHorizontal} isWidthLimited={false}>
      <Grid>{formGroups}</Grid>
    </PfForm>
  )
  if (isWidthLimited) {
    return (
      <Grid lg={7} md={9} sm={12}>
        {form}
      </Grid>
    )
  }
  return form
}

// helper functions

const getField = (item, onChange) => {
  switch (item.fieldType) {
    case FieldType.Text:
    case FieldType.Password:
    case FieldType.textArea:
      return (
        <TextInput
          id={item.fieldId}
          type={item.fieldType}
          value={item.value}
          onChange={onChange}
          validated={item.validated}
          isDisabled={item.isDisabled}
        />
      )

    case FieldType.Checkbox:
      return (
        <Checkbox
          isDisabled={item.isDisabled}
          label={item.fieldLabel}
          isChecked={item.value}
          onChange={onChange}
        ></Checkbox>
      )

    case FieldType.Labels:
      return (
        <KeyValueMapForm
          keyValueMap={item.value}
          keyLabel={item.keyLabel}
          valueLabel={item.valueLabel}
          actionSpan={item.actionSpan}
          onChange={onChange}
          validateKeyFunc={
            item.validateKeyFunc
              ? item.validateKeyFunc
              : (key) => {
                  return validate("isLabelKey", key)
                }
          }
        />
      )

    case FieldType.KeyValueMap:
      return (
        <KeyValueMapForm
          keyValueMap={item.value}
          keyLabel={item.keyLabel}
          valueLabel={item.valueLabel}
          onChange={onChange}
          actionSpan={item.actionSpan}
          showUpdateButton={item.showUpdateButton}
          validateKeyFunc={
            item.validateKeyFunc
              ? item.validateKeyFunc
              : (key) => {
                  return validate("isKey", key)
                }
          }
        />
      )

    case FieldType.VariablesMap:
      return (
        <KeyValueMapForm
          key={item.fieldId}
          keyValueMap={item.value}
          keyLabel={item.keyLabel}
          valueLabel={item.valueLabel}
          actionSpan={item.actionSpan}
          showUpdateButton={item.showUpdateButton}
          callerType={item.callerType}
          onChange={onChange}
          validateKeyFunc={
            item.validateKeyFunc
              ? item.validateKeyFunc
              : (key) => {
                  return validate("isVariableKey", key)
                }
          }
        />
      )

    case FieldType.ConditionsArrayMap:
      return (
        <ConditionArrayMapForm
          key={item.fieldId}
          conditionsArrayMap={item.value}
          keyLabel={item.keyLabel}
          conditionLabel={item.conditionLabel}
          valueLabel={item.valueLabel}
          onChange={onChange}
          validateKeyFunc={
            item.validateKeyFunc
              ? item.validateKeyFunc
              : (key) => {
                  return validate("isKey", key)
                }
          }
        />
      )

    case FieldType.DynamicArray:
      return (
        <DynamicArrayForm
          key={item.fieldId}
          valuesList={item.value}
          valueLabel={item.valueLabel}
          onChange={onChange}
          validateValueFunc={
            item.validateValueFunc
              ? item.validateValueFunc
              : (key) => {
                  return validate("isID", key)
                }
          }
        />
      )

    case FieldType.DatePicker:
      return (
        <DatePicker
          key={item.fieldId}
          value={item.value !== "" ? item.value : null}
          onChange={onChange}
          isDisabled={item.isDisabled}
        />
      )

    case FieldType.DateRangePicker:
      return (
        <DateRangePicker
          key={item.fieldId}
          value={item.value !== "" ? item.value : {}}
          onChange={onChange}
          validated={item.validated}
          isDisabled={item.isDisabled}
        />
      )

    case FieldType.TimePicker:
      return (
        <TimePicker
          key={item.fieldId}
          defaultTime={item.value}
          onChange={onChange}
          validated={item.validated}
          isDisabled={item.isDisabled}
          is24Hour
        />
      )

    case FieldType.TimeRangePicker:
      return (
        <TimeRangePicker
          key={item.fieldId}
          value={item.value !== "" ? item.value : {}}
          onChange={onChange}
          validated={item.validated}
          isDisabled={item.isDisabled}
          is24Hour
        />
      )

    case FieldType.ThresholdsColor:
      return <ThresholdsColorForm keyValueMap={item.value} onChange={onChange} />

    case FieldType.ColorBox:
      return (
        <ColorBox
          key={item.fieldId}
          colors={item.colors}
          color={item.value}
          onChange={onChange}
          isDisabled={item.isDisabled}
        />
      )

    case FieldType.Divider:
      return (
        <ul>
          <li>
            <span className="mc-form-header-label">{item.label}</span>
          </li>
          <Divider component="li" />
        </ul>
      )

    case FieldType.SelectTypeAhead:
      return (
        <Select
          variant={item.isMulti ? SelectVariant.typeaheadMulti : SelectVariant.typeahead}
          options={item.options}
          onChange={onChange}
          selected={item.value}
          isDisabled={item.isDisabled}
          isMulti={item.isMulti}
          isArrayData={item.dataType === DataType.ArrayString}
        />
      )

    case FieldType.SelectTypeAheadAsync:
      return (
        <AsyncSelect
          isDisabled={item.isDisabled}
          apiOptions={item.apiOptions}
          getFiltersFunc={item.getFiltersFunc}
          optionValueKey={item.optionValueKey}
          optionValueFunc={item.optionValueFunc}
          getOptionsDescriptionFunc={item.getOptionsDescriptionFunc}
          onSelectionFunc={onChange}
          selected={item.value}
        />
      )

    case FieldType.Select:
      return (
        <Select
          variant={SelectVariant.single}
          options={item.options}
          onChange={onChange}
          selected={item.value}
          isDisabled={item.isDisabled}
        />
      )

    case FieldType.Switch:
      return (
        <Switch
          id={item.fieldId}
          isDisabled={item.isDisabled}
          label={item.labelOn}
          labelOff={item.labelOff}
          isChecked={item.value}
          onChange={onChange}
        />
      )

    case FieldType.ToggleButtonGroup:
      return (
        <ToggleButtonGroup
          options={item.options}
          onSelectionFunc={onChange}
          selected={item.value}
          isDisabled={item.isDisabled}
        />
      )

    case FieldType.ScriptEditor:
      return (
        <ScriptEditor
          name={item.label}
          id={item.fieldId}
          language={item.language}
          minimapEnabled={item.minimapEnabled}
          options={item.options}
          onSaveFunc={onChange}
          saveButtonText={item.saveButtonText}
          updateButtonText={item.updateButtonText}
          value={item.value}
          isDisabled={item.isDisabled}
        />
      )

    case FieldType.SliderSimple:
      return (
        <SimpleSlider
          id={item.fieldId}
          min={item.min}
          max={item.max}
          step={item.step}
          value={item.value}
          onChange={onChange}
          isDisabled={item.isDisabled}
        />
      )

    default:
      return null
  }
}

const wrapWithFormGroup = (item, field, index) => {
  return (
    <FormGroup
      className="mc-form-group"
      hasNoPaddingTop={false}
      isRequired={item.isRequired}
      key={index}
      label={item.label}
      type={item.type}
      fieldId={item.fieldId}
      helperText={item.helperText}
      helperTextInvalid={item.helperTextInvalid}
      validated={item.validated}
      disabled={item.isDisabled}
    >
      {field}
    </FormGroup>
  )
}

const wrapWithoutFormGroup = (_item, field, index) => {
  return (
    <div key={index} className="mc-form-group-header">
      {field}
    </div>
  )
}
