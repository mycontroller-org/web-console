import {
  Bullseye,
  Button,
  Grid,
  GridItem,
  Split,
  Text,
  TextInput,
  TextVariants,
} from "@patternfly/react-core"
import { AddCircleOIcon, MinusCircleIcon } from "@patternfly/react-icons"
import React from "react"
import "./Form.scss"
import _ from "lodash"
import PropTypes from "prop-types"

class KeyValueMapForm extends React.Component {
  state = {
    items: [],
  }

  updateItems = () => {
    const { keyValueMap } = this.props

    if (!keyValueMap) {
      return
    }

    this.setState((prevState) => {
      const { items } = prevState
      let keys = Object.keys(keyValueMap)

      let isEqual = true

      for (let index = 0; index < items.length; index++) {
        const item = items[index]
        if (keys.includes(item.key)) {
          items[index].value = keyValueMap[item.key]
          const keyIndex = keys.indexOf(item.key)
          keys.splice(keyIndex, 1)
        }
      }

      if (keys.length !== 0) {
        isEqual = false
      }

      if (!isEqual) {
        keys = Object.keys(keyValueMap) // reload all the keys
        const newItems = keys.map((key) => {
          return { key, value: keyValueMap[key] }
        })
        return { items: newItems }
      } else {
        return { items: items }
      }
    })
  }

  componentDidMount() {
    this.updateItems()
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.keyValueMap, prevProps.keyValueMap)) {
      this.updateItems()
    }
  }

  callParentOnChange = (items) => {
    const { onChange } = this.props
    if (onChange) {
      // convert to key values
      const keyValueMap = {}
      const keys = []
      for (let index = 0; index < items.length; index++) {
        const item = items[index]
        const key = item.key
        if (!keys.includes(key)) {
          keyValueMap[item.key] = item.value
        }
        keys.push(key)
      }
      onChange(keyValueMap)
    }
  }

  onChange = (index, type, newValue) => {
    this.setState((prevState) => {
      const { items } = prevState
      items[index][type] = newValue
      this.callParentOnChange(items)
      return { items: items }
    })
  }

  onDelete = (index) => {
    this.setState((prevState) => {
      const { items } = prevState
      items.splice(index, 1)
      this.callParentOnChange(items)
      return { items: items }
    })
  }

  onAdd = () => {
    this.setState((prevState) => {
      const { items } = prevState
      items.push({ key: "", value: "" })
      return { items: items }
    })
  }

  render() {
    const { items } = this.state
    const { validateKeyFunc, validateValueFunc } = this.props
    const keys = []

    const formItems = items.map((item, index) => {
      let isValidKey = true
      if (validateKeyFunc) {
        isValidKey = validateKeyFunc(item.key)
      }

      let isValidValue = true
      if (validateValueFunc) {
        isValidValue = validateValueFunc(item.key)
      }
      const validatedValue = isValidValue ? "default" : "error"

      // verify duplicate key
      const isDuplicateKey = keys.includes(item.key)
      if (isDuplicateKey) {
        isValidKey = false
      }
      const validatedKey = isValidKey ? "default" : "error"

      // add the key into local map for next iteration
      keys.push(item.key)

      const addButton =
        items.length === index + 1 ? (
          <AddCircleOIcon key={"add-btn" + index} onClick={this.onAdd} className="btn-add icon-btn" />
        ) : null
      return (
        <>
          <GridItem span={5}>
            <TextInput
              id={"key_" + index}
              value={item.key}
              validated={validatedKey}
              onChange={(newValue) => {
                this.onChange(index, "key", newValue)
              }}
            />
          </GridItem>

          <GridItem span={5}>
            <TextInput
              id={"value_" + index}
              value={item.value}
              validated={validatedValue}
              onChange={(newValue) => {
                this.onChange(index, "value", newValue)
              }}
            />
          </GridItem>
          <GridItem span={2}>
            <Bullseye className="btn-layout">
              <Split hasGutter>
                <MinusCircleIcon
                  key={"btn-remove-" + index}
                  onClick={() => this.onDelete(index)}
                  className="btn-remove icon-btn"
                />
                {addButton}
              </Split>
            </Bullseye>
          </GridItem>
        </>
      )
    })

    if (!items || items.length === 0) {
      formItems.push(
        <Button key="btn-add-an-item" variant="secondary" onClick={this.onAdd}>
          Add an item
        </Button>
      )
    }

    return (
      <Grid className="mc-key-value-map-items">
        <GridItem span={5}>
          <Text component={TextVariants.h4}>Key</Text>
        </GridItem>

        <GridItem span={5}>
          <Text component={TextVariants.h4}>Value</Text>
        </GridItem>
        <GridItem span={2}></GridItem>

        {formItems}
      </Grid>
    )
  }
}

KeyValueMapForm.propTypes = {
  keyValueMap: PropTypes.object,
  validateKeyFunc: PropTypes.func,
  validateValueFunc: PropTypes.func,
}

export default KeyValueMapForm