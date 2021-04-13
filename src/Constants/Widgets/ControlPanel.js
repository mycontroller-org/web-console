// control panel types
export const ControlType = {
  SwitchToggle: "switch_toggle",
  SwitchButton: "switch_button",
  MixedControl: "mixed_control",
}

// utilization panel type options
export const ControlTypeOptions = [
  { value: ControlType.SwitchToggle, label: "Toggle Switch" },
  { value: ControlType.SwitchButton, label: "Button Switch" },
  { value: ControlType.MixedControl, label: "Mixed Control" },
]

// switch panel button types
export const ButtonType = {
  Primary: "primary",
  Secondary: "secondary",
  Warning: "warning",
  Danger: "danger",
}

// switch panel button type options
export const ButtonTypeOptions = [
  { value: ButtonType.Primary, label: "Primary (blue)" },
  { value: ButtonType.Secondary, label: "Secondary (blue)" },
  { value: ButtonType.Warning, label: "Warning (yellow)" },
  { value: ButtonType.Danger, label: "Danger (red)" },
]

// mixed control types
export const MixedControlType = {
  ToggleSwitch: "switch_toggle",
  ButtonSwitch: "switch_button",
  PushButton: "button_push",
  SelectOptions: "options_select",
  TabOptions: "options_tab",
  Input: "input",
}

// mixed control type options
export const MixedControlTypeOptions = [
  { value: MixedControlType.ToggleSwitch, label: "Toggle Switch" },
  { value: MixedControlType.ButtonSwitch, label: "Button Switch" },
  { value: MixedControlType.PushButton, label: "Push Button" },
  { value: MixedControlType.SelectOptions, label: "Select Options" },
  { value: MixedControlType.TabOptions, label: "Tab Options" },
  { value: MixedControlType.Input, label: "Input" },
]
