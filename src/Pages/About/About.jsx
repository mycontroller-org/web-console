import {
  AboutModal,
  Divider,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextVariants
} from "@patternfly/react-core"
import React from "react"
import { connect } from "react-redux"
import brandImg from "../../Logo/mc-white-full.svg"
import { api } from "../../Service/Api"
import { aboutHide } from "../../store/entities/about"
import "./About.scss"
class AboutPage extends React.Component {
  state = {
    backend: {},
    loading: true,
  }

  componentDidMount() {
    api.version
      .get()
      .then((res) => {
        this.setState({ backend: res.data, loading: false })
      })
      .catch((e) => {
        this.setState({ loading: false })
      })
  }

  render() {
    const bk = this.state.backend
    return (
      <AboutModal
        className="mc-about"
        isOpen={this.props.showModel}
        onClose={this.props.hideAbout}
        trademark="© 2021 MyController.org. All Rights Reserved. Apache License 2.0"
        brandImageSrc={brandImg}
        brandImageAlt="MyController.org"
        //productName="MYCONTROLLER.ORG"
      >
        <TextContent>
          <Text component={TextVariants.h2}>Backend</Text>
          <Divider component="hr" />
          <TextList component="dl">
            <TextListItem component="dt">Branch</TextListItem>
            <TextListItem component="dd">{bk.version}</TextListItem>
            <TextListItem component="dt">Git Commit</TextListItem>
            <TextListItem component="dd">{bk.gitCommit}</TextListItem>
            <TextListItem component="dt">Build Date</TextListItem>
            <TextListItem component="dd">{bk.buildDate}</TextListItem>
            <TextListItem component="dt">GoLang Version</TextListItem>
            <TextListItem component="dd">{bk.goLang} ({bk.platform}, {bk.arch})</TextListItem>
          </TextList>

          <Text component={TextVariants.h2}>Web Console</Text>
          <Divider component="hr" />
          <TextList component="dl">
            <TextListItem component="dt">Branch</TextListItem>
            <TextListItem component="dd">{process.env.REACT_APP_GIT_BRANCH}</TextListItem>
            <TextListItem component="dt">Git Commit</TextListItem>
            <TextListItem component="dd">{process.env.REACT_APP_GIT_SHA}</TextListItem>
            <TextListItem component="dt">Build Date</TextListItem>
            <TextListItem component="dd">{process.env.REACT_APP_BUILD_DATE}</TextListItem>
            <TextListItem component="dt">React Version</TextListItem>
            <TextListItem component="dd">{React.version}</TextListItem>
          </TextList>
        </TextContent>
      </AboutModal>
    )
  }
}

const mapStateToProps = (state) => ({
  showModel: state.entities.about.show,
})

const mapDispatchToProps = (dispatch) => ({
  hideAbout: () => dispatch(aboutHide()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AboutPage)
