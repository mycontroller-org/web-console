import { Stack, StackItem } from "@patternfly/react-core"
import YAML from "js-yaml"
import PropTypes from "prop-types"
import React from "react"
import ActionBar from "../ActionBar/ActionBar"
import CodeEditor from "../CodeEditor/CodeEditor"
import "./DetailBase.scss"

class YamlBase extends React.Component {
  state = {
    loading: true,
    dataOriginal: {},
  }
  editorRef = React.createRef()

  componentDidMount() {
    this.onReloadClick()
  }

  onReloadClick = () => {
    let id = this.props.match && this.props.match.params ? this.props.match.params.id : null
    if (id) {
      this.props
        .apiGetRecord(id)
        .then((res) => {
          this.setState({ dataOriginal: res.data, loading: false }, () => {
            this.updateEditorValue(res.data)
          })
        })
        .catch((_e) => {
          this.setState({ loading: false })
        })
    } else {
      this.setState({ loading: false, dataOriginal: null })
    }
  }

  updateEditorValue = (data) => {
    if (this.editorRef.current) {
      const yamlString = YAML.safeDump(data)
      this.editorRef.current.setValue(yamlString)
    }
  }

  onSaveClick = () => {
    if (this.props.apiSaveRecord) {
      const yamlString = this.editorRef.current.getValue()
      const data = YAML.safeLoad(yamlString)
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

    const yamlString = dataOriginal ? YAML.safeDump(dataOriginal) : ""

    const options = this.props.options ? this.props.options : {}

    const actionButtons = [
      { text: "Save", variant: "primary", onClickFunc: this.onSaveClick, isDisabled: false },
      { text: "Reload", variant: "secondary", onClickFunc: this.onReloadClick, isDisabled: false },
    ]

    return (
      <Stack hasGutter>
        <StackItem>
          <CodeEditor
            height={this.props.height}
            language="yaml"
            data={yamlString}
            options={options}
            handleEditorDidMount={this.handleEditorDidMount}
          />
        </StackItem>
        <StackItem>
          <ActionBar leftBar={actionButtons} />
        </StackItem>
      </Stack>
    )
  }
}

YamlBase.propTypes = {
  apiGetRecord: PropTypes.func,
  apiSaveRecord: PropTypes.func,
  options: PropTypes.object,
}

export default YamlBase
