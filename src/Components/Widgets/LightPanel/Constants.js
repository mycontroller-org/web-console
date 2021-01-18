// light panel types
export const LightType = {
  Single: "light_single",
  CWWW: "light_cw_ww",
  RGB: "light_rgb",
  RGBCW: "light_rgbcw",
  RGBCWWW: "light_rgbcwww",
}

// light panel options
export const LightTypeOptions = [
  { value: LightType.Single, label: "Single", description: "Single, Cold White or Warm White" },
  { value: LightType.CWWW, label: "CW WW", description: "Cold White and Warm White" },
  { value: LightType.RGB, label: "RGB", description: "RGB light" },
  { value: LightType.RGBCW, label: "RGB CW", description: "RGB and Cold White" },
  { value: LightType.RGBCWWW, label: "RGB CW WW", description: "RGB, Cold White and Warm White" },
]

// RGB components
export const RGBComponentType = {
  ColorPickerQuick: "rgb_color_picker",
  HueSlider: "hue_slider",
}

// RGB component options
export const RGBComponentOptions = [
  {
    value: RGBComponentType.ColorPickerQuick,
    label: "Quick Color Picker",
    description: "Predefined colors",
  },
  { value: RGBComponentType.HueSlider, label: "Hue Slider", description: "Hue color slider" },
]
