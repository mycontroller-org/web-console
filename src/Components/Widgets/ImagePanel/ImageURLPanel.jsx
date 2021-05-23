import React from "react"
import PropTypes from "prop-types"
import Loading from "../../Loading/Loading"
import { getValue } from "../../../Util/Util"
import { Stack, StackItem } from "@patternfly/react-core"
import { RefreshIntervalType } from "../../../Constants/Metric"
import lodash from "lodash"
import { ImageSourceType } from "../../../Constants/Widgets/ImagePanel"

class ImageURLPanel extends React.Component {
  state = {
    isLoading: true,
    error: "",
    refreshHash: 0,
  }

  componentDidMount() {
    this.updateComponents()
    // update metrics query on interval
    const { config } = this.props
    const refreshInterval = getValue(config, "refreshInterval", RefreshIntervalType.None)
    if (refreshInterval >= 1000) {
      this.interval = setInterval(() => {
        this.setState({ refreshHash: Date.now() })
      }, refreshInterval)
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  componentDidUpdate(prevProps) {
    if (!lodash.isEqual(this.props.config, prevProps.config)) {
      this.updateComponents()
    }
  }

  updateComponents = () => {
    if (this.props.config === undefined) {
      this.setState({ isLoading: false, error: "config not found" })
      return
    }

    this.setState({ isLoading: false })
  }

  render() {
    const { isLoading, error, refreshHash } = this.state

    if (error !== "") {
      return <span>Error: {error}</span>
    }

    if (isLoading) {
      return <Loading />
    }

    const { sourceType, imageURL, imageLocation, rotation } = this.props.config

    const finalURL = sourceType === ImageSourceType.URL ? imageURL : imageLocation

    return (
      <Stack>
        <StackItem isFilled>
          <img style={{ transform: `rotate(${rotation}deg)` }} src={`${finalURL}?${refreshHash}`} />
        </StackItem>
        <StackItem></StackItem>
      </Stack>
    )
  }
}

ImageURLPanel.propTypes = {
  config: PropTypes.object,
}

export default ImageURLPanel
