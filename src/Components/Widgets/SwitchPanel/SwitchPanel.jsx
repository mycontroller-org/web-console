import { Divider, Grid, GridItem, Switch as PfSwitch } from "@patternfly/react-core"
import PropTypes from "prop-types"
import React from "react"
import _ from "lodash"
import { redirect as rd, routeMap as rMap } from "../../../Service/Routes"
import "./SwitchPanel.scss"
import Loading from "../../Loading/Loading"
import { getDetailPage, getField, getListAPI } from "./SwitchPanelUtils"
import { api } from "../../../Service/Api"

class Switch extends React.Component {
  state = { isChecked: this.props.isChecked }

  onChange = (isChecked) => {
    this.setState({ isChecked })
    api.action.send({ resource: this.props.quickId, payload: isChecked })
  }

  render() {
    return <PfSwitch id={this.props.id} onChange={this.onChange} isChecked={this.state.isChecked} />
  }
}

class SwitchPanel extends React.Component {
  state = {
    isLoading: true,
    resources: [],
  }

  componentDidMount() {
    this.updateComponents()
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.config, prevProps.config)) {
      this.updateComponents()
    }
  }

  updateComponents = () => {
    const { resourceSelectors, itemsLimit, resourceNameKey, resourceType } = this.props.config
    const selectorKeys = Object.keys(resourceSelectors)
    const filters = selectorKeys.map((key) => {
      return { k: key, v: resourceSelectors[key] }
    })

    const listAPI = getListAPI(resourceType)

    listAPI({ filter: filters, limit: itemsLimit })
      .then((res) => {
        const resources = res.data.data.map((field) => {
          return getField(resourceType, field, resourceNameKey)
        })
        this.setState({ isLoading: false, resources })
      })
      .catch((_e) => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    const { isLoading, resources } = this.state
    const { resourceType } = this.props.config

    if (isLoading) {
      return <Loading />
    }
    const switches = resources.map((r, index) => {
      const className = r.isChecked ? "text enabled" : "text"
      const detailPage = getDetailPage(resourceType)
      const divider = resources.length > 1 ? <Divider style={{ padding: "7px 0px" }} /> : null
      return (
        <GridItem span={12} key={"label_" + index}>
          <span
            className={className}
            onClick={() => {
              rd(this.props.history, detailPage, { id: r.id })
            }}
          >
            {r.label}
          </span>
          <span style={{ float: "right" }}>
            <Switch id={r.id} isChecked={r.isChecked} quickId={r.quickId} />
          </span>
          {divider}
        </GridItem>
      )
    })
    return <Grid className="mc-switch-panel">{switches}</Grid>
  }
}

SwitchPanel.propTypes = {
  config: PropTypes.object,
}

export default SwitchPanel
