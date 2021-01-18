import React from "react"
import { HuePicker } from "react-color"
import "./HueSlider.scss"

const HueSlider = ({ hue = 230, onChange = () => {} }) => {
  const color = { h: hue, s: 0, l: 0.1 }
  return (
    <HuePicker
      className="mc-hue-slider"
      key="hue-picker"
      color={color}
      onChangeComplete={(newColor) => {
        onChange(newColor.hsl.h)
      }}
    />
  )
}

export default HueSlider
