import {
  Checkbox,
  DatePicker,
  Divider,
  Form as PfForm,
  FormGroup,
  Grid,
  SelectVariant,
  Switch,
  TextArea,
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
import MixedControlListForm from "./Widget/MixedControlList"
import { getResourceDisplayValue, resourceUpdateButtonCallback } from "./ResourcePicker/ResourceUtils"
import {
  chartYAxisConfigUpdateButtonCallback,
  displayYAxisConfig,
} from "./Widget/ChartsPanel/ChartYAxisConfigMapUtils"
import MixedResourceConfigList from "./Widget/ChartsPanel/MixedResourceConfigList/MixedResourceConfigList"
import { getRandomId } from "../../Util/Util"

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
  const itemId = `${item.fieldId}_${getRandomId(5)}`
  switch (item.fieldType) {
    case FieldType.Text:
    case FieldType.Password:
      return (
        <TextInput
          id={itemId}
          type={item.fieldType}
          value={item.value}
          onChange={onChange}
          validated={item.validated}
          isDisabled={item.isDisabled}
        />
      )

    case FieldType.TextArea:
      return (
        <TextArea
          id={itemId}
          type={item.fieldType}
          value={item.value}
          onChange={onChange}
          validated={item.validated}
          isDisabled={item.isDisabled}
          resizeOrientation={"vertical"}
          rows={item.rows ? item.rows : 5}
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
              : (value) => {
                  return validate("isKey", value)
                }
          }
          validateValueFunc={item.validateValueFunc}
          valueField={item.valueField}
          updateButtonCallback={item.updateButtonCallback}
        />
      )

    case FieldType.VariablesMap:
      return (
        <KeyValueMapForm
          key={item.fieldId}
          keyValueMap={item.value}
          keyLabel={item.keyLabel}
          valueLabel={item.valueLabel}
          isKeyDisabled={item.isKeyDisabled}
          isValueDisabled={item.isValueDisabled}
          actionSpan={item.actionSpan}
          showUpdateButton={item.showUpdateButton}
          onChange={onChange}
          validateKeyFunc={
            item.validateKeyFunc
              ? item.validateKeyFunc
              : (key) => {
                  return validate("isVariableKey", key)
                }
          }
          valueField={getResourceDisplayValue}
          updateButtonCallback={(cbIndex, cbItem, cbOnChange) =>
            resourceUpdateButtonCallback(item.callerType, cbIndex, cbItem, cbOnChange)
          }
        />
      )

    case FieldType.ChartYAxisConfigMap:
      return (
        <KeyValueMapForm
          key={item.fieldId}
          keyValueMap={item.value}
          keyLabel={"Axis"}
          valueLabel={"Config"}
          isKeyDisabled={true}
          isValueDisabled={true}
          actionSpan={0}
          isActionDisabled={true}
          showUpdateButton={true}
          onChange={onChange}
          validateKeyFunc={null}
          forceSync={true}
          valueField={displayYAxisConfig}
          updateButtonCallback={chartYAxisConfigUpdateButtonCallback}
        />
      )

    case FieldType.MixedControlList:
      return (
        <MixedControlListForm
          key={item.fieldId}
          valuesList={item.value}
          valueLabel={item.valueLabel}
          onChange={onChange}
          validateValueFunc={
            item.validateValueFunc
              ? item.validateValueFunc
              : (value) => {
                  return validate("isObject", value)
                }
          }
        />
      )

    case FieldType.ChartMixedResourceConfig:
      return (
        <MixedResourceConfigList
          key={item.fieldId}
          valuesList={item.value}
          yAxisConfig={item.yAxisConfig}
          valueLabel={item.valueLabel}
          onChange={onChange}
          validateValueFunc={
            item.validateValueFunc
              ? item.validateValueFunc
              : (value) => {
                  return validate("isObject", value)
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
          direction={item.direction}
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
          placeholder={item.placeholder}
          className="mc-time-range-picker"
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
          direction={item.direction}
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
          disableClear={item.disableClear}
        />
      )

    case FieldType.Switch:
      return (
        <Switch
          id={itemId}
          aria-label={itemId}
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
          id={itemId}
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
          id={itemId}
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
