import { SelectVariant, TextInput } from "@patternfly/react-core"
import objectPath from "object-path"
import React from "react"
import { v4 as uuidv4 } from "uuid"
import Editor from "../../../Components/Editor/Editor"
import Select from "../../../Components/Form/Select"
import Loading from "../../../Components/Loading/Loading"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { DataType, FieldType } from "../../../Constants/Form"
import { FieldDataType } from "../../../Constants/ResourcePicker"
import { DeviceTraitOptions, DeviceTypeOptions } from "../../../Constants/VirtualDevice"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { getValue } from "../../../Util/Util"
import { validate } from "../../../Util/Validator"
import VdResourcePicker from "./VdResourcePicker"

class UpdatePage extends React.Component {
  state = {
    loading: false,
  }

  componentDidMount() {}

  render() {
    const { loading } = this.state

    if (loading) {
      return <Loading key="loading" />
    }

    const { id } = this.props.match.params
    const { history, cancelFn = () => {}, t = (v) => v } = this.props

    const isNewEntry = id === undefined || id === ""

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.virtualDevice.get}
        apiSaveRecord={api.virtualDevice.update}
        minimapEnabled
        onSaveRedirectFunc={() => {
          if (id) {
            cancelFn()
          } else {
            r(history, rMap.resources.virtualDevice.list)
          }
        }}
        onCancelFunc={() => {
          if (id) {
            cancelFn()
          } else {
            r(history, rMap.resources.virtualDevice.list)
          }
        }}
        getFormItems={(rootObject) => getFormItems(rootObject, id, t)}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="add_a_virtual_device" />
          <PageContent hasNoPaddingTop>{editor} </PageContent>
        </>
      )
    }
    return editor
  }
}

export default UpdatePage

// support functions

const getFormItems = (rootObject, id, t) => {
  // set ID, if not set
  const newID = uuidv4().toString()
  objectPath.set(rootObject, "id", newID, true)

  objectPath.set(rootObject, "name", "", true)
  objectPath.set(rootObject, "description", "", true)
  objectPath.set(rootObject, "enabled", true, true)
  objectPath.set(rootObject, "traits", {}, true)
  objectPath.set(rootObject, "labels", {}, true)

  const items = [
    {
      label: "enabled",
      fieldId: "enabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
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
      validator: { isLength: { min: 2, max: 100 }, isID: {}, isNotEmpty: {} },
    },
    {
      label: "name",
      fieldId: "name",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_name",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "description",
      fieldId: "description",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "location",
      fieldId: "location",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "device_type",
      fieldId: "deviceType",
      isRequired: true,
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: DeviceTypeOptions,
      validated: "error",
      value: "",
    },
    {
      label: "traits",
      fieldId: "!traits",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "traits",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.Object,
      value: "",
      keyLabel: "trait",
      valueLabel: "resource",
      showUpdateButton: true,
      saveButtonText: "update",
      updateButtonText: "update",
      minimapEnabled: true,
      isRequired: false,
      validateKeyFunc: (key) => validate("isID", key),
      validateValueFunc: (value) => value.url !== undefined || value.url !== "",
      keyField: (index, key, onChange, _validated, isDisabled) =>
        getTraitValue(getValue(rootObject, "traits", {}), index, key, onChange, isDisabled, t),
      valueField: getResourceConfigDisplayValue,
      updateButtonCallback: callBackResourceConfigUpdateButtonCallback,
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
      value: "",
    },
  ]

  return items
}

// returns display value of value
export const getResourceConfigDisplayValue = (index, value, _onChange, validated, _isDisabled) => {
  let resourceData = null
  if (value === undefined || value === "") {
    resourceData = "undefined"
    validated = "error"
  } else if (value.type === FieldDataType.TypeResourceByQuickId) {
    resourceData = `${value.resourceType}: ${value.quickId}`
  } else if (value.type === FieldDataType.TypeResourceByLabels) {
    resourceData = `${value.resourceType}: ${JSON.stringify(value.labels)}`
  } else {
    resourceData = JSON.stringify(value)
  }

  return (
    <TextInput
      id={"value_id_" + index}
      key={"value_" + index}
      value={resourceData}
      isDisabled={true}
      validated={validated}
    />
  )
}

// calls the model to update the resource config details
export const callBackResourceConfigUpdateButtonCallback = (index = 0, item = {}, onChange) => {
  return <VdResourcePicker id={index} name={item.key} value={item.value} onChange={onChange} />
}

// returns display value of key
const getTraitValue = (traitsObject, index, selectedTrait, onChange, isDisabled, t) => {
  const traitDefined = Object.keys(traitsObject)
  const updatedDeviceTraitOptions = DeviceTraitOptions.filter((t) => {
    if (t.value === selectedTrait) {
      return true
    }
    for (let index = 0; index < traitDefined.length; index++) {
      if (traitDefined[index] === t.value) {
        return false
      }
    }
    return true
  })

  // update localization
  const localizationDeviceTraitOptions = updatedDeviceTraitOptions.map((dTrait) => {
    return {
      value: dTrait.value,
      label: t(dTrait.label),
      description: t(dTrait.description),
    }
  })

  return (
    <Select
      key={"key_" + index}
      variant={SelectVariant.typeahead}
      direction={"down"}
      options={localizationDeviceTraitOptions}
      onChange={onChange}
      selected={selectedTrait}
      isDisabled={isDisabled}
      isMulti={false}
      isArrayData={false}
    />
  )
}
