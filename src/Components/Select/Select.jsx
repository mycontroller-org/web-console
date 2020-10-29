import React from "react"
import { Select as PfSelect, SelectOption, SelectVariant } from "@patternfly/react-core"
import PropTypes from "prop-types"

class Select extends React.Component {
  state = {
    isOpen: false,
    selected: this.props.defaultValue,
  }

  onChange = (selection) => {
    if (this.props.onSelectionFunc) {
      this.props.onSelectionFunc(selection)
    }
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      this.onChange(this.props.defaultValue)
    }
  }

  onSelect = (_event, selection) => {
    this.setState({ selected: selection, isOpen: false }, this.onChange(selection))
  }

  onToggle = (isOpen) => {
    this.setState({ isOpen })
  }

  render() {
    return (
      <div>
        <span id="select-title">{this.props.title}</span>
        <PfSelect
          variant={SelectVariant.single}
          placeholderText="Select an option"
          //aria-label="Select Input with descriptions"
          onToggle={this.onToggle}
          onSelect={this.onSelect}
          selections={this.state.selected}
          isOpen={this.state.isOpen}
          //aria-labelledby={titleId}
          isDisabled={this.props.disabled}
        >
          {this.props.options.map((option, index) => (
            <SelectOption
              isDisabled={option.disabled}
              key={index}
              value={option.value}
            >
              {option.display}
            </SelectOption>
          ))}
        </PfSelect>
      </div>
    )
  }
}

Select.propTypes = {
  title: PropTypes.string,
  options: PropTypes.array, // [{value: "abc", display:"ABC text", disabled: false}]
  defaultValue: PropTypes.string,
  onSelectionFunc: PropTypes.func,
  disabled: PropTypes.bool,
}

export default Select
