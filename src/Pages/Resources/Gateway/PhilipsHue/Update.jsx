import objectPath from "object-path"
import { DataType, FieldType } from "../../../../Constants/Form"

// get PhilipsHue Items
export const getPhilipsHueItems = (rootObject) => {
  objectPath.set(rootObject, "provider.syncInterval", "15m", true)
  const items = [
    {
      label: "Configuration",
      fieldId: "!provider.configuration",
      fieldType: FieldType.Divider,
    },
    {
      label: "Bridge",
      fieldId: "provider.host",
      isRequired: true,
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      validator: {
        isURL: {
          protocols: ["http", "https"],
        },
      },
      helperTextInvalid: "Invalid Bridge URL.",
    },
    {
      label: "Username",
      fieldId: "provider.username",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid username. chars: min=2 and max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Sync Interval",
      fieldId: "provider.syncInterval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
  ]
  return items
}
