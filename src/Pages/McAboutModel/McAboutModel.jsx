import React from "react"
import {
  AboutModal,
  Button,
  TextContent,
  TextList,
  TextListItem,
  Divider,
  Text,
  TextVariants,
} from "@patternfly/react-core"
import { InfoAltIcon } from "@patternfly/react-icons"
//import brandImg from "./examples/brandImg.svg"
import { api } from "../../Service/Api"

class McAboutModal extends React.Component {
  state = {
    isModalOpen: false,
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

  handleModalToggle = () => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }))
  }

  render() {
    const { isModalOpen } = this.state

    const bk = this.state.backend
    return (
      <React.Fragment>
        <Button onClick={this.handleModalToggle}>
          <InfoAltIcon /> About
        </Button>
        <AboutModal
          isOpen={isModalOpen}
          onClose={this.handleModalToggle}
          trademark="TODO: Trademark and copyright information"
          //brandImageSrc={brandImg}
          //brandImageAlt="Patternfly Logo"
          //productName="MYCONTROLLER.ORG"
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
      </React.Fragment>
    )
  }
}

export default McAboutModal
