import Editor, { monaco } from "@monaco-editor/react"
import React from "react"

monaco
  .init()
  .then((monaco) => {
    monaco.editor.defineTheme("console", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "number", foreground: "ace12e" },
        { token: "type", foreground: "73bcf7" },
        { token: "string", foreground: "f0ab00" },
        { token: "keyword", foreground: "cbc0ff" },
      ],
      colors: {
        "editor.background": "#151515",
        "editorGutter.background": "#292e34",
        "editorLineNumber.activeForeground": "#fff",
        "editorLineNumber.foreground": "#f0f0f0",
      },
    })
  })
  .catch((error) => console.error("An error occurred during initialization of Monaco: ", error))

const defaultOptions = {
  selectOnLineNumbers: true,
  scrollBeyondLastLine: false,
  contextmenu: true,
  autoIndent: "full",
  cursorBlinking: "phase",
  smoothScrolling: true,
  tabSize: 2,
  fontSize: 15,
  minimap: {
    enabled: false,
  },
  readOnly: true,
}

const editor = ({
  language = "yaml",
  options = {},
  height = "71vh",
  data = "",
  handleEditorDidMount = () => {},
}) => {
  const finalOptions = {
    ...defaultOptions, // default options
    ...options, // supplied options
  }
  return (
    <Editor
      height={height}
      language={language}
      theme="console"
      value={data}
      options={finalOptions}
      editorDidMount={handleEditorDidMount}
    />
  )
}

export default editor
