import { Grid, GridItem, Select, SelectOption, Spinner } from "@patternfly/react-core"
import React from "react"
import PropTypes from "prop-types"
import { getDynamicFilter } from "../../Util/Filter"

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
    const { apiOptions, optionValueFunc } = this.props
    const valueFunc = optionValueFunc ? optionValueFunc : this.getOptionValueFunc
    if (apiOptions) {
      this.setState({ loading: true }, () => {
        const filters = this.getFilters(event.target.value)
        apiOptions({ filter: filters, limit: itemsLimit })
          .then((res) => {
            const items = res.data.data
            const options = items.map((item) => {
              return { label: valueFunc(item), description: this.getDescription(item) }
            })
            this.setState({ options: options, loading: false })
          })
          .catch((_e) => {
            this.setState({ loading: false })
          })
      })
    }
  }

  getOptionValueFunc = (item) => {
    const { optionValueKey } = this.props
    const valueKey = optionValueKey ? optionValueKey : "id"
    return item[valueKey]
  }

  getFilters = (value) => {
    if (this.props.getFiltersFunc) {
      return this.props.getFiltersFunc(value)
    }

    return getDynamicFilter("name", value, [])
    //  return [{ k: "name", o: "regex", v: value }]
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
    const {
      isDisabled,
      selected,
      showSpinner = false,
      direction = "down",
      isCreatable,
      createText,
    } = this.props
    const selectOptions = options.map((option) => {
      return <SelectOption value={option.label} description={option.description} />
    })

    const spinnerSpan = showSpinner ? 1 : 0
    const spinner =
      loading && showSpinner ? (
        <GridItem span={spinnerSpan}>
          <Spinner size="lg" />{" "}
        </GridItem>
      ) : null
    return (
      <Grid hasGutter>
        <GridItem span={12 - spinnerSpan}>
          <Select
            variant="typeahead"
            onToggle={this.onToggle}
            onFilter={this.onFilter}
            onClear={this.onClear}
            isOpen={isOpen}
            onSelect={this.onSelection}
            selections={selected}
            isDisabled={isDisabled}
            direction={direction}
            isCreatable={isCreatable}
            createText={createText}
            onCreateOption={() => {}}
          >
            {selectOptions}
          </Select>
        </GridItem>
        {spinner}
      </Grid>
    )
  }
}
AsyncSelect.propTypes = {
  apiOptions: PropTypes.func,
  getFiltersFunc: PropTypes.func,
  optionValueKey: PropTypes.string,
  optionValueFunc: PropTypes.func,
  getOptionsDescriptionFunc: PropTypes.func,
  onSelectionFunc: PropTypes.func,
  isDisabled: PropTypes.bool,
  selected: PropTypes.string,
  showSpinner: PropTypes.bool,
  direction: PropTypes.string,
  isCreatable: PropTypes.bool,
  createText: PropTypes.string,
}

export default AsyncSelect
