import React from "react"
import { Modal, ModalVariant } from "@patternfly/react-core"
import { DataType, FieldType } from "../Form/Constants"
import { WidgetType, WidgetTypeOptions } from "./Constants"
import Editor from "../Editor/Editor"
import { ResourceTypeOptions } from "../../config/globalConfig"
import objectPath from "object-path"
import { api } from "../../Service/Api"
import { LightTypeOptions, RGBComponentType, RGBComponentOptions, LightType } from "./LightPanel/Constants"

const EditWidget = ({ showEditWidget, widgetConfig, onCancel, onChange, onSave }) => {
  return (
    <Modal
      key="edit-widget"
      title="Edit widget settings"
      variant={ModalVariant.medium}
      position="top"
      isOpen={showEditWidget}
      onClose={onCancel}
      onEscapePress={onCancel}
    >
      <Editor
        key="editor"
        language="yaml"
        rootObject={widgetConfig}
        onChangeFunc={onChange}
        onSaveFunc={onSave}
        minimapEnabled={false}
        onCancelFunc={onCancel}
        isWidthLimited={false}
        getFormItems={getFormItems}
      />
    </Modal>
  )
}

export default EditWidget

// support functions

const getFormItems = (rootObject) => {
  const items = [
    {
      label: "Type",
      fieldId: "type",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: WidgetTypeOptions,
      isRequired: true,
      resetFields: { config: {} },
    },
    {
      label: "Title",
      fieldId: "title",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid title. chars: min=2 and max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Show Title",
      fieldId: "showTitle",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Is Static",
      fieldId: "static",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
  ]

  switch (rootObject.type) {
    case WidgetType.SwitchPanel:
      updateFormItemsSwitchPanel(rootObject, items)
      break

    case WidgetType.LightPanel:
      updateFormItemsLightPanel(rootObject, items)
      break

    case WidgetType.UtilizationPanel:
      updateFormItemsUtilizationPanel(rootObject, items)
      break

    default:
      break
  }

  return items
}

// Switch Panel items
const updateFormItemsSwitchPanel = (_rootObject, items) => {
  items.push(
    {
      label: "Labels",
      fieldId: "!labels",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "config.labels",
      fieldType: FieldType.Labels,
      dataType: DataType.Object,
      value: "",
    }
  )
}

// UtilizationPanel items
const updateFormItemsUtilizationPanel = (rootObject, items = []) => {
  // set defaults:
  // ....
  // ....
  items.push(
    {
      label: "Column Display",
      fieldId: "config.columnDisplay",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Resource",
      fieldId: "!labels",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "config.resourceType",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: ResourceTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Display Name",
      fieldId: "config.resourceDisplayName",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    }
  )

  if (objectPath.get(rootObject, "config.resourceDisplayName", false)) {
    items.push({
      label: "Name Key",
      fieldId: "config.resourceNameKey",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Name Key. chars: min=1 and max=100",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    })
  }

  items.push(
    {
      label: "Value Key",
      fieldId: "config.resourceValueKey",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Value Key. chars: min=1 and max=100",
      validated: "default",
      validator: { isLength: { min: 1, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Maximum Value",
      fieldId: "config.resourceMaximumValue",
      fieldType: FieldType.Text,
      dataType: DataType.Number,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Maximum Value.",
      validated: "default",
      validator: { isDecimal: { decimal_digits: 2 } },
    },
    {
      label: "Unit",
      fieldId: "config.resourceUnit",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Limit",
      fieldId: "config.itemsLimit",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Items limit.",
      validated: "default",
      validator: { isInteger: {} },
    },
    {
      label: "Selectors",
      fieldId: "!selectors",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "config.resourceSelectors",
      fieldType: FieldType.KeyValueMap,
      dataType: DataType.Object,
      value: "",
    },
    {
      label: "Thresholds",
      fieldId: "!thresholds",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "config.thresholds",
      fieldType: FieldType.ThresholdsColor,
      dataType: DataType.Object,
      value: "",
    }
  )
}

// Light Panel items
const updateFormItemsLightPanel = (rootObject, items) => {
  items.push({
    label: "Light Type",
    fieldId: "config.lightType",
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    value: "",
    options: LightTypeOptions,
    isRequired: true,
    validator: { isNotEmpty: {} },
    resetFields: { "config.fieldIds": {}, "config.rgbComponent": "" },
  })

  const lightType = objectPath.get(rootObject, "config.lightType", "")

  if (lightType === LightType.RGB || lightType === LightType.RGBCW || lightType === LightType.RGBCWWW) {
    items.push({
      label: "RGB Component",
      fieldId: "config.rgbComponent",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: RGBComponentOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
      resetFields: { "config.fieldIds.color": "", "config.fieldIds.hue": "" },
    })
  }

  items.push(
    {
      label: "Fields",
      fieldId: "!fields",
      fieldType: FieldType.Divider,
    },
    {
      label: "Power",
      fieldId: "config.fieldIds.power",
      fieldType: FieldType.SelectTypeAheadAsync,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
      apiOptions: api.sensorField.list,
      optionValueKey: "id",
      getFiltersFunc: (value) => {
        return [{ k: "name", o: "regex", v: value }]
      },
      getOptionsDescriptionFunc: (item) => {
        return item.nodeId + " >> " + item.sensorId + " >> " + item.fieldId + " >> " + item.name
      },
    },
    {
      label: "Dimmer",
      fieldId: "config.fieldIds.dimmer",
      fieldType: FieldType.SelectTypeAheadAsync,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
      apiOptions: api.sensorField.list,
      optionValueKey: "id",
      getFiltersFunc: (value) => {
        return [{ k: "name", o: "regex", v: value }]
      },
      getOptionsDescriptionFunc: (item) => {
        return item.nodeId + " >> " + item.sensorId + " >> " + item.fieldId + " >> " + item.name
      },
    }
  )

  // update CW, WW and RGB components
  if (lightType === LightType.CWWW || lightType === LightType.RGBCW || lightType === LightType.RGBCWWW) {
    items.push({
      label: "Color Temperature",
      fieldId: "config.fieldIds.colorTemperature",
      fieldType: FieldType.SelectTypeAheadAsync,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      validator: { isNotEmpty: {} },
      apiOptions: api.sensorField.list,
      optionValueKey: "id",
      getFiltersFunc: (value) => {
        return [{ k: "name", o: "regex", v: value }]
      },
      getOptionsDescriptionFunc: (item) => {
        return item.nodeId + " >> " + item.sensorId + " >> " + item.fieldId + " >> " + item.name
      },
    })
  }

  if (lightType === LightType.RGBCW || lightType === LightType.RGBCWWW) {
    const rgbComponent = objectPath.get(rootObject, "config.rgbComponent", "")
    const label = rgbComponent === RGBComponentType.ColorPickerQuick ? "RGB" : "Hue"
    const fieldId =
      rgbComponent === RGBComponentType.ColorPickerQuick ? "config.fieldIds.rgb" : "config.fieldIds.hue"

    if (rgbComponent !== "") {
      items.push({
        label: label,
        fieldId: fieldId,
        fieldType: FieldType.SelectTypeAheadAsync,
        dataType: DataType.String,
        value: "",
        isRequired: true,
        validator: { isNotEmpty: {} },
        apiOptions: api.sensorField.list,
        optionValueKey: "id",
        getFiltersFunc: (value) => {
          return [{ k: "name", o: "regex", v: value }]
        },
        getOptionsDescriptionFunc: (item) => {
          return item.nodeId + " >> " + item.sensorId + " >> " + item.fieldId + " >> " + item.name
        },
      })
    }
  }
}
