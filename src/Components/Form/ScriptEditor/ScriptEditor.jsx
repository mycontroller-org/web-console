import { Button, Modal, ModalVariant, Stack, StackItem } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import React from "react"
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary"
import PropTypes from "prop-types"
import ActionBar from "../../ActionBar/ActionBar"
import CodeEditorBasic from "../../CodeEditor/CodeEditorBasic"

class ScriptEditor extends React.Component {
  state = {
    isOpen: false,
  }
  editorRef = React.createRef()

  handleEditorOnMount = (editor, _monaco) => {
    this.editorRef.current = editor
  }

  onSaveClick = () => {
    if (this.props.onSaveFunc) {
      const codeString = this.editorRef.current.getValue()
      this.props.onSaveFunc(codeString)
    }
    this.onClose()
  }

  onClose = () => {
    this.setState({ isOpen: false })
  }

  onOpen = () => {
    this.setState({ isOpen: true })
  }

  render() {
    const { isOpen } = this.state
    const {
      id,
      name,
      value,
      saveButtonText,
      language = "javascript",
      options,
      minimapEnabled,
      readOnly,
    } = this.props

    const otherOptions = options ? options : {}

    const basicOptions = {
      readOnly: readOnly,
      minimap: { enabled: minimapEnabled },
    }

    const finalOptions = {
      ...basicOptions,
      ...otherOptions,
    }

    const content = []

    content.push(
      <CodeEditorBasic
        key={"code-editor"}
        // height={this.props.height}
        language={language}
        data={value}
        options={finalOptions}
        handleEditorOnMount={this.handleEditorOnMount}
      />
    )

    const errorMessage = ""

    const saveText = saveButtonText ? saveButtonText : "Save"

    const actionButtons = [
      { text: saveText, variant: "primary", onClickFunc: this.onSaveClick, isDisabled: false },
    ]
    actionButtons.push({
      text: "Cancel",
      variant: "secondary",
      onClickFunc: this.onClose,
      isDisabled: false,
    })

    return (
      <>
        <Button key={"edit-btn-" + id} variant="secondary" isBlock onClick={this.onOpen}>
          Update Script &nbsp;
          <EditIcon />
        </Button>
        <Modal
          key={"edit-script-data" + id}
          title={name}
          variant={ModalVariant.medium}
          position="top"
          isOpen={isOpen}
          onClose={this.onClose}
          onEscapePress={this.onClose}
        >
          <ErrorBoundary>
            <Stack hasGutter>
              <StackItem isFilled>{content}</StackItem>
              <StackItem>{errorMessage}</StackItem>
              <StackItem>
                <ActionBar leftBar={actionButtons} />
              </StackItem>
            </Stack>
          </ErrorBoundary>
        </Modal>
      </>
    )
  }
}

ScriptEditor.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onSaveFunc: PropTypes.func,
  saveButtonText: PropTypes.string,
  language: PropTypes.string,
  minimapEnabled: PropTypes.bool,
  options: PropTypes.object,
}

export default ScriptEditor
