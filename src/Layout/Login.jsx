import {
  ListItem,
  LoginFooterItem,
  LoginForm,
  LoginMainFooterBandItem,
  LoginPage
} from "@patternfly/react-core"
import { ExclamationCircleIcon } from "@patternfly/react-icons"
import React from "react"
import { connect } from "react-redux"
import logoBackground from "../Logo/mc-black-login-page.svg"
import displayLogo from "../Logo/mc-white-full.svg"
import { api } from "../Service/Api"
import { authSuccess } from "../store/entities/auth"
import "./Login.scss"

class SimpleLoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showHelperText: false,
      usernameValue: "",
      isValidUsername: true,
      passwordValue: "",
      isValidPassword: true,
      isRememberMeChecked: false,
      isLoginButtonDisabled: false,
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
      this.setState({ isLoginButtonDisabled: true })
      const loginData = {
        username: this.state.usernameValue,
        password: this.state.passwordValue,
      }
      api.auth
        .login(loginData)
        .then((res) => {
          const user = { ...res.data }
          this.props.updateSuccessLogin(user)
        })
        .catch((e) => {
          this.setState({
            isValidUsername: false,
            isValidPassword: false,
            showHelperText: true,
            isLoginButtonDisabled: false,
          })
        })
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
        rememberMeLabel="Keep me logged in for 30 days."
        isRememberMeChecked={this.state.isRememberMeChecked}
        onChangeRememberMe={this.onRememberMeClick}
        onLoginButtonClick={this.onLoginButtonClick}
        isLoginButtonDisabled={this.state.isLoginButtonDisabled}
      />
    )

    return (
      <LoginPage
        footerListVariants="inline"
        brandImgSrc={displayLogo}
        brandImgAlt="MyController.org"
        className="mc-login"
        backgroundImgSrc={logoBackground}
        backgroundImgAlt="Images"
        footerListItems={listItem}
        textContent="This is placeholder text only. Use this area to place any information or introductory message about your application that may be relevant to users."
        loginTitle="Welcome to MyController.org"
        loginSubtitle="Login to your account"
        forgotCredentials={forgotCredentials}
      >
        {loginForm}
      </LoginPage>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  updateSuccessLogin: (data) => dispatch(authSuccess(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SimpleLoginPage)
