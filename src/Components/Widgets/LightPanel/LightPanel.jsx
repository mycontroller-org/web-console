import React from "react"

import { api } from "../../../Service/Api"
import Slider, { createSliderWithTooltip } from "rc-slider"
import "rc-slider/assets/index.css"
import "./LightPanel.scss"
import { Grid, GridItem, Stack, Switch, Tooltip } from "@patternfly/react-core"
import ColorBox from "../../Color/ColorBox/ColorBox"
import objectPath from "object-path"
import { ColorsSetBig } from "../../../Constants/Widgets/Color"
import Loading from "../../Loading/Loading"
import HueSlider from "../../Color/HueSlider/HueSlider"
import { LightType, RGBComponentType } from "../../../Constants/Widgets/LightPanel"
import { AdjustIcon, PaletteIcon, PowerOffIcon, TemperatureLowIcon } from "@patternfly/react-icons"
import { getValue } from "../../../Util/Util"

const SliderWithTooltip = createSliderWithTooltip(Slider)

class LightPanel extends React.Component {
  state = {
    loading: true,
    resources: {},
    power: false,
    dimmer: 0,
    colorTemperature: 350,
    rgb: "black",
    hue: 230,
  }

  updateComponents = () => {
    const { fieldIds } = this.props.config
    const fieldIdKeys = Object.keys(fieldIds)
    const fieldIdNameMap = {}
    const ids = []

    fieldIdKeys.forEach((fieldType) => {
      const id = fieldIds[fieldType]
      if (id !== "") {
        ids.push(id) // add id
        fieldIdNameMap[id] = fieldType
      }
    })
    const filters = [{ k: "id", o: "in", v: ids }]

    api.sensorField
      .list({ filter: filters })
      .then((res) => {
        // values
        const values = {}
        const resources = {}
        res.data.data.forEach((field) => {
          let value = objectPath.get(field, "current.value", "")

          const fieldName = fieldIdNameMap[field.id]
          switch (fieldName) {
            case "dimmer":
            case "colorTemperature":
              values[fieldName] = Number(value)
              break

            case "hue":
              values[fieldName] = Number(value)
              break

            case "rgb":
              if (!value.startsWith("#")) {
                value = "#" + value
              }
              if (value.length > 7) {
                value = value.substring(0, 7)
              }
              values[fieldName] = value
              break

            default:
              values[fieldName] = value
          }

          resources[fieldName] = {
            id: field.id,
            label: field.name,
            value: value,
            quickId:
              "sf:" + field.gatewayId + "." + field.nodeId + "." + field.sensorId + "." + field.fieldId,
          }
        })
        this.setState({ loading: false, resources, ...values })
      })
      .catch((_e) => {
        console.log("error", _e)
        this.setState({ loading: false })
      })
  }

  componentDidMount() {
    this.updateComponents()
  }

  onChange = (fieldName, newValue) => {
    console.log(fieldName, newValue)
    const data = {}
    data[fieldName] = newValue
    this.setState((prevState) => {
      const field = objectPath.get(prevState, "resources." + fieldName, undefined)

      if (field) {
        api.action.send({ resource: field.quickId, payload: newValue })
      }
      return { ...data }
    })
  }
  render() {
    const { power, dimmer, colorTemperature, rgb, hue, resources, loading } = this.state
    const { lightType, rgbComponent } = this.props.config

    if (loading) {
      return <Loading />
    }

    const fieldItems = []

    // add power switch
    fieldItems.push(
      <WrapItem
        key={"power-switch"}
        Icon={PowerOffIcon}
        iconTooltip="Power"
        field={
          <Switch
            id={"rgb-panel-power-" + getValue(resources, "power.id", "id")}
            onChange={(newState) => this.onChange("power", newState)}
            isChecked={power}
          />
        }
      />
    )

    // add dimmer
    fieldItems.push(
      <WrapItem
        key={"dimmer"}
        Icon={AdjustIcon}
        iconTooltip="Brightness"
        field={
          <SliderWithTooltip
            className="slider-brightness"
            defaultValue={dimmer}
            handleStyle={{ borderColor: "gray" }}
            trackStyle={{ backgroundColor: "#2b9af3" }}
            onAfterChange={(newValue) => this.onChange("dimmer", newValue)}
          />
        }
      />
    )

    // add cw, ww color temperature
    if (lightType === LightType.CWWW || lightType === LightType.RGBCWWW || lightType === LightType.RGBCW) {
      fieldItems.push(
        <WrapItem
          key="color-temp"
          Icon={TemperatureLowIcon}
          iconTooltip="Color Temperature"
          field={
            <SliderWithTooltip
              className="slider-color-temperature"
              defaultValue={colorTemperature}
              handleStyle={{ borderColor: "gray" }}
              trackStyle={{ backgroundColor: "#2b9af3" }}
              min={153}
              max={500}
              onAfterChange={(newValue) => this.onChange("colorTemperature", newValue)}
            />
          }
        />
      )
    }

    // add RGB color selector
    if (lightType === LightType.RGB || lightType === LightType.RGBCW || lightType === LightType.RGBCWWW) {
      if (rgbComponent === RGBComponentType.ColorPickerQuick) {
        fieldItems.push(
          <WrapItem
            key="color"
            Icon={PaletteIcon}
            iconTooltip="RGB Color"
            field={
              <ColorBox
                onChange={(newColor) => this.onChange("rgb", newColor)}
                colors={ColorsSetBig}
                color={rgb}
              />
            }
          />
        )
      } else if (rgbComponent === RGBComponentType.HueSlider) {
        fieldItems.push(
          <WrapItem
            key="color"
            Icon={PaletteIcon}
            iconTooltip="HUE Color"
            field={
              <HueSlider
                onChange={(newHue) => {
                  this.onChange("hue", Math.round(newHue))
                }}
                hue={hue}
              />
            }
          />
        )
      }
    }

    return (
      <div className="mc-rgb-light-panel">
        <Stack hasGutter className="component">
          {fieldItems}
        </Stack>
      </div>
    )
  }
}

export default LightPanel

// helper functions

const WrapItem = ({ Icon, iconTooltip, field }) => {
  return (
    <Grid>
      <GridItem span={1}>
        <Tooltip key="tooltip" content={iconTooltip} position="auto">
          <Icon size="md" />
        </Tooltip>
      </GridItem>
      <GridItem span={11} className="field">
        {field}
      </GridItem>
    </Grid>
  )
}
