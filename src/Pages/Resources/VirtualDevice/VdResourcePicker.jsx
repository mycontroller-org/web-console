import { Button, Modal, ModalVariant } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import objectPath from "object-path"
import PropTypes from "prop-types"
import React from "react"
import { withTranslation } from "react-i18next"
import { DataType, FieldType } from "../../../Constants/Form"
import { FieldDataType, FieldDataTypeOptions, ResourceTypeOptions } from "../../../Constants/ResourcePicker"
import Editor from "../../../Components/Editor/Editor"
import ErrorBoundary from "../../../Components/ErrorBoundary/ErrorBoundary"
import {
  getOptionsDescriptionFunc,
  getResourceFilterFunc,
  getResourceOptionsAPI,
  getResourceOptionValueFunc,
} from "../../../Components/Form/ResourcePicker/ResourceUtils"

class VdResourcePicker extends React.Component {
  state = {
    isOpen: false,
  }

  onClose = () => {
    this.setState({ isOpen: false })
  }

  onOpen = () => {
    this.setState({ isOpen: true })
  }

  render() {
    const { isOpen } = this.state
    const { value, id, name, onChange, t } = this.props
    return (
      <>
        <Button key={"edit-btn-" + id} variant="control" onClick={this.onOpen}>
          <EditIcon />
        </Button>
        <Modal
          key={"edit-field-data" + id}
          title={`${t("update_trait")}: ${name}`}
          variant={ModalVariant.medium}
          position="top"
          isOpen={isOpen}
          onClose={this.onClose}
          onEscapePress={this.onClose}
        >
          <ErrorBoundary>
            <Editor
              key={"editor" + id}
              disableEditor={false}
              language="yaml"
              rootObject={value}
              onSaveFunc={(data) => {
                onChange(data)
                this.onClose()
              }}
              onChangeFunc={() => {}}
              minimapEnabled={false}
              onCancelFunc={this.onClose}
              isWidthLimited={false}
              getFormItems={getItems}
              saveButtonText="update"
            />
          </ErrorBoundary>
        </Modal>
      </>
    )
  }
}

VdResourcePicker.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
}

export default withTranslation()(VdResourcePicker)

const getFieldTypes = () => {
  return FieldDataTypeOptions.filter((t) => {
    switch (t.value) {
      case FieldDataType.TypeResourceByLabels:
      case FieldDataType.TypeResourceByQuickId:
        return true
      default:
        return false
    }
  })
}

const getItems = (rootObject) => {
  const items = []

  items.push({
    label: "type",
    fieldId: "type",
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    value: "",
    isRequired: true,
    isDisabled: false,
    helperText: "",
    helperTextInvalid: "helper_text.invalid_type",
    validated: "default",
    options: getFieldTypes(),
    validator: { isNotEmpty: {} },
    resetFields: { resourceType: "", quickId: "", labels: {} },
  })

  const dataType = objectPath.get(rootObject, "type", FieldDataType.TypeString)

  const resItems = getResourceDataItems(rootObject, dataType)
  items.push(...resItems)

  return items
}

const getResourceDataItems = (rootObject = {}, dataType) => {
  const items = []
  items.push({
    label: "resource_type",
    fieldId: "resourceType",
    fieldType: FieldType.SelectTypeAhead,
    dataType: DataType.String,
    value: "",
    isRequired: true,
    options: ResourceTypeOptions,
    validator: { isNotEmpty: {} },
    resetFields: { quickId: "" },
  })

  const resourceType = objectPath.get(rootObject, "resourceType", "")

  switch (dataType) {
    case FieldDataType.TypeResourceByQuickId:
      if (resourceType !== "") {
        const resourceAPI = getResourceOptionsAPI(resourceType)
        const resourceOptionValueFunc = getResourceOptionValueFunc(resourceType)
        const resourceFilterFunc = getResourceFilterFunc(resourceType)
        const resourceDescriptionFunc = getOptionsDescriptionFunc(resourceType)
        items.push({
          label: "resource",
          fieldId: "quickId",
          apiOptions: resourceAPI,
          optionValueFunc: resourceOptionValueFunc,
          fieldType: FieldType.SelectTypeAheadAsync,
          getFiltersFunc: resourceFilterFunc,
          getOptionsDescriptionFunc: resourceDescriptionFunc,
          dataType: DataType.String,
          value: "",
          isRequired: true,
          options: [],
          validator: { isNotEmpty: {} },
        })
      }
      break

    case FieldDataType.TypeResourceByLabels:
      items.push({
        label: "labels",
        fieldId: "labels",
        fieldType: FieldType.Labels,
        dataType: DataType.Object,
        value: {},
      })
      break

    default:
    // noop
  }

  return items
}
