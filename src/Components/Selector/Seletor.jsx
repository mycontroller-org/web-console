import { Divider, Dropdown, DropdownItem, DropdownToggle } from "@patternfly/react-core"
import { CaretDownIcon, MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons"
import React from "react"
import "./Selector.scss"

import PropTypes from "prop-types"

// Sample data
// {
//   id: "abc",
//   text: "xyz",
//   bookmarked: true,
//   disabled: false,
// }
class Selector extends React.Component {
  state = {
    isOpen: false,
  }

  onToggle = (isOpen) => {
    this.setState({ isOpen })
  }
  onFocus = () => {
    const element = document.getElementById("selector-toggle-id")
    element.focus()
  }

  onSelect = (item) => {
    // do local update
    this.setState({
      isOpen: !this.state.isOpen,
      selected: item,
    })
    // notify to parent
    if (this.props.onChange) {
      this.props.onChange(item)
    }
  }

  onBookmarkChange = (item) => {
    this.setState((prevState) => {
      const items = prevState.items
      for (let index = 0; index < items.length; index++) {
        if (item.id === items[index].id) {
          items[index].bookmarked = !item.bookmarked
          break
        }
      }
      return { items: items }
    })
    // update to server
  }

  componentDidMount() {
    // fetch from the given api
  }

  render() {
    const { items, selection, isDisabled, prefix } = this.props

    const elements = []
    // update marked and unmarked items
    const itemMarked = []
    const itemUnMarked = []
    if (items) {
      items.forEach((item) => {
        if (item.bookmarked) {
          itemMarked.push(getItem(item, this.onSelect, this.onBookmarkChange))
        } else {
          itemUnMarked.push(getItem(item, this.onSelect, this.onBookmarkChange))
        }
      })
    }

    // update all
    if (itemMarked.length > 0) {
      elements.push(...itemMarked)
    }
    if (itemMarked.length > 0 && itemUnMarked.length > 0) {
      elements.push(<Divider key="divider" component="li" />)
    }
    elements.push(...itemUnMarked)

    const title = prefix ? <span className="rb-selector-title">{prefix}:&nbsp;</span> : null
    return (
      <Dropdown
        className="rb-selector"
        isPlain
        disabled={isDisabled}
        toggle={
          <DropdownToggle
            id="selector-toggle-id"
            isDisabled={isDisabled}
            onToggle={this.onToggle}
            toggleIndicator={CaretDownIcon}
          >
            {title}
            <span>{selection.text}</span>
          </DropdownToggle>
        }
        isOpen={this.state.isOpen}
        dropdownItems={elements}
      />
    )
  }
}

Selector.propTypes = {
  items: PropTypes.array,
  selected: PropTypes.object,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
}

export default Selector

// helper functions

const getItem = (item, onSelectFn, onBookmarkChangeFn) => {
  const Icon = item.bookmarked ? MinusCircleIcon : PlusCircleIcon
  return (
    <DropdownItem key={item.id} className="rb-selector-dropdown">
      <div className="rb-selector-bookmark" onClick={() => onBookmarkChangeFn(item)}>
        <Icon />
      </div>
      <div className="rb-selector-item" onClick={() => onSelectFn(item)}>
        {item.text}
      </div>
    </DropdownItem>
  )
}
