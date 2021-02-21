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
    this.setState({ isOpen: false }, () => {
      console.log("selected:", selectionLabel)
      if (this.props.onChange) {
        // get value with label
        const selectionValue = getValueByLabel(this.props.options, selectionLabel)
        this.props.onChange(selectionValue)
      }
    })
  }

  onCreateOption = (newValue) => {
    // TODO:
  }

  clearSelection = () => {
    this.setState({ isOpen: false }, () => {
      if (this.props.onChange) {
        this.props.onChange("")
      }
    })
  }

  render() {
    const { label, options, selected, isDisabled, isCreatable, variant, disableClear, hideDescription } = this.props
    const { isOpen } = this.state

    // get label with value
    const selectionLabel = getLabelByValue(this.props.options, selected)

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
        selections={selectionLabel}
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
