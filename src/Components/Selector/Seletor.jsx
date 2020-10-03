import React from "react"
import { Divider, Dropdown, DropdownItem, DropdownToggle } from "@patternfly/react-core"
import {
  CaretDownIcon,
  OutlinedBookmarkIcon,
  BookmarkIcon,
} from "@patternfly/react-icons"
import "./Selector.scss"

// Sample data
// {
//   id: "abc",
//   text: "xyz",
//   bookmarked: true,
//   disabled: false,
// }
class Selector extends React.Component {
  state = {
    items: [
      {
        id: "1",
        text: "hello sssssssssssssssssssss",
        bookmarked: false,
        disabled: false,
      },
      {
        id: "2",
        text: "I am 2",
        bookmarked: false,
        disabled: false,
      },
      {
        id: "3",
        text: "I am 3",
        bookmarked: false,
        disabled: false,
      },
      {
        id: "4",
        text: "I am 4",
        bookmarked: true,
        disabled: false,
      },
    ],
    selected: { text: "123" },
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
    const elements = []
    // update marked and unmarked items
    const itemMarked = []
    const itemUnMarked = []
    this.state.items.forEach((item) => {
      if (item.bookmarked) {
        itemMarked.push(getItem(item, this.onSelect, this.onBookmarkChange))
      } else {
        itemUnMarked.push(getItem(item, this.onSelect, this.onBookmarkChange))
      }
    })

    // update all
    if (itemMarked.length > 0) {
      elements.push(...itemMarked)
    }
    if (itemMarked.length > 0 && itemUnMarked.length > 0) {
      elements.push(<Divider key="divider" component="li" />)
    }
    elements.push(...itemUnMarked)

    const title = this.props.prefix ? (
      <span style={{ fontSize: "18px", color: "gray", marginRight: "5px", fontWeight: "bold" }}>
        {this.props.prefix}:
      </span>
    ) : null
    return (
      <Dropdown
        className="rb-selector"
        isPlain
        toggle={
          <DropdownToggle id="selector-toggle-id" onToggle={this.onToggle} toggleIndicator={CaretDownIcon}>
            {title}
            <span style={{ fontSize: "18px" }}>{this.state.selected.text}</span>
          </DropdownToggle>
        }
        isOpen={this.state.isOpen}
        dropdownItems={elements}
      />
    )
  }
}

const getItem = (item, onSelectFn, onBookmarkChangeFn) => {
  const Icon = item.bookmarked ? BookmarkIcon : OutlinedBookmarkIcon
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

export default Selector
