import React from "react"
import {
  Button,
  ButtonVariant,
  Nav,
  NavItem,
  NavList,
  Page,
  Dropdown,
  DropdownGroup,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  PageHeader,
  PageSidebar,
  SkipToContent,
  KebabToggle,
  TextContent,
  Text,
  TextVariants,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  NavExpandable,
} from "@patternfly/react-core"
// make sure you've installed @patternfly/patternfly
//import accessibleStyles from "@patternfly/react-styles/css/utilities/Accessibility/accessibility";
//import spacingStyles from "@patternfly/react-styles/css/utilities/Spacing/spacing";
//import { css } from "@patternfly/react-styles";
import { CogIcon, HelpIcon, UserIcon, PowerOffIcon, QuestionCircleIcon } from "@patternfly/react-icons"
//import imgBrand from "./imgBrand.svg";
//import imgAvatar from "./imgAvatar.svg";
import "./Layout.css"
import { routes, hiddenRoutes } from "../Service/Routes"
import { withRouter } from "react-router"
import { Route, Redirect, Switch } from "react-router-dom"
import McAboutModal from "../Pages/McAboutModel/McAboutModel"

class PageLayoutExpandableNav extends React.Component {
  state = {
    isDropdownOpen: false,
    isKebabDropdownOpen: false,
    activeGroup: "grp-1",
    activeItem: "grp-1_itm-1",
  }

  onDropdownToggle = (isDropdownOpen) => {
    this.setState({
      isDropdownOpen,
    })
  }

