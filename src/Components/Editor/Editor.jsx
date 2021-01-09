import { Alert, Divider, Flex, Grid, Radio, Stack, StackItem } from "@patternfly/react-core"
import YAML from "js-yaml"
import PropTypes from "prop-types"
import React from "react"
import ActionBar from "../ActionBar/ActionBar"
import { updateItems, updateRootObject } from "../Form/Functions"
import CodeEditorBasic from "../CodeEditor/CodeEditorBasic"
import { Form } from "../Form/Form"
import "./Editor.scss"
import { validate, validateItem } from "../../Util/Validator"

class Editor extends React.Component {
  state = {
    loading: true,
    isReloadable: false,
    rootObject: {},
    formView: true,
    inValidItems: [],
  }
  editorRef = React.createRef()

  handleEditorDidMount = (_valueGetter, editor) => {
    this.editorRef.current = editor
  }

  componentDidMount() {
    this.onReloadClick()
  }

  onReloadClick = () => {
    if (this.props.resourceId) {
      this.props
        .apiGetRecord(this.props.resourceId)
        .then((res) => {
          const rootObject = res.data
          this.updateStateWithRootObject(rootObject, true)
        })
        .catch((_e) => {
          this.setState({ loading: false, isReloadable: true })
        })
    } else if (this.props.rootObject) {
      this.updateStateWithRootObject(this.props.rootObject)
    } else {
      this.setState({ loading: false, rootObject: {}, isReloadable: false })
    }
  }

  updateStateWithRootObject = (rootObject, isReloadable = false) => {
    this.setState(
      (prevState) => {
        // validate fields
        const { inValidItems } = prevState
        const formItems = this.getUpdatedFormItems(rootObject, inValidItems)
        formItems.forEach((item) => {
          updateInValidList(inValidItems, item, item.value)
        })
        return {
          rootObject: rootObject,
          inValidItems: inValidItems,
          loading: false,
          isReloadable: isReloadable,
        }
      },
      () => {
        if (this.editorRef.current) {
          const codeString = toString(this.props.language, rootObject)
          this.editorRef.current.setValue(codeString)
        }
      }
    )
  }

  onViewChange = () => {
    this.setState((prevState) => {
      if (!prevState.formView) {
        const data = toObject(this.props.language, this.editorRef.current.getValue())
        return { formView: !prevState.formView, rootObject: data }
      }
      return { formView: !prevState.formView }
    })
  }

  onFormValueChange = (item, newValue) => {
    this.setState((prevState) => {
      const { rootObject, inValidItems } = prevState
      updateRootObject(rootObject, item, newValue)
      updateInValidList(inValidItems, item, newValue)
      if (this.props.onChangeFunc) {
        this.props.onChangeFunc(rootObject)
      }
      return { rootObject: rootObject, inValidItems: inValidItems }
    })
  }

  onSaveClick = () => {
    if (this.props.apiSaveRecord || this.props.onSaveFunc) {
      this.setState((prevState) => {
        const { formView, rootObject, inValidItems } = prevState
        let data = {}
        if (formView) {
          // validate fields
          const formItems = this.getUpdatedFormItems(rootObject, inValidItems)
          formItems.forEach((item) => {
            updateInValidList(inValidItems, item, item.value)
          })
          if (inValidItems.length > 0) {
            return { inValidItems: inValidItems }
          }
          data = rootObject
        } else {
          const codeString = this.editorRef.current.getValue()
          data = toObject(this.props.language, codeString)
        }
        if (this.props.apiSaveRecord) {
          this.props
            .apiSaveRecord(data)
            .then((_res) => {
              this.callOnSaveRedirect()
            })
            .catch((_e) => {})
        } else if (this.props.onSaveFunc) {
          this.props.onSaveFunc(data)
          this.callOnSaveRedirect()
        }
      })
      return {}
    }
  }

  callOnSaveRedirect = () => {
    if (this.props.onSaveRedirectFunc) {
      this.props.onSaveRedirectFunc()
    }
  }

  getUpdatedFormItems = (rootObject, inValidItems) => {
    if (this.props.getFormItems) {
      const formItems = this.props.getFormItems(rootObject)
      updateItems(rootObject, formItems)
      updateValidations(formItems, inValidItems) // update validations
      return formItems
    }
    return []
  }

