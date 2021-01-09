import {
  Checkbox,
  Divider,
  Form as PfForm,
  FormGroup,
  Grid,
  SelectVariant,
  Switch,
  TextInput,
} from "@patternfly/react-core"
import React from "react"
import LabelsForm from "./LabelsForm"
import { FieldType } from "./Constants"
import "./Form.scss"
import Select from "./Select"

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
// }

export const Form = ({
  isHorizontal = false,
  withGrid = false,
  isWidthLimited = false,
  items = [],
  onChange = () => {},
}) => {
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
    <PfForm className="mc-form" isHorizontal={isHorizontal} isWidthLimited={isWidthLimited}>
      <Grid>{formGroups}</Grid>
    </PfForm>
  )
  if (withGrid) {
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
      return <LabelsForm labels={item.value} onChange={onChange} />

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
          variant={SelectVariant.typeahead}
          options={item.options}
          onChange={onChange}
          selected={item.value}
          isDisabled={item.isDisabled}
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
          isDisabled={item.isDisabled}
          label={item.labelOn}
          labelOff={item.labelOff}
          isChecked={item.value}
          onChange={onChange}
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
