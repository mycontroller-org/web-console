import { Checkbox, Form as PfForm, FormGroup, TextInput } from "@patternfly/react-core"
import React from "react"
import LabelsForm from "./LabelsForm"
import { DataType, FieldType } from "./Constants"

const item = {
  label: "Title",
  fieldId: "abc.xyz",
  fieldType: FieldType.text,
  dataType: DataType.string,
  value: null,
  fields: [],
  isRequired: false,
  helperText: "",
  helperTextInvalid: "",
  validated: "", //success, warning, error, default
}

export const Form = ({ isHorizontal = false, isWidthLimited = false, items = [], onChange = () => {} }) => {
  const formGroups = []
  items.forEach((item, index) => {
    const onChangeWithItem = (data) => {
      onChange(item, data)
    }
    const field = getField(item, onChangeWithItem)
    const withGroup = wrapWithFormGroup(item, field, index)
    formGroups.push(withGroup)
  })
  return (
    <PfForm isHorizontal={isHorizontal} isWidthLimited={isWidthLimited}>
      {formGroups}
    </PfForm>
  )
}

// helper functions

const getField = (item, onChange) => {
  switch (item.fieldType) {
    case FieldType.text:
    case FieldType.password:
    case FieldType.textArea:
      return (
        <TextInput
          id={item.fieldId}
          type={item.fieldType}
          value={item.value}
          onChange={onChange}
          validated={item.validated}
        />
      )

    case FieldType.checkbox:
      return <Checkbox label={item.fieldLabel}></Checkbox>

    case FieldType.labels:
      return <LabelsForm labels={item.value} onChange={onChange} />
  }
}

const wrapWithFormGroup = (item, field, index) => {
  return (
    <FormGroup
      hasNoPaddingTop
      isRequired={item.isRequired}
      key={index}
      label={item.label}
      type={item.type}
      fieldId={item.fieldId}
      helperText={item.helperText}
      helperTextInvalid={item.helperTextInvalid}
      validated={item.validated}
    >
      {field}
    </FormGroup>
  )
}
