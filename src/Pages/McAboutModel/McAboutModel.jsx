import React from "react"
import {
  AboutModal,
  TextContent,
  TextList,
  TextListItem,
  Divider,
  Text,
  TextVariants,
} from "@patternfly/react-core"
//import brandImg from "./examples/brandImg.svg"
//import brandImg from "../../logo_full.png"
import { api } from "../../Service/Api"
import { connect } from "react-redux"
import { aboutHide } from "../../store/entities/about"

class McAboutModal extends React.Component {
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
        isOpen={this.props.showModel}
        onClose={this.props.hideAbout}
        trademark="TODO: Trademark and copyright information"
        //brandImageSrc={brandImg}
        //brandImageAlt="MyController.org Logo"
        productName="MYCONTROLLER.ORG"
      >
        <TextContent>
          <Text component={TextVariants.h2}>Backend</Text>
          <Divider component="hr" />
          <TextList component="dl">
            <TextListItem component="dt">Version</TextListItem>
            <TextListItem component="dd">{bk.version}</TextListItem>
            <TextListItem component="dt">GoLang Version</TextListItem>
            <TextListItem component="dd">{bk.goLang}</TextListItem>
            <TextListItem component="dt">Git Commit</TextListItem>
            <TextListItem component="dd">{bk.gitCommit}</TextListItem>
            <TextListItem component="dt">Build Date</TextListItem>
            <TextListItem component="dd">{bk.buildDate}</TextListItem>
            <TextListItem component="dt">Platform, Arch</TextListItem>
            <TextListItem component="dd">
              {bk.platform}, {bk.arch}
            </TextListItem>
          </TextList>

          <Text component={TextVariants.h2}>Web Console</Text>
          <Divider component="hr" />
          <TextList component="dl">
            <TextListItem component="dt">Version</TextListItem>
            <TextListItem component="dd">v2.0.0</TextListItem>
            <TextListItem component="dt">React Version</TextListItem>
            <TextListItem component="dd">{React.version}</TextListItem>
            <TextListItem component="dt">Git Commit</TextListItem>
            <TextListItem component="dd">abc</TextListItem>
            <TextListItem component="dt">Build Date</TextListItem>
            <TextListItem component="dd">2020-08-23T19:18:59+05:30</TextListItem>
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
  hideAbout: () => dispatch(aboutHide())
})

export default connect(mapStateToProps, mapDispatchToProps)(McAboutModal)
