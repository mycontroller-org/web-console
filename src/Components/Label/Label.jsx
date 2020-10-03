import React from "react"
import { Label as PfLabel } from "@patternfly/react-core"
import "./Label.scss"
import { FlexItem, Flex } from "@patternfly/react-core"
import IFrame from "../IFrame/IFrame"

export const Label = ({ name, value, index = 0 }) => {
  return (
    <FlexItem key={name + index} className="mc-label">
      <span className="label-pair">
        <PfLabel className="label-key">{name}</PfLabel>
        {value && value.length > 0 && <PfLabel className="label-value">{value || ""}</PfLabel>}
      </span>
    </FlexItem>
  )
}

export const Labels = ({ data = {} }) => {
  const names = Object.keys(data)

  if (names.length === 0) {
    return <span>No labels</span>
  }

  names.sort()

  const elements = names.map((name, index) => {
    return <Label key={index} name={name} value={data[name]} index={index} />
  })
  return <Flex>{elements}</Flex>
}

export const KeyValue = ({ name, value, index = 0 }) => {
  let finalValue = ""
  switch (name) {
    case "node_web_url":
      finalValue = <IFrame url={value} />
      break
    default:
      finalValue = name === "password" ? "****" : value ? value.toString() : ""
  }
  return (
    <div className="key-value-map" key={name + index}>
      <span>{name}</span> {finalValue}
    </div>
  )
}

export const KeyValueMap = ({ data = {} }) => {
  const names = Object.keys(data)
  if (names.length === 0) {
    return <span>No data</span>
  }

  names.sort()

  const elements = names.map((name, index) => {
    return <KeyValue key={index} name={name} value={data[name]} index={index} />
  })
  return elements
}
