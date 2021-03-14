import { DataType, FieldType } from "../../../Constants/Form"
import {
  LightTypeOptions,
  RGBComponentType,
  RGBComponentOptions,
  LightType,
} from "../../../Constants/Widgets/LightPanel"
import objectPath from "object-path"
import { api } from "../../../Service/Api"

// Light Panel items
export const updateFormItemsLightPanel = (rootObject, items) => {
  items.push(
    {
      label: "Light",
      fieldId: "!light",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "config.lightType",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      options: LightTypeOptions,
      isRequired: true,
      validator: { isNotEmpty: {} },
      resetFields: { "config.fieldIds": {}, "config.rgbComponent": "" },
    }
  )

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
