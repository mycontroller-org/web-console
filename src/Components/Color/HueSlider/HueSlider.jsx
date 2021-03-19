import { Badge, Split, SplitItem } from "@patternfly/react-core"
import React from "react"
import { HuePicker } from "react-color"
import "./HueSlider.scss"

const HueSlider = ({ hue = 230, onChange = () => {}, className = "" }) => {
  const color = { h: hue, s: 0, l: 0.1 }
  return (
    <Split className="mc-hue-slider">
      <SplitItem isFilled className={`slider ${className}`}>
        <HuePicker
          className="slider"
          key="hue-picker"
          color={color}
          onChangeComplete={(newColor) => {
            onChange(newColor.hsl.h)
          }}
        />
      </SplitItem>
      <SplitItem className="badge">
        <Badge key={1}>{color.h}</Badge>
      </SplitItem>
    </Split>
  )
}

export default HueSlider
