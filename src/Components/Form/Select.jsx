import { Select as PfSelect, SelectOption } from "@patternfly/react-core"
import React from "react"

class Select extends React.Component {
  state = {
    isOpen: false,
  }

  onToggle = (isOpen) => {
    this.setState({
      isOpen,
    })
  }

  onSelect = (_event, selectionLabel, _isPlaceholder) => {
    const { onChange, isMulti, options, selected } = this.props
    const isOpen = isMulti ? true : false
    this.setState({ isOpen: isOpen }, () => {
      if (onChange) {
        // get value with label
        const selectionValue = getValueByLabel(options, selectionLabel)
        let finalValue = selectionValue
        if (isMulti) {
          let all = selected.split(",")
          if (all.includes(selectionValue)) {
            all = all.filter((v) => v !== selectionValue)
          } else {
            all.push(selectionValue)
          }
          const uniqueValues = [...new Set(all)].filter((v) => v !== "")
          finalValue = uniqueValues.join(",")
        }
        onChange(finalValue)
      }
    })
  }

  onCreateOption = (_newValue) => {}

  clearSelection = () => {
    const { onChange } = this.props
    this.setState({ isOpen: false }, () => {
      if (onChange) {
        onChange("")
      }
    })
  }

  render() {
    const {
      label,
      options,
      selected,
      isDisabled,
      isCreatable,
      variant,
      disableClear,
      hideDescription,
    } = this.props
    const { isOpen } = this.state

    // get label with value
    let selections = []
    if (selected !== undefined && selected !== "") {
      selections = selected.split(",").map((s) => {
        return getLabelByValue(this.props.options, s)
      })
    }

    const selectOptions = options.map((option, index) => (
      <SelectOption
        isDisabled={option.disabled}
        key={index}
        value={option.label}
        {...(!hideDescription && option.description && { description: option.description })}
      />
    ))
    return (
      <PfSelect
        variant={variant}
        //typeAheadAriaLabel="Select a state"
        onToggle={this.onToggle}
        onSelect={this.onSelect}
        onClear={disableClear ? undefined : this.clearSelection}
        selections={selections}
        isOpen={isOpen}
        //aria-labelledby={titleId}
        placeholderText={label}
        isDisabled={isDisabled}
        isCreatable={isCreatable}
        //onCreateOption={(hasOnCreateOption && this.onCreateOption) || undefined}
      >
        {selectOptions}
      </PfSelect>
    )
  }
}

export default Select

// helper functions

const getValueByLabel = (items, label) => {
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    if (label === item.label) {
      return item.value
    }
  }
  return ""
}

const getLabelByValue = (items, value) => {
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    if (value === item.value) {
      return item.label
    }
  }
  return ""
}
