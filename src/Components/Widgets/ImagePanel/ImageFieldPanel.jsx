import { Button, Divider, Split, SplitItem, Stack, StackItem } from "@patternfly/react-core"
import { loadData, unloadData } from "../../../store/entities/websocket"

import { ChevronCircleRightIcon, InfoAltIcon, InfoCircleIcon, TimesIcon } from "@patternfly/react-icons"
import { LastSeen } from "../../Time/Time"
import Loading from "../../Loading/Loading"
import PropTypes from "prop-types"
import React from "react"
import { ResourceType } from "../../../Constants/Resource"
import { api } from "../../../Service/Api"
import { connect } from "react-redux"
import { getValue, isEqual } from "../../../Util/Util"
import { navigateToResource } from "../Helper/Resource"
import { ImageType } from "../../../Constants/Widgets/ImagePanel"

import "./ImagePanel.scss"

const wsKey = "dashboard_image_panel_image_from_field"

class ImageFromFieldPanel extends React.Component {
  state = {
    isLoading: true,
    error: "",
    refreshHash: Date.now(),
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

    const { field } = this.props.config
    const resourceIDs = [field.id]

    api.quickId
      .getResources({ id: resourceIDs })
      .then((res) => {
        this.props.loadData({ key: this.getWsKey(), resources: res.data })
        this.setState({ isLoading: false, refreshHash: Date.now() })
      })
      .catch((_e) => {
        this.setState({ isLoading: false, refreshHash: Date.now() })
      })
  }

  render() {
    const { isLoading, error, refreshHash } = this.state

    if (error !== "") {
      return <span>Error: {error}</span>
    }

    if (isLoading) {
      return <Loading />
    }

    const { field, rotation } = this.props.config
    const { wsData, history, authToken } = this.props

    let resourceData = {}

    const resourcesRaw = getValue(wsData, this.getWsKey(), {})
    Object.keys(resourcesRaw).forEach((id) => {
      if (field.id === id) {
        resourceData = resourcesRaw[id]
      }
    })

    let imageData = ""
    const resourceValue = getValue(resourceData, "current.value", "")
    switch (field.type) {
      case ImageType.Image:
        imageData = resourceValue
        break

      case ImageType.Icon:
        break

      case ImageType.CustomMapping:
        // load custom mapping image
        const imageLocation = getValue(field, `custom_mapping.${resourceValue}`, "")
        imageData = `${imageLocation}?access_token=${authToken}&mcRefreshHash=${refreshHash}`
        break
    }

    let resourceTimestamp = null

    if (field.showTimestamp) {
      resourceTimestamp = (
        <>
          <StackItem>
            <Divider className="divider" component="li" />
          </StackItem>
          <StackItem>
            <Split>
              <SplitItem>
                <Button
                  variant="link"
                  onClick={() =>
                    navigateToResource(ResourceType.Field, getValue(resourceData, "id", ""), history)
                  }
                >
                  <InfoAltIcon />
                </Button>
              </SplitItem>
              <SplitItem isFilled style={{ textAlign: "right" }}>
                <span className="value-timestamp">
                  <LastSeen date={getValue(resourceData, "current.timestamp", "")} tooltipPosition="top" />
                </span>
              </SplitItem>
            </Split>
          </StackItem>
        </>
      )
    }

    return (
      <Stack>
        <StackItem isFilled style={{ overflow: "hidden" }}>
          <img
            className="auto-resize"
            style={{
              transform: `rotate(${rotation}deg)`,
              objectFit: "contain",
            }}
            src={imageData}
            align="left"
            alt="dynamic data"
          />
        </StackItem>
        {resourceTimestamp}
      </Stack>
    )
  }
}

ImageFromFieldPanel.propTypes = {
  config: PropTypes.object,
}

const mapStateToProps = (state) => ({
  wsData: state.entities.websocket.data,
  authToken: state.entities.auth.token,
})

const mapDispatchToProps = (dispatch) => ({
  loadData: (data) => dispatch(loadData(data)),
  unloadData: (data) => dispatch(unloadData(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageFromFieldPanel)
