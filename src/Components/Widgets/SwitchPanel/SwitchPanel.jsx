import { Divider, Grid, GridItem, Switch as PfSwitch } from "@patternfly/react-core"
import PropTypes from "prop-types"
import React from "react"
import { api } from "../../../Service/Api"
import _ from "lodash"
import { redirect as rd, routeMap as rMap } from "../../../Service/Routes"
import "./SwitchPanel.scss"

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
    const filters = [{ k: "metricType", v: "binary" }]
    if (this.props.config && this.props.config.labels) {
      const keys = Object.keys(this.props.config.labels)
      keys.forEach((key) => {
        filters.push({ k: "labels." + key, v: this.props.config.labels[key] })
      })
    }
    api.sensorField
      .list({ filter: filters })
      .then((res) => {
        const resources = res.data.data.map((f) => {
          return {
            id: f.id,
            label: f.name,
            isChecked: f.payload.value,
            quickId: "sf:" + f.gatewayId + "." + f.nodeId + "." + f.sensorId + "." + f.fieldId,
          }
        })
        this.setState({ isLoading: false, resources })
      })
      .catch((_e) => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    const { isLoading, resources } = this.state

    if (isLoading) {
      return <span>Loading</span>
    }
    const switches = resources.map((r, index) => {
      const className = r.isChecked ? "text enabled" : "text"
      return (
        <GridItem span={12} key={"label_" + index}>
          <span
            className={className}
            onClick={() => {
              rd(this.props.history, rMap.resources.sensorField.detail, { id: r.id })
            }}
          >
            {r.label}
          </span>
          <span style={{ float: "right" }}>
            <Switch id={r.id} isChecked={r.isChecked} quickId={r.quickId} />
          </span>
          <Divider style={{ padding: "7px 0px" }} />
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
