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
  ButtonVariant,
} from "@patternfly/react-core"
import { InfoAltIcon } from "@patternfly/react-icons"
//import brandImg from "./examples/brandImg.svg"
import { api } from "../../Service/Api"

class McAboutModal extends React.Component {
  state = {
    showModel: false,
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

  open = () => {
    this.setState({ showModel: true })
  }

  close = () => {
    this.setState({ showModel: false })

  }

  render() {
    const bk = this.state.backend
    return (
      <AboutModal
        isOpen={this.state.showModel}
        onClose={this.close}
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
    )
  }
}

export default McAboutModal
