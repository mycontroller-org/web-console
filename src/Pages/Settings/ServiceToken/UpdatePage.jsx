import { Alert, ClipboardCopy, Modal, ModalVariant } from "@patternfly/react-core"
import objectPath from "object-path"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import Loading from "../../../Components/Loading/Loading"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { DataType, FieldType } from "../../../Constants/Form"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { withTranslation } from "react-i18next"

class UpdatePage extends React.Component {
  state = {
    loading: false,
    showToken: false,
    token: "",
  }

  displayToken = (token) => {
    this.setState({ showToken: true, token: token })
  }

  hideToken = () => {
    this.setState({ showToken: false }, () => {
      this.redirectCallBack()
    })
  }

  redirectCallBack = () => {
    r(this.props.history, rMap.settings.serviceToken.list)
  }

  componentDidMount() {}

  render() {
    const { loading, showToken, token } = this.state

    if (loading) {
      return <Loading key="loading" />
    }

    const { id } = this.props.match.params
    const { cancelFn = () => {}, t } = this.props

    const isNewEntry = id === undefined || id === ""

    const tokenModal = (
      <Modal
        variant={ModalVariant.large}
        isOpen={showToken}
        aria-label="no_header_footer"
        aria-describedby="modal-no-header-description"
        onClose={this.hideToken}
        title={t("service_token_copy_title")}
      >
        <ClipboardCopy isReadOnly hoverTip={t("copy")} clickTip={t("copied")}>
          {token}
        </ClipboardCopy>
        <Alert
          style={{ marginTop: "10px" }}
          variant="warning"
          isInline
          title={t("service_token_copy_warning_msg")}
        />
      </Modal>
    )

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.serviceToken.get}
        apiSaveRecord={isNewEntry ? api.serviceToken.create : api.serviceToken.update}
        minimapEnabled
        onSaveRedirectFunc={(_data, saveResponse = {}) => {
          if (id) {
            cancelFn()
          } else {
            if (isNewEntry) {
              this.displayToken(saveResponse.token ? saveResponse.token : t("service_not_generated"))
            } else {
              this.redirectCallBack()
            }
          }
        }}
        onCancelFunc={() => {
          if (id) {
            cancelFn()
          } else {
            this.redirectCallBack()
          }
        }}
        getFormItems={(rootObject) => getFormItems(rootObject)}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="add_a_service_token" />
          <PageContent hasNoPaddingTop>
            {editor}
            {isNewEntry ? tokenModal : null}
          </PageContent>
        </>
      )
    }
    return editor
  }
}

export default withTranslation()(UpdatePage)

// support functions

const getFormItems = (rootObject) => {
  // default values
  objectPath.set(rootObject, "neverExpire", true, true)

  const neverExpire = objectPath.get(rootObject, "neverExpire", false)

  // do not set id, new id will be updated on the server side
  const items = [
    {
      label: "id",
      fieldId: "id",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
      isDisabled: true,
    },
    {
      label: "description",
      fieldId: "description",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_name",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "never_expire",
      fieldId: "neverExpire",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
      resetFields: { expiresOn: "" },
    },
  ]

  if (!neverExpire) {
    items.push({
      label: "expires_on",
      fieldId: "expiresOn",
      fieldType: FieldType.DatePicker,
      dataType: DataType.String,
      value: {},
      isRequired: true,
      validated: "default",
    })
  }

  items.push(
    {
      label: "labels",
      fieldId: "!labels",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "labels",
      fieldType: FieldType.Labels,
      dataType: DataType.Object,
      value: {},
      validated: "default",
      validator: { isLabel: {} },
    }
  )

  return items
}
