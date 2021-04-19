import { Alert, Button, FileUpload, Form, FormGroup, Grid, Stack } from "@patternfly/react-core"
import React from "react"
import { api } from "../../../Service/Api"

import "./Upload.scss"

const defaultSettings = {
  maxSize: 6291456, // 6 MiB = 6 * 1024 * 1024
  minSize: 10, // 10 bytes
}

const fileExtensions = ["hex", "bin"]

class FirmwareFileUpload extends React.Component {
  state = {
    loading: false,
    value: null,
    filename: "",
    disableUpload: true,
    rejected: false,
    uploadSuccess: false,
  }

  resetAll = () => {
    this.setState({
      value: null,
      filename: "",
      disableUpload: true,
      rejected: false,
      loading: false,
      uploadSuccess: false,
    })
  }

  onFileChange = (value, filename, event) => {
    if (event.type !== "click") {
      const filenameLower = filename.toLowerCase()
      let isValidExtension = false
      for (let index = 0; index < fileExtensions.length; index++) {
        const exten = fileExtensions[index]
        if (filenameLower.endsWith(exten)) {
          isValidExtension = true
          break
        }
      }

      console.log(value)

      if (isValidExtension) {
        this.setState({
          value: value,
          filename: filename,
          disableUpload: false,
          rejected: false,
          uploadSuccess: false,
        })
      } else {
        this.setState({
          value: null,
          filename: "",
          disableUpload: true,
          rejected: true,
          uploadSuccess: false,
        })
      }
    } else {
      this.resetAll()
    }
  }

  onUpload = (value, filename) => {
    this.setState({ loading: true }, () => {
      const { resourceId } = this.props
      let formData = new FormData()
      formData.append("file", value, filename)
      const headers = {
        "Content-Type": "multipart/form-data",
      }
      api.firmware
        .upload(resourceId, formData, headers)
        .then((_res) => {
          // File upload success
          this.setState({ loading: false, uploadSuccess: true, disableUpload: true })
        })
        .catch((_err) => {
          // file upload failed
          this.resetAll()
        })
    })
  }

  render() {
    const { loading, value, filename, disableUpload, rejected, uploadSuccess } = this.state
    const successMessage = uploadSuccess ? (
      <Alert variant="success" isInline title="File uploaded successfully" />
    ) : null
    return (
      <Grid lg={7} md={9} sm={12}>
        <div className="mc-firmware-upload">
          <Stack hasGutter>
            <Form isHorizontal>
              <FormGroup
                label="Firmware File"
                fieldId="firmware-file"
                helperTextInvalid="Invalid file"
                validated={rejected ? "error" : "default"}
              >
                <FileUpload
                  isDisabled={loading}
                  id="firmware-file"
                  value={value}
                  filename={filename}
                  onChange={this.onFileChange}
                  onDrop={this.onDrop}
                  dropzoneProps={defaultSettings}
                />
              </FormGroup>
            </Form>
            {successMessage}
            <div>
              <Button
                variant="secondary"
                onClick={() => this.onUpload(value, filename)}
                isDisabled={disableUpload || rejected || loading}
              >
                Upload
              </Button>
            </div>
          </Stack>
        </div>
      </Grid>
    )
  }
}

export default FirmwareFileUpload
