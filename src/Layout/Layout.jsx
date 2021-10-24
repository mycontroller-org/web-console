import {
  Brand,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavItemSeparator,
  NavList,
  NotificationBadge,
  Page,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  PageSidebar,
  SkipToContent,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
} from "@patternfly/react-core"
// make sure you've installed @patternfly/patternfly
//import accessibleStyles from "@patternfly/react-styles/css/utilities/Accessibility/accessibility";
//import spacingStyles from "@patternfly/react-styles/css/utilities/Spacing/spacing";
//import { css } from "@patternfly/react-styles";
import {
  BellIcon,
  BookIcon,
  ChatIcon,
  CogIcon,
  GithubIcon,
  HelpIcon,
  InfoAltIcon,
  LanguageIcon,
  PowerOffIcon,
  UserIcon,
} from "@patternfly/react-icons"
import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { Redirect, Route, Switch } from "react-router-dom"
import { withTranslation } from "react-i18next"
import ErrorBoundary from "../Components/ErrorBoundary/ErrorBoundary"
import { HeaderSpinner } from "../Components/Spinner/Spinner"
import Toaster from "../Components/Toaster/Toaster"
import logoMain from "../Logo/mc-white.svg"
import AboutPage from "../Pages/About/About"
import { hiddenRoutes, redirect as r, routeMap as rMap, routes } from "../Service/Routes"
import { aboutShow } from "../store/entities/about"
import { clearAuth } from "../store/entities/auth"
import { notificationDrawerToggle } from "../store/entities/notification"
//import imgAvatar from "./imgAvatar.svg";
import "./Layout.scss"
import NotificationContainer from "./NotificationContainer"
import { wsConnect, wsDisconnect } from "../Service/Websocket"
import { URL_FORUM, URL_SOURCE_CODE } from "../Constants/Common"
import { languageList } from "../i18n/i18n"
class PageLayoutExpandableNav extends React.Component {
  state = {
    isDropdownOpen: false,
    isKebabDropdownOpen: false,
    isLanguageDropdownOpen: false,
    activeGroup: "grp-1",
    activeItem: "grp-1_itm-1",
  }

  componentDidMount() {
    wsConnect()
  }

  componentWillUnmount() {
    wsDisconnect()
  }

  onDropdownToggle = (isDropdownOpen) => {
    this.setState({
      isDropdownOpen,
    })
  }

  onDropdownSelect = (_event) => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,
    })
  }

  onKebabDropdownToggle = (isKebabDropdownOpen) => {
    this.setState({
      isKebabDropdownOpen,
    })
  }

  onKebabDropdownSelect = (_event) => {
    this.setState({
      isKebabDropdownOpen: !this.state.isKebabDropdownOpen,
    })
  }

  onLanguageDropdownToggle = (isLanguageDropdownOpen) => {
    this.setState({
      isLanguageDropdownOpen,
    })
  }

  onLanguageDropdownSelect = (_event) => {
    this.setState({
      isLanguageDropdownOpen: !this.state.isLanguageDropdownOpen,
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
          if (!sItem.isSeparator) {
            allRoutes.push(<Route key={sItem.to} exact path={sItem.to} component={sItem.component} />)
          }
        })
      } else if (!item.isSeparator) {
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
    const { location, t } = this.props

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
        if (m.isSeparator) {
          return <NavItemSeparator key={m.id} />
        } else {
          return (
            <NavItem
              key={m.id}
              itemId={m.id}
              to={m.to}
              isActive={menuSelection === m.id}
              preventDefault={true}
            >
              {t(m.title)}
            </NavItem>
          )
        }
      })
      return sMenus
    }

    const PageNav = (
      <Nav onSelect={this.onMenuSelect} aria-label="Nav" theme="dark">
        <NavList>
          {routes.map((m) => {
            if (m.children && m.children.length > 0) {
              return (
                <NavExpandable key={m.id} groupId={m.id} title={t(m.title)}>
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
                  {t(m.title)}
                </NavItem>
              )
            }
          })}
        </NavList>
      </Nav>
    )

    const notificationDrawer = <NotificationContainer />

    const kebabDropdownItems = [
      <DropdownItem
        key="settings"
        onClick={() => {
          r(this.props.history, rMap.settings.system)
        }}
      >
        <CogIcon /> {t("settings")}
      </DropdownItem>,
      <DropdownItem key="documentation" href={this.props.documentationUrl} target="_blank">
        <BookIcon /> {t("documentation")}
      </DropdownItem>,
      <DropdownItem key="source-code" href={URL_SOURCE_CODE} target="_blank">
        <GithubIcon /> {t("source_code")}
      </DropdownItem>,
      <DropdownItem key="forum" href={URL_FORUM} target="_blank">
        <ChatIcon /> {t("forum")}
      </DropdownItem>,
      <DropdownItem key="about" onClick={this.props.showAbout}>
        <InfoAltIcon /> {t("about")}
      </DropdownItem>,
    ]

    const languages = languageList.map((l) => {
      return (
        <DropdownItem key={`lang_${l.lng}`}>
          <Tooltip position="left" content={l.country_code}>
            <span>{l.flag} </span>
          </Tooltip>
          {l.title}
        </DropdownItem>
      )
    })
    const userDropdownItems = [
      <DropdownGroup key="group2">
        <DropdownItem
          key="group2_profile"
          onClick={() => {
            r(this.props.history, rMap.settings.profile)
          }}
        >
          <UserIcon /> {t("profile")}
        </DropdownItem>
        <DropdownItem key="group2_logout" onClick={this.props.doLogout}>
          <PowerOffIcon /> {t("logout")}
        </DropdownItem>
      </DropdownGroup>,
    ]

    const headerTools = (
      <PageHeaderTools>
        <PageHeaderToolsGroup key="spinner">
          {this.props.showGlobalSpinner ? <HeaderSpinner size="lg" /> : null}
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
              onSelect={this.onLanguageDropdownSelect}
              isOpen={this.state.isLanguageDropdownOpen}
              toggle={
                <DropdownToggle
                  className="language_icon"
                  toggleIndicator={null}
                  onToggle={this.onLanguageDropdownToggle}
                  icon={<LanguageIcon size="md" />}
                />
              }
              dropdownItems={languages}
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
                  <span className="mc-mobile-view">{this.props.userDetail.fullName}</span>
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
          <>
            <Brand className="mc-header-logo" src={logoMain} alt="MyController" />
            <TextContent className="rb-logo-text mc-mobile-view">
              <Text component={TextVariants.h3}>
                MyController.org
                <div
                  style={{
                    marginTop: "-5px",
                    fontSize: "10px",
                    fontWeight: "100",
                  }}
                >
                  The Open Source Controller
                </div>
              </Text>
            </TextContent>
          </>
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
        <AboutPage />
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
          <ErrorBoundary hasMargin>{this.renderContent()}</ErrorBoundary>
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
  userDetail: state.entities.auth.user,
  documentationUrl: state.entities.about.documentationUrl,
})

const mapDispatchToProps = (dispatch) => ({
  onNotificationBadgeClick: () => dispatch(notificationDrawerToggle()),
  showAbout: () => dispatch(aboutShow()),
  doLogout: () => dispatch(clearAuth()),
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(PageLayoutExpandableNav))
)
