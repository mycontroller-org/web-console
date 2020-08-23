import React from "react"
//import brandImg from './brandImgColor.svg';
import {
  LoginFooterItem,
  LoginForm,
  LoginMainFooterBandItem,
  LoginMainFooterLinksItem,
  LoginPage,
  BackgroundImageSrc,
  ListItem,
} from "@patternfly/react-core"
import { ExclamationCircleIcon } from "@patternfly/react-icons"

export default class SimpleLoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showHelperText: false,
      usernameValue: "",
      isValidUsername: true,
      passwordValue: "",
      isValidPassword: true,
      isRememberMeChecked: false,
    }

    this.handleUsernameChange = (value) => {
      this.setState({ usernameValue: value })
    }

    this.handlePasswordChange = (passwordValue) => {
      this.setState({ passwordValue })
    }

    this.onRememberMeClick = () => {
      this.setState({ isRememberMeChecked: !this.state.isRememberMeChecked })
    }

    this.onLoginButtonClick = (event) => {
      event.preventDefault()
      this.setState({ isValidUsername: !!this.state.usernameValue })
      this.setState({ isValidPassword: !!this.state.passwordValue })
      this.setState({ showHelperText: !this.state.usernameValue || !this.state.passwordValue })
    }
  }

  render() {
    const helperText = (
      <React.Fragment>
        <ExclamationCircleIcon />
        &nbsp;Invalid login credentials.
      </React.Fragment>
    )

    const forgotCredentials = (
      <LoginMainFooterBandItem>
        <a href="#">Forgot username or password?</a>
      </LoginMainFooterBandItem>
    )

    const listItem = (
      <React.Fragment>
        <ListItem>
          <LoginFooterItem href="#">Terms of Use </LoginFooterItem>
        </ListItem>
        <ListItem>
          <LoginFooterItem href="#">Help</LoginFooterItem>
        </ListItem>
        <ListItem>
          <LoginFooterItem href="#">Privacy Policy</LoginFooterItem>
        </ListItem>
      </React.Fragment>
    )

    const loginForm = (
      <LoginForm
        showHelperText={this.state.showHelperText}
        helperText={helperText}
        //helperTextIcon={<ExclamationCircleIcon />}
        usernameLabel="Username"
        usernameValue={this.state.usernameValue}
        onChangeUsername={this.handleUsernameChange}
        isValidUsername={this.state.isValidUsername}
        passwordLabel="Password"
        passwordValue={this.state.passwordValue}
        onChangePassword={this.handlePasswordChange}
        isValidPassword={this.state.isValidPassword}
        isRememberMeChecked={this.state.isRememberMeChecked}
        onChangeRememberMe={this.onRememberMeClick}
        onLoginButtonClick={this.onLoginButtonClick}
      />
    )

    const images = {
      lg: "/assets/images/pfbg_1200.jpg",
      sm: "/assets/images/pfbg_768.jpg",
      sm2x: "/assets/images/pfbg_768@2x.jpg",
      xs: "/assets/images/pfbg_576.jpg",
      xs2x: "/assets/images/pfbg_576@2x.jpg",
    }

    return (
      <LoginPage
        footerListVariants="inline"
        // brandImgSrc={brandImg2}
        brandImgAlt="PatternFly logo"
        backgroundImgSrc={images}
        backgroundImgAlt="Images"
        footerListItems={listItem}
        textContent="This is placeholder text only. Use this area to place any information or introductory message about your application that may be relevant to users."
        loginTitle="Log in to your account"
        forgotCredentials={forgotCredentials}
      >
        {loginForm}
      </LoginPage>
    )
  }
}
