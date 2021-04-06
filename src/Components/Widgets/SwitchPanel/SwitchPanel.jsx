import { Divider, Grid, GridItem, Switch as PfSwitch } from "@patternfly/react-core"
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import _ from "lodash"
import { redirect as rd } from "../../../Service/Routes"
import "./SwitchPanel.scss"
import Loading from "../../Loading/Loading"
import { getDetailPage, getField, getListAPI } from "./SwitchPanelUtils"
import { api } from "../../../Service/Api"
import { loadData, unloadData } from "../../../store/entities/websocket"
import { getValue } from "../../../Util/Util"
import { getQuickId } from "../../../Constants/ResourcePicker"

const wsKey = "dashboard_switch_panel"

class Switch extends React.Component {
  state = { isChecked: this.props.isChecked }

  onChange = (isChecked) => {
    this.setState({ isChecked })
    api.action.send({ resource: this.props.quickId, payload: isChecked })
  }

  render() {
    return <PfSwitch id={this.props.id} onChange={this.onChange} isChecked={this.props.isChecked} />
  }
}

class SwitchPanel extends React.Component {
  state = {
    isLoading: true,
    //    resources: [],
  }

  getWsKey = () => {
    return `${wsKey}_${this.props.widgetId}`
  }

  componentWillUnmount() {
    this.props.unloadData({ key: this.getWsKey() })
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
    const { resourceSelectors, itemsLimit, resourceType } = this.props.config
    const selectorKeys = Object.keys(resourceSelectors)
    const filters = selectorKeys.map((key) => {
      return { k: key, v: resourceSelectors[key] }
    })

    const listAPI = getListAPI(resourceType)

    listAPI({ filter: filters, limit: itemsLimit })
      .then((res) => {
        const resources = {}
        res.data.data.forEach((item) => {
          // return getField(resourceType, field, resourceNameKey)
          const quickId = getQuickId(resourceType, item)
          resources[quickId] = item
        })
        this.props.loadData({ key: this.getWsKey(), resources: resources })
        this.setState({ isLoading: false, resources })
      })
      .catch((_e) => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    const { isLoading } = this.state
    const { resourceType, resourceNameKey } = this.props.config

    if (isLoading) {
      return <Loading />
    }

    // console.log("wsData:", this.props.wsData)
    const resourcesRaw = getValue(this.props.wsData, this.getWsKey(), {})
    const resources = []
    Object.keys(resourcesRaw).forEach((id) => {
      const field = resourcesRaw[id]
      resources.push(getField(resourceType, field, resourceNameKey))
    })

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

const mapStateToProps = (state) => ({
  wsData: state.entities.websocket.data,
})

const mapDispatchToProps = (dispatch) => ({
  loadData: (data) => dispatch(loadData(data)),
  unloadData: (data) => dispatch(unloadData(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchPanel)
