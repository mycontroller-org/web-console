import { DataType, FieldType } from "../../Form/Constants"

// Switch Panel items
export const updateFormItemsSwitchPanel = (_rootObject, items) => {
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