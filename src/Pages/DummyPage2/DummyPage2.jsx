import React from "react"

import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  DropdownPosition,
  DropdownDirection,
  Divider,
  TextInput,
} from "@patternfly/react-core"
import { ThIcon, CaretDownIcon } from "@patternfly/react-icons"

import PageTitle from "../../Components/PageTitle/PageTitle"
import PageContent from "../../Components/PageContent/PageContent"
import Selector from "../../Components/Selector/Seletor"

class DummyPage2 extends React.Component {
  render() {
    return (
      <>
        <PageTitle title="Dummy Page2" />
        <PageContent>
          <Selector />
        </PageContent>
      </>
    )
  }
}

export default DummyPage2
