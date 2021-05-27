import React from "react"
import PropTypes from "prop-types"
import Loading from "../../Loading/Loading"
import { getValue } from "../../../Util/Util"
import { Stack, StackItem } from "@patternfly/react-core"
import { RefreshIntervalType } from "../../../Constants/Metric"
import lodash from "lodash"
import { ImageSourceType } from "../../../Constants/Widgets/ImagePanel"
import { connect } from "react-redux"

class ImageURLPanel extends React.Component {
  state = {
    isLoading: true,
    error: "",
    refreshHash: Date.now(),
  }

  componentDidMount() {
    this.updateComponents()
    // update metrics query on interval
    const { config } = this.props
    const refreshInterval = getValue(config, "refreshInterval", RefreshIntervalType.None)
    if (refreshInterval >= 1000) {
      this.interval = setInterval(() => {
        this.updateComponents()
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

    this.setState({ isLoading: false, refreshHash: Date.now() })
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
    const { authToken } = this.props

    let finalUrl = `${imageURL}?mcRefreshHash=${refreshHash}`
    if (sourceType === ImageSourceType.Disk) {
      finalUrl = `${imageLocation}?access_token=${authToken}&mcRefreshHash=${refreshHash}`
    }

    return (
      <Stack>
        <StackItem isFilled>
          <img style={{ transform: `rotate(${rotation}deg)` }} src={finalUrl} />
        </StackItem>
        <StackItem></StackItem>
      </Stack>
    )
  }
}

ImageURLPanel.propTypes = {
  config: PropTypes.object,
}

const mapStateToProps = (state) => ({
  authToken: state.entities.auth.token,
})

export default connect(mapStateToProps)(ImageURLPanel)
