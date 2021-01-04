import {
  Bullseye,
  Button,
  Flex,
  Grid,
  GridItem,
  Split,
  Text,
  TextInput,
  TextVariants,
} from "@patternfly/react-core"
import { AddCircleOIcon, MinusCircleIcon } from "@patternfly/react-icons"
import React from "react"
import "./LabelsForm.scss"

class LabelsForm extends React.Component {
  state = {
    labels: [],
  }

  componentDidMount() {
    const keys = Object.keys(this.props.labels)
    const newLabels = keys.map((key) => {
      return { key, value: this.props.labels[key] }
    })
    this.setState({ labels: newLabels })
  }

  callParentOnChange = (labels) => {
    if (this.props.onChange) {
      // convert to key values
      const mapLabels = {}
      labels.forEach((label) => {
        mapLabels[label.key] = label.value
      })
      this.props.onChange(mapLabels)
    }
  }

  onChange = (index, type, newValue) => {
    this.setState((prevState) => {
      const labels = prevState.labels
      labels[index][type] = newValue
      this.callParentOnChange(labels)
      return { labels: labels }
    })
  }

  onDelete = (index) => {
    this.setState((prevState) => {
      const labels = prevState.labels
      labels.splice(index, 1)
      this.callParentOnChange(labels)
      return { labels: labels }
    })
  }

  onAdd = () => {
    this.setState((prevState) => {
      const labels = prevState.labels
      labels.push({ key: "", value: "" })
      return { labels: labels }
    })
  }

  render() {
    const itemsLength = this.state.labels.length
    const items = this.state.labels.map((label, index) => {
      const addButton =
        itemsLength === index + 1 ? (
          <AddCircleOIcon onClick={this.onAdd} className="btn-add icon-btn" />
        ) : null
      return (
        <>
          <GridItem span={5}>
            <TextInput
              id={"key_" + index}
              value={label.key}
              onChange={(newValue) => {
                this.onChange(index, "key", newValue)
              }}
            />
          </GridItem>

          <GridItem span={5}>
            <TextInput
              id={"value_" + index}
              value={label.value}
              onChange={(newValue) => {
                this.onChange(index, "value", newValue)
              }}
            />
          </GridItem>
          <GridItem span={2}>
            <Bullseye className="btn-layout">
              <Split hasGutter>
                <MinusCircleIcon onClick={() => this.onDelete(index)} className="btn-remove icon-btn" />
                {addButton}
              </Split>
            </Bullseye>
          </GridItem>
        </>
      )
    })

    if (items.length === 0) {
      items.push(
        <Button variant="secondary" onClick={this.onAdd}>
          Add
        </Button>
      )
    }

    return (
      <Grid className="mc-labels">
        <GridItem span={5}>
          <Text component={TextVariants.h4}>Key</Text>
        </GridItem>

        <GridItem span={5}>
          <Text component={TextVariants.h1}>Value</Text>
        </GridItem>
        <GridItem span={2}></GridItem>

        {items}
      </Grid>
    )
  }
}

export default LabelsForm
