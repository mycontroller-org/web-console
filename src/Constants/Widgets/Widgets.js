export const WidgetType = {
  ChartsPanel: "widget_charts_panel",
  ControlPanel: "widget_control_panel",
  EmptyPanel: "widget_empty_panel",
  ImagePanel: "widget_image_panel",
  LightPanel: "widget_light_panel",
  UtilizationPanel: "widget_utilization_panel",
}

export const WidgetTypeOptions = [
  { value: WidgetType.ChartsPanel, label: "Charts Panel", description: "Displays data in charts" },
  { value: WidgetType.ControlPanel, label: "Control Panel", description: "Control actions on resources" },
  { value: WidgetType.EmptyPanel, label: "Empty Panel", description: "Empty Panel" },
  { value: WidgetType.ImagePanel, label: "Image Panel", description: "Displays image from different sources" },
  { value: WidgetType.LightPanel, label: "Light Panel", description: "Control a light" },
  {
    value: WidgetType.UtilizationPanel,
    label: "Utilization Panel",
    description: "Displays utilization status",
  },
]