  onDropdownSelect = (event) => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,
    })
  }

  onKebabDropdownToggle = (isKebabDropdownOpen) => {
    this.setState({
      isKebabDropdownOpen,
    })
  }

  onKebabDropdownSelect = (event) => {
    this.setState({
      isKebabDropdownOpen: !this.state.isKebabDropdownOpen,
    })
  }

  onNavSelect = (result) => {
    this.setState({
      activeItem: result.itemId,
      activeGroup: result.groupId,
    })
  }

  onMenuSelect = (data) => {
    //console.log(data);
    //console.log(item, key, keyPath, domEvent)
    //this.setState({
    //selectedMenuKey: data.key
    //});
    const { history } = this.props
    history.push(data.to)
  }

  renderContent = () => {
    const allRoutes = []
    routes.forEach((item) => {
      if (item.children && item.children.length > 0) {
        item.children.forEach((sItem) => {
          allRoutes.push(<Route key={sItem.to} exact path={sItem.to} component={sItem.component} />)
        })
      } else {
        allRoutes.push(<Route key={item.to} exact path={item.to} component={item.component} />)
      }
    })
    hiddenRoutes.forEach((item) => {
      allRoutes.push(<Route key={item.to} exact path={item.to} component={item.component} />)
    })
    return (
      <Switch>
        {allRoutes}
        <Redirect from="*" to="/" key="default-route" />
      </Switch>
    )
  }

  render() {
    const { location } = this.props

    // selected menu
    let menuSelection = ""
    for (let rIndex = 0; rIndex < routes.length; rIndex++) {
      const r = routes[rIndex]
      if (r.children && r.children.length > 0) {
        for (let cIndex = 0; cIndex < r.children.length; cIndex++) {
          const sr = r.children[cIndex]
          if (location.pathname.startsWith(sr.to)) {
            menuSelection = sr.id
            break
          }
        }
      } else if (location.pathname.startsWith(r.to)) {
        menuSelection = r.id
        break
      }
      if (menuSelection !== "") {
        break
      }
    }

    const getSubMenu = (sm) => {
      const sMenus = sm.map((m) => {
        return (
          <NavItem key={m.id} itemId={m.id} to={m.to} isActive={menuSelection === m.id} preventDefault={true}>
            {m.title}
          </NavItem>
        )
      })
      return sMenus
    }

    const PageNav = (
      <Nav onSelect={this.onMenuSelect} aria-label="Nav" theme="dark">
        <NavList>
          {routes.map((m) => {
            if (m.children && m.children.length > 0) {
              return (
                <NavExpandable key={m.id} groupId={m.id} title={m.title}>
                  {getSubMenu(m.children)}
                </NavExpandable>
              )
            } else {
              return (
                <NavItem
                  key={m.id}
                  itemId={m.id}
                  to={m.to}
                  isActive={menuSelection === m.id}
                  preventDefault={true}
                >
                  {m.title}
                </NavItem>
              )
            }
          })}
        </NavList>
      </Nav>
    )

    const kebabDropdownItems = [
      <DropdownItem>
        <CogIcon /> Settings
      </DropdownItem>,
      <DropdownItem>
        <HelpIcon /> Help
      </DropdownItem>,
      <DropdownItem>
        <McAboutModal />
      </DropdownItem>,
    ]

    const userDropdownItems = [
      <DropdownGroup key="group 2">
        <DropdownItem key="group 2 profile">
          <UserIcon /> Profile
        </DropdownItem>
        <DropdownItem key="group 2 logout">
          <PowerOffIcon /> Logout
        </DropdownItem>
      </DropdownGroup>,
    ]

    const headerTools = (
      <PageHeaderTools>
        <PageHeaderToolsGroup
          breakpointMods={[
            { modifier: "hidden" },
            { modifier: "visible", breakpoint: "lg" },
          ]} /** the settings and help icon buttons are only visible on desktop sizes and replaced by a kebab dropdown for other sizes */
        ></PageHeaderToolsGroup>
        <PageHeaderToolsGroup>
          <PageHeaderToolsItem
            breakpointMods={[
              { modifier: "hidden", breakpoint: "lg" },
            ]} /** this kebab dropdown replaces the icon buttons and is hidden for desktop sizes */
          >
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onKebabDropdownSelect}
              toggle={<KebabToggle onToggle={this.onKebabDropdownToggle} icon={<HelpIcon />} />}
              isOpen={this.state.isKebabDropdownOpen}
              dropdownItems={kebabDropdownItems}
            />
          </PageHeaderToolsItem>
          <PageHeaderToolsItem
            breakpointMods={[
              { modifier: "hidden" },
              { modifier: "visible", breakpoint: "md" },
            ]} /** this user dropdown is hidden on mobile sizes */
          >
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onDropdownSelect}
              isOpen={this.state.isDropdownOpen}
              toggle={
                <DropdownToggle onToggle={this.onDropdownToggle} icon={<UserIcon />}>
                  Admin User
                </DropdownToggle>
              }
              dropdownItems={userDropdownItems}
            />
          </PageHeaderToolsItem>
        </PageHeaderToolsGroup>
      </PageHeaderTools>
    )

    const Header = (
      <PageHeader
        //logo={<Brand src={imgBrand} alt="Patternfly Logo" />}
        logo={
          <TextContent className="rb-logo-text">
            <Text component={TextVariants.h3}>
              MYCONTROLLER.ORG
              <div
                style={{
                  marginTop: "-5px",
                  fontSize: "12px",
                  fontWeight: "100",
                }}
              >
                The Open Source Controller
              </div>
            </Text>
          </TextContent>
        }
        headerTools={headerTools}
        //avatar={<Avatar src={imgAvatar} alt="Avatar image" />}
        showNavToggle
      />
    )
    const Sidebar = <PageSidebar nav={PageNav} theme="dark" />

    const pageId = "main-content-page-layout-expandable-nav"
    const PageSkipToContent = <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>

    return (
      <React.Fragment>
        <Page
          onPageResize={() => {
            window.dispatchEvent(new Event("resize"))
          }}
          header={Header}
          sidebar={Sidebar}
          isManagedSidebar={true}
          skipToContent={PageSkipToContent}
          mainContainerId={pageId}
        >
          {this.renderContent()}
        </Page>
      </React.Fragment>
    )
  }
}

export default withRouter(PageLayoutExpandableNav)
