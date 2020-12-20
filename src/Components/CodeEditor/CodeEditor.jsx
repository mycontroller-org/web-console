import { Stack, StackItem } from "@patternfly/react-core"
import YAML from "js-yaml"
import PropTypes from "prop-types"
import React from "react"
import ActionBar from "../ActionBar/ActionBar"
import CodeEditorBasic from "./CodeEditorBasic"

class CodeEditor extends React.Component {
  state = {
    loading: true,
    dataOriginal: {},
  }
  editorRef = React.createRef()

  componentDidMount() {
    this.onReloadClick()
  }

  onReloadClick = () => {
    if (this.props.resourceId) {
      this.props
        .apiGetRecord(this.props.resourceId)
        .then((res) => {
          this.setState({ dataOriginal: res.data, loading: false }, () => {
            if (this.editorRef.current) {
              const codeString = toString(this.props.language, res.data)
              this.editorRef.current.setValue(codeString)
            }
          })
        })
        .catch((_e) => {
          this.setState({ loading: false })
        })
    } else {
      this.setState({ loading: false, dataOriginal: "" })
    }
  }

  onSaveClick = () => {
    if (this.props.apiSaveRecord) {
      const codeString = this.editorRef.current.getValue()
      const data = toObject(this.props.language, codeString)
      this.props
        .apiSaveRecord(data)
        .then((_res) => {
          if (this.props.onSave) {
            this.props.onSave()
          }
        })
        .catch((_e) => {})
    }
  }

  handleEditorDidMount = (_valueGetter, editor) => {
    this.editorRef.current = editor
  }

  render() {
    const { loading, dataOriginal } = this.state

    if (loading) {
      return <div>Loading</div>
    }

    const codeString = toString(this.props.language, dataOriginal)

    const otherOptions = this.props.otherOptions ? this.props.otherOptions : {}

    const basicOptions = {
      readOnly: this.props.readOnly,
      minimap: { enabled: this.props.minimapEnabled },
    }

    const options = {
      ...basicOptions,
      ...otherOptions,
    }

    const actionButtons = [
      { text: "Save", variant: "primary", onClickFunc: this.onSaveClick, isDisabled: false },
      { text: "Reload", variant: "secondary", onClickFunc: this.onReloadClick, isDisabled: false },
    ]

    if (this.props.onCancelFunc) {
      actionButtons.push({
        text: "Cancel",
        variant: "secondary",
        onClickFunc: this.props.onCancelFunc,
        isDisabled: false,
      })
    }

    const rightBar = [{ text: "Download", variant: "secondary", onClickFunc: () => {}, isDisabled: true }]

    return (
      <Stack hasGutter>
        <StackItem>
          <CodeEditorBasic
            height={this.props.height}
            language={this.props.language}
            data={codeString}
            options={options}
            handleEditorDidMount={this.handleEditorDidMount}
          />
        </StackItem>
        <StackItem>
          <ActionBar leftBar={actionButtons} rightBar={rightBar} />
        </StackItem>
      </Stack>
    )
  }
}

CodeEditor.propTypes = {
  resourceId: PropTypes.string,
  apiGetRecord: PropTypes.func,
  apiSaveRecord: PropTypes.func,
  onCancelFunc: PropTypes.func,
  language: PropTypes.string,
  minimapEnabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  otherOptions: PropTypes.object,
}

export default CodeEditor

// helper functions

const toString = (language = "", data = {}) => {
  if (data === undefined || data === "") {
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
