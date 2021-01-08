import { Divider, Grid, GridItem, Switch as PfSwitch } from "@patternfly/react-core"
import PropTypes from "prop-types"
import React from "react"
import { api } from "../../../Service/Api"

class Switch extends React.Component {
  state = { isChecked: this.props.isChecked }

  onChange = (isChecked) => {
    this.setState({ isChecked })
    api.action.send({ resource: this.props.quickId, payload: isChecked })
  }

  render() {
    return <PfSwitch onChange={this.onChange} isChecked={this.state.isChecked} />
  }
}

class SwitchPanel extends React.Component {
  state = {
    isLoading: true,
    resources: [],
  }

  componentDidMount() {
    const filters = [{ k: "metricType", v: "binary" }]
    if (this.props.config && this.props.config.labels) {
      const keys = Object.keys(this.props.config.labels)
      keys.forEach((key) => {
        filters.push({ k: key, v: this.props.config.labels[key] })
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
      return (
        <GridItem span={12} key={"label_" + index}>
          <span style={{ float: "left", fontWeight: r.isChecked ? "bold" : "normal" }}>{r.label}</span>
          <span style={{ float: "right" }}>
            <Switch isChecked={r.isChecked} quickId={r.quickId} />
          </span>
          <Divider style={{ padding: "7px 0px" }} />
        </GridItem>
      )
    })
    return <Grid>{switches}</Grid>
  }
}

SwitchPanel.propTypes = {
  config: PropTypes.object,
}

export default SwitchPanel
