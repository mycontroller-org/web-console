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

class DynamicArrayForm extends React.Component {
  state = {
    items: [],
  }

  updateItems = () => {
    const { valuesList } = this.props
    if (!valuesList) {
      return
    }

    let valuesReceived = [...valuesList]

    this.setState((prevState) => {
      const { items } = prevState

      for (let index = 0; index < items.length; index++) {
        const item = items[index]
        if (valuesReceived.includes(item)) {
          const valueIndex = valuesReceived.indexOf(item)
          valuesReceived.splice(valueIndex, 1)
        }
      }

      if (valuesReceived.length !== 0) {
        return { items: valuesList }
      } else {
        return { items: items }
      }
    })
  }

  componentDidMount() {
    this.updateItems()
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.valuesList, prevProps.valuesList)) {
      this.updateItems()
    }
  }

  callParentOnChange = (items) => {
    const { onChange } = this.props
    if (onChange) {
      onChange(items)
    }
  }

  onChange = (index, newValue) => {
    this.setState((prevState) => {
      const { items } = prevState
      items[index] = newValue
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
      items.push("")
      return { items: items }
    })
  }

  render() {
    const { items } = this.state
    const { validateValueFunc, valueLabel } = this.props
    const values = []

    const formItems = items.map((item, index) => {
      let isValidValue = true
      if (validateValueFunc) {
        isValidValue = validateValueFunc(item)
      }

      // verify duplicate value
      if (values.includes(item)) {
        isValidValue = false
      }

      const validatedValue = isValidValue ? "default" : "error"

      // add the item into local map for next iteration
      values.push(item)

      const addButton =
        items.length === index + 1 ? (
          <AddCircleOIcon key={"add-btn" + index} onClick={this.onAdd} className="btn-add icon-btn" />
        ) : null
      return (
        <>
          <GridItem span={10}>
            <TextInput
              id={"value_" + index}
              value={item}
              validated={validatedValue}
              onChange={(newValue) => {
                this.onChange(index, newValue)
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
        <GridItem span={10}>
          <Text component={TextVariants.h4}>{valueLabel ? valueLabel : ""}</Text>
        </GridItem>
        <GridItem span={2}></GridItem>
        {formItems}
      </Grid>
    )
  }
}

DynamicArrayForm.propTypes = {
  valueLabel: PropTypes.string,
  valuesList: PropTypes.array,
  validateValueFunc: PropTypes.func,
}

export default DynamicArrayForm
