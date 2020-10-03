import React from "react"
import {
  Nav,
  NavItem,
  NavList,
  Page,
  Dropdown,
  DropdownGroup,
  DropdownToggle,
  DropdownItem,
  PageHeader,
  PageSidebar,
  SkipToContent,
  TextContent,
  Text,
  TextVariants,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  NavExpandable,
  NotificationBadge,
  //Spinner,
} from "@patternfly/react-core"
// make sure you've installed @patternfly/patternfly
//import accessibleStyles from "@patternfly/react-styles/css/utilities/Accessibility/accessibility";
//import spacingStyles from "@patternfly/react-styles/css/utilities/Spacing/spacing";
//import { css } from "@patternfly/react-styles";
import {
  CogIcon,
  HelpIcon,
  UserIcon,
  PowerOffIcon,
  InfoAltIcon,
  BellIcon,
} from "@patternfly/react-icons"
//import imgBrand from "./imgBrand.svg";
//import imgAvatar from "./imgAvatar.svg";
import "./Layout.scss"
import { routes, hiddenRoutes } from "../Service/Routes"
import { withRouter } from "react-router"
import { Route, Redirect, Switch } from "react-router-dom"
import NotificationContainer from "./NotificationContainer"
import { notificationDrawerToggle } from "../store/entities/notification"
import { connect } from "react-redux"
import { aboutShow } from "../store/entities/about"
import McAboutModel from "../Pages/McAboutModel/McAboutModel"
import Toaster from "../Components/Toaster/Toaster"
import Spinner from "../Components/Spinner/Spinner"

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

    const notificationDrawer = <NotificationContainer />

    const kebabDropdownItems = [
      <DropdownItem key="settings">
        <CogIcon /> Settings
      </DropdownItem>,
      <DropdownItem key="help">
        <HelpIcon /> Help
      </DropdownItem>,
      <DropdownItem key="about" onClick={this.props.showAbout}>
        <InfoAltIcon /> About
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
        <PageHeaderToolsGroup key="spinner">
          {this.props.showGlobalSpinner ? <Spinner size="lg" /> : null}
        </PageHeaderToolsGroup>
        <PageHeaderToolsGroup key="others">
          <PageHeaderToolsItem visibility={{ default: "visible" }} isSelected={this.props.isDrawerExpanded}>
            <NotificationBadge
              variant={this.props.notificationDisplayVariant}
              onClick={this.props.onNotificationBadgeClick}
              aria-label="Notifications"
              count={this.props.notificationCount}
            >
              <BellIcon />
            </NotificationBadge>
          </PageHeaderToolsItem>
          <PageHeaderToolsItem>
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onKebabDropdownSelect}
              toggle={
                <DropdownToggle
                  toggleIndicator={null}
                  onToggle={this.onKebabDropdownToggle}
                  icon={<HelpIcon />}
                />
              }
              isOpen={this.state.isKebabDropdownOpen}
              dropdownItems={kebabDropdownItems}
            />
          </PageHeaderToolsItem>
          <PageHeaderToolsItem>
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
        <McAboutModel />
        <Toaster />
        <Page
          onPageResize={() => {
            window.dispatchEvent(new Event("resize"))
          }}
          header={Header}
          sidebar={Sidebar}
          isManagedSidebar={true}
          skipToContent={PageSkipToContent}
          mainContainerId={pageId}
          notificationDrawer={notificationDrawer}
          isNotificationDrawerExpanded={this.props.isDrawerExpanded}
        >
          {this.renderContent()}
        </Page>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  isDrawerExpanded: state.entities.notification.isDrawerExpanded,
  notificationDisplayVariant: state.entities.notification.displayVariant,
  notificationCount: state.entities.notification.unreadCount,
  showGlobalSpinner: state.entities.spinner.show,
})

const mapDispatchToProps = (dispatch) => ({
  onNotificationBadgeClick: () => dispatch(notificationDrawerToggle()),
  showAbout: () => dispatch(aboutShow()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageLayoutExpandableNav))
