import {
  ListItem,
  LoginFooterItem,
  LoginForm,
  LoginMainFooterBandItem,
  LoginPage,
} from "@patternfly/react-core"
import { ExclamationCircleIcon } from "@patternfly/react-icons"
import React from "react"
import { connect } from "react-redux"
import htmlParser from "html-react-parser"
import logoBackground from "../Logo/mc-black-login-page.svg"
import displayLogo from "../Logo/mc-white-full.svg"
import { api } from "../Service/Api"
import { authSuccess } from "../store/entities/auth"
import { getValue } from "../Util/Util"
import "./Login.scss"

class SimpleLoginPage extends React.Component {
  state = {
    showHelperText: false,
    usernameValue: "",
    isValidUsername: true,
    passwordValue: "",
    isValidPassword: true,
    isRememberMeChecked: false,
    isLoginButtonDisabled: false,
    loginData: { message: "Fetching...", serverMessage: "" },
  }

  componentDidMount() {
    api.status
      .get()
      .then((res) => {
        const loginData = getValue(res.data, "login", { message: "No message set for login" })
        this.setState({ loginData: loginData })
      })
      .catch((_e) => {
        this.setState({ loginData: { message: "Error on fetching login message" } })
      })
  }

  handleUsernameChange = (value) => {
    this.setState({ usernameValue: value })
  }

  handlePasswordChange = (passwordValue) => {
    this.setState({ passwordValue })
  }

  onRememberMeClick = () => {
    this.setState({ isRememberMeChecked: !this.state.isRememberMeChecked })
  }

  onLoginButtonClick = (event) => {
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

  render() {
    const { message: loginMessage, serverMessage } = this.state.loginData
    let loginText = loginMessage
    if (serverMessage !== undefined && serverMessage !== "") {
      loginText = `
        <p>${loginMessage}</p><br>
        <p><b>System Message</b></p>
        <p>${serverMessage}</p>
      `
    }
    loginText = htmlParser(loginText)

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
          <LoginFooterItem href="https://v2.mycontroller.org/docs/">Help</LoginFooterItem>
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
        textContent={loginText}
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
