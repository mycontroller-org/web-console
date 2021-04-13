export const WidgetType = {
  EmptyPanel: "widget_empty_panel",
  ControlPanel: "widget_control_panel",
  LightPanel: "widget_light_panel",
  UtilizationPanel: "widget_utilization_panel",
}

export const WidgetTypeOptions = [
  { value: WidgetType.EmptyPanel, label: "Empty Panel", description: "Empty Panel" },
  { value: WidgetType.ControlPanel, label: "Control Panel", description: "Control actions on resources" },
  { value: WidgetType.LightPanel, label: "Light Panel", description: "Control a light" },
  {
    value: WidgetType.UtilizationPanel,
    label: "Utilization Panel",
    description: "Displays utilization status",
  },
]
