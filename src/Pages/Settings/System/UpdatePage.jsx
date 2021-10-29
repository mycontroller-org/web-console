import objectPath from "object-path"
import React from "react"
import { connect } from "react-redux"
import Editor from "../../../Components/Editor/Editor"
import { DEFAULT_LANGUAGE } from "../../../Constants/Common"
import { DataType, FieldType } from "../../../Constants/Form"
import { LanguageOptions } from "../../../i18n/languages"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { getValue } from "../../../Util/Util"
import { updateLocale } from "../../../store/entities/locale"
import i18n from "../../../i18n/i18n"

class UpdatePage extends React.Component {
  render() {
    const { id } = this.props.match.params

    const editor = (
      <Editor
        key="editor"
        resourceId={id ? id : "none"}
        language="yaml"
        apiGetRecord={api.settings.getSystemSettings}
        apiSaveRecord={api.settings.updateSystem}
        minimapEnabled
        onSaveRedirectFunc={(data) => {
          // update language in the web UI
          const lng = data.spec.language
          if (lng !== this.props.languageSelected) {
            i18n.changeLanguage(lng)
            this.props.updateLocale({ language: lng })
          }

          r(this.props.history, rMap.dashboard)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.dashboard)
        }}
        getFormItems={getFormItems}
      />
    )

    return editor
  }
}

const mapStateToProps = (state) => ({
  languageSelected: state.entities.locale.language,
})

const mapDispatchToProps = (dispatch) => ({
  updateLocale: (data) => dispatch(updateLocale(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePage)

// support functions

const getFormItems = (rootObject) => {
  const autoUpdate = getValue(rootObject, "spec.geoLocation.autoUpdate", false)
  objectPath.set(rootObject, "spec.language", DEFAULT_LANGUAGE, true)
  const items = [
    {
      label: "geo_location",
      fieldId: "!geo_location",
      fieldType: FieldType.Divider,
    },
    {
      label: "auto_update",
      fieldId: "spec.geoLocation.autoUpdate",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "location_name",
      fieldId: "spec.geoLocation.locationName",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
      isDisabled: autoUpdate,
    },
    {
      label: "latitude",
      fieldId: "spec.geoLocation.latitude",
      fieldType: FieldType.Text,
      dataType: DataType.Float,
      isRequired: !autoUpdate,
      value: "",
      isDisabled: autoUpdate,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_latitude",
      validated: "default",
      validator: autoUpdate ? {} : { isFloat: {}, isNotEmpty: {} },
    },
    {
      label: "longitude",
      fieldId: "spec.geoLocation.longitude",
      fieldType: FieldType.Text,
      dataType: DataType.Float,
      isRequired: !autoUpdate,
      value: "",
      isDisabled: autoUpdate,
      helperText: "",
      helperTextInvalid: "helper_text.invalid_longitude",
      validated: "default",
      validator: autoUpdate ? {} : { isFloat: {}, isNotEmpty: {} },
    },
    {
      label: "login_page",
      fieldId: "!login_page",
      fieldType: FieldType.Divider,
    },
    {
      label: "message",
      fieldId: "spec.login.message",
      fieldType: FieldType.TextArea,
      dataType: DataType.String,
      isRequired: false,
      value: "",
      // rows: 3,
    },
    {
      label: "others",
      fieldId: "!others_page",
      fieldType: FieldType.Divider,
    },
    {
      label: "language",
      fieldId: "spec.language",
      fieldType: FieldType.Select,
      dataType: DataType.String,
      options: LanguageOptions(),
      OptionsTranslationDisabled: true,
      isDisabled: false,
      value: "",
    },
  ]

  return items
}