  render() {
    const { loading, rootObject, formView, isReloadable, inValidItems } = this.state

    if (loading) {
      return <div>Loading...</div>
    }

    const content = []

    if (formView) {
      // update items with root object
      const formItems = this.getUpdatedFormItems(rootObject, inValidItems)

      content.push(
        <Form
          key="form-view"
          isHorizontal
          isWidthLimited={this.props.isWidthLimited}
          items={formItems}
          onChange={this.onFormValueChange}
        />
      )
    } else {
      const codeString = toString(this.props.language, rootObject)

      const otherOptions = this.props.otherOptions ? this.props.otherOptions : {}

      const basicOptions = {
        readOnly: this.props.readOnly,
        minimap: { enabled: this.props.minimapEnabled },
      }

      const options = {
        ...basicOptions,
        ...otherOptions,
      }

      content.push(
        <CodeEditorBasic
          key="code-editor"
          height={this.props.height}
          language={this.props.language}
          data={codeString}
          options={options}
          handleEditorDidMount={this.handleEditorDidMount}
        />
      )
    }

    let saveDisabled = false

    if (formView && inValidItems.length > 0) {
      saveDisabled = true
    }

    const actionButtons = [
      { text: "Save", variant: "primary", onClickFunc: this.onSaveClick, isDisabled: saveDisabled },
    ]

    if (isReloadable) {
      actionButtons.push({
        text: "Reload",
        variant: "secondary",
        onClickFunc: this.onReloadClick,
        isDisabled: false,
      })
    }

    if (this.props.onCancelFunc) {
      actionButtons.push({
        text: "Cancel",
        variant: "secondary",
        onClickFunc: this.props.onCancelFunc,
        isDisabled: false,
      })
    }

    const rightBar = formView
      ? []
      : [{ text: "Download", variant: "secondary", onClickFunc: () => {}, isDisabled: true }]

    let errorMessage = null
    if (formView && inValidItems.length > 0) {
      errorMessage = (
        <Grid lg={7} md={9} sm={12}>
          <Alert variant="danger" isInline title="Check the error and/or mandatory(*) fields" />
        </Grid>
      )
    }

    return (
      <div className="mc-editor">
        <Stack hasGutter>
          <StackItem>
            <Flex style={{ paddingBottom: "5px" }}>
              <span>
                <strong>Configure via:</strong>
              </span>
              <Radio isChecked={formView} onChange={this.onViewChange} label="Form View" id="form-view" />
              <Radio isChecked={!formView} onChange={this.onViewChange} label="YAML View" id="yaml-view" />
            </Flex>
            <Divider component="hr" />
          </StackItem>
          <StackItem>{content}</StackItem>
          <StackItem>{errorMessage}</StackItem>
          <StackItem>
            <ActionBar leftBar={actionButtons} rightBar={rightBar} />
          </StackItem>
        </Stack>
      </div>
    )
  }
}

Editor.propTypes = {
  resourceId: PropTypes.string,
  apiGetRecord: PropTypes.func,
  apiSaveRecord: PropTypes.func,
  rootObject: PropTypes.object,
  onChangeFunc: PropTypes.func,
  onSaveFunc: PropTypes.func,
  onSaveRedirectFunc: PropTypes.func, // on successful save called this redirect will be called
  onCancelFunc: PropTypes.func,
  language: PropTypes.string,
  minimapEnabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  otherOptions: PropTypes.object,
  getFormItems: PropTypes.func,
  isWidthLimited: PropTypes.bool,
}

export default Editor

// helper functions

const toString = (language = "yaml", data = {}) => {
  if (data === undefined || data === "" || Object.keys(data).length === 0) {
    return ""
  }

  switch (language) {
    case "yaml":
      return YAML.safeDump(data)
    case "json":
      return JSON.stringify(data)
    default:
      return Object.toString(data)
  }
}

const toObject = (language = "", data = "") => {
  if (data === undefined || data === "") {
    return {}
  }
  switch (language) {
    case "yaml":
      return YAML.safeLoad(data)
    case "json":
      return JSON.parse(data)
    default:
      return { error: "language '" + language + "' not supported" }
  }
}

const updateValidations = (items, inValidItems) => {
  items.forEach((item) => {
    if (inValidItems.indexOf(item.fieldId) !== -1) {
      item.validated = "error"
    } else {
      item.validated = "default"
    }
  })
}

const updateInValidList = (inValidItems, item, value) => {
  const isValid = validateItem(item, value)
  let makeInvalid = false

  if (isValid) {
    if (item.isRequired) {
      const isEmpty = validate("isEmpty", value, {})
      if (isEmpty) {
        makeInvalid = true
      }
    }
    if (inValidItems.indexOf(item.fieldId) !== -1 && !makeInvalid) {
      inValidItems.splice(inValidItems.indexOf(item.fieldId), 1)
    }
  } else {
    makeInvalid = true
  }

  if (makeInvalid) {
    if (inValidItems.indexOf(item.fieldId) === -1) {
      inValidItems.push(item.fieldId)
    }
  }
}
