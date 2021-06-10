import { Button, Split, SplitItem, Stack, StackItem } from "@patternfly/react-core"
import { loadData, unloadData } from "../../../store/entities/websocket"

import { ChevronCircleRightIcon } from "@patternfly/react-icons"
import { LastSeen } from "../../Time/Time"
import Loading from "../../Loading/Loading"
import PropTypes from "prop-types"
import React from "react"
import { ResourceType } from "../../../Constants/Resource"
import { api } from "../../../Service/Api"
import { connect } from "react-redux"
import { getValue, isEqual } from "../../../Util/Util"
import { navigateToResource } from "../Helper/Resource"

const wsKey = "dashboard_image_panel_image_from_field"

class ImageFromFieldPanel extends React.Component {
  state = {
    isLoading: true,
    error: "",
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
    if (!isEqual(prevProps.config, this.props.config)) {
      this.updateComponents()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps)
  }

  updateComponents = () => {
    if (this.props.config === undefined) {
      this.setState({ isLoading: false, error: "config not found" })
      return
    }

    const { fields } = this.props.config
    const resourceIDs = [fields.image]

    api.quickId
      .getResources({ id: resourceIDs })
      .then((res) => {
        this.props.loadData({ key: this.getWsKey(), resources: res.data })
        this.setState({ isLoading: false })
      })
      .catch((_e) => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    const { isLoading, error } = this.state

    if (error !== "") {
      return <span>Error: {error}</span>
    }

    if (isLoading) {
      return <Loading />
    }

    const { fields, rotation } = this.props.config
    const { wsData, history } = this.props

    const resources = {
      image: null,
    }

    const resourcesRaw = getValue(wsData, this.getWsKey(), {})
    Object.keys(resourcesRaw).forEach((id) => {
      if (fields.image === id) {
        resources.image = resourcesRaw[id]
      }
    })

    return (
      <Stack>
        <StackItem isFilled style={{ overflow: "hidden" }}>
          <img
            style={{ transform: `rotate(${rotation}deg)`, objectFit: "contain" }}
            src={getValue(resources, "image.current.value", "")}
            align="left"
            alt="dynamic data"
          />
        </StackItem>
        <StackItem>
          <Split>
            <SplitItem isFilled>
              <span className="value-timestamp">
                <LastSeen date={getValue(resources, "image.current.timestamp", "")} tooltipPosition="top" />
              </span>
            </SplitItem>
            <SplitItem>
              <Button
                variant="link"
                onClick={() =>
                  navigateToResource(ResourceType.Field, getValue(resources, "image.id", ""), history)
                }
              >
                <ChevronCircleRightIcon />
              </Button>
            </SplitItem>
          </Split>
        </StackItem>
      </Stack>
    )
  }
}

ImageFromFieldPanel.propTypes = {
  config: PropTypes.object,
}

const mapStateToProps = (state) => ({
  wsData: state.entities.websocket.data,
})

const mapDispatchToProps = (dispatch) => ({
  loadData: (data) => dispatch(loadData(data)),
  unloadData: (data) => dispatch(unloadData(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageFromFieldPanel)
