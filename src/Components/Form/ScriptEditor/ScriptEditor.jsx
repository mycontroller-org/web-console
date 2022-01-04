import { Button, Modal, ModalVariant, Stack, StackItem } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import PropTypes from "prop-types"
import React from "react"
import { withTranslation } from "react-i18next"
import { toObject, toString } from "../../../Util/Language"
import ActionBar from "../../ActionBar/ActionBar"
import CodeEditorBasic from "../../CodeEditor/CodeEditorBasic"
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary"

class ScriptEditor extends React.Component {
  state = {
    isOpen: false,
  }
  editorRef = React.createRef()

  handleEditorOnMount = (editor, _monaco) => {
    this.editorRef.current = editor
  }

  onSaveClick = () => {
    const { onSaveFunc, language } = this.props
    if (onSaveFunc) {
      const codeString = this.editorRef.current.getValue()
      const formattedData = toObject(language, codeString)
      onSaveFunc(formattedData)
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
      updateButtonText,
      language = "javascript",
      options,
      minimapEnabled,
      readOnly,
      t,
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

    const valueString = toString(language, value)

    content.push(
      <CodeEditorBasic
        key={"code-editor"}
        // height={this.props.height}
        language={language}
        data={valueString}
        options={finalOptions}
        handleEditorOnMount={this.handleEditorOnMount}
      />
    )

    const errorMessage = ""

    const saveText = t(saveButtonText ? saveButtonText : "save")
    const updateBtnText = t(updateButtonText ? updateButtonText : "update_script")

    const actionButtons = [
      { text: saveText, variant: "primary", onClickFunc: this.onSaveClick, isDisabled: false },
    ]
    actionButtons.push({
      text: t("cancel"),
      variant: "secondary",
      onClickFunc: this.onClose,
      isDisabled: false,
    })

    return (
      <ErrorBoundary>
        <Button key={"edit-btn-" + id} variant="secondary" isBlock onClick={this.onOpen}>
          {updateBtnText} &nbsp;
          <EditIcon />
        </Button>
        <Modal
          key={"edit-script-data" + id}
          title={name}
          variant={ModalVariant.large}
          position="top"
          isOpen={isOpen}
          onClose={this.onClose}
          onEscapePress={this.onClose}
        >
          <Stack hasGutter>
            <StackItem isFilled>{content}</StackItem>
            <StackItem>{errorMessage}</StackItem>
            <StackItem>
              <ActionBar leftBar={actionButtons} />
            </StackItem>
          </Stack>
        </Modal>
      </ErrorBoundary>
    )
  }
}

ScriptEditor.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onSaveFunc: PropTypes.func,
  saveButtonText: PropTypes.string,
  updateButtonText: PropTypes.string,
  language: PropTypes.string,
  minimapEnabled: PropTypes.bool,
  options: PropTypes.object,
}

export default withTranslation()(ScriptEditor)
