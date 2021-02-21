import { Grid, GridItem, Select, SelectOption, Spinner } from "@patternfly/react-core"
import React from "react"
import PropTypes from "prop-types"

const itemsLimit = 10

class AsyncSelect extends React.Component {
  state = {
    isOpen: false,
    loading: false,
    options: [],
  }

  onFilter = (event) => {
    if (!event) {
      // TODO: remove this if block and fix event undefined issue
      return
    }
    const { apiOptions, optionValueKey } = this.props
    const valueKey = optionValueKey ? optionValueKey : "id"
    if (apiOptions) {
      this.setState({ loading: true }, () => {
        const filters = this.getFilters(event.target.value)
        apiOptions({ filter: filters, limit: itemsLimit })
          .then((res) => {
            const items = res.data.data
            const options = items.map((item) => {
              return { label: item[valueKey], description: this.getDescription(item) }
            })
            this.setState({ options: options, loading: false })
          })
          .catch((_e) => {
            this.setState({ loading: false })
          })
      })
    }
  }

  getFilters = (value) => {
    if (this.props.getFiltersFunc) {
      return this.props.getFiltersFunc(value)
    }
    return [{ k: "name", o: "regex", v: value }]
  }

  getDescription = (item) => {
    if (this.props.getOptionsDescriptionFunc) {
      return this.props.getOptionsDescriptionFunc(item)
    }
    return item.name
  }

  onSelection = (_event, selection) => {
    this.setState({ isOpen: false }, () => {
      if (this.props.onSelectionFunc) {
        this.props.onSelectionFunc(selection)
      }
    })
  }

  onClear = () => {
    this.setState({ selection: "" }, () => {
      if (this.props.onSelectionFunc) {
        this.props.onSelectionFunc("")
      }
    })
  }

  onToggle = (isOpen) => {
    this.setState({ isOpen })
  }

  render() {
    const { isOpen, options, loading } = this.state
    const { isDisabled, selected } = this.props
    const selectOptions = options.map((option) => {
      return <SelectOption value={option.label} description={option.description} />
    })
    const spinner = loading ? <Spinner size="lg" /> : null
    return (
      <Grid hasGutter>
        <GridItem span={11}>
          <Select
            variant="typeahead"
            onToggle={this.onToggle}
            onFilter={this.onFilter}
            onClear={this.onClear}
            isOpen={isOpen}
            onSelect={this.onSelection}
            selections={selected}
            isDisabled={isDisabled}
          >
            {selectOptions}
          </Select>
        </GridItem>
        <GridItem span={1}> {spinner}</GridItem>
      </Grid>
    )
  }
}
AsyncSelect.propTypes = {
  apiOptions: PropTypes.func,
  getFiltersFunc: PropTypes.func,
  optionValueKey: PropTypes.string,
  getOptionsDescriptionFunc: PropTypes.func,
  onSelectionFunc: PropTypes.func,
  isDisabled: PropTypes.bool,
  selected: PropTypes.string,
}

export default AsyncSelect
