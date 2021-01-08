import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Components/Form/Constants"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"

class UpdatePage extends React.Component {
  state = {
    loading: true,
    gateways: [],
  }

  componentDidMount() {
    api.gateway
      .list({})
      .then((res) => {
        const gateways = res.data.data.map((gw) => {
          return { value: gw.id, label: gw.name, description: gw.provider.type }
        })
        this.setState({ loading: false, gateways: gateways })
      })
      .catch((_e) => {
        this.setState({ loading: false })
      })
  }

  render() {
    const { loading, gateways } = this.state

    if (loading) {
      return <span>Loading...</span>
    }

    const { id } = this.props.match.params

    const isNewEntry = id === undefined || id === ""

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.node.get}
        apiSaveRecord={api.node.update}
        minimapEnabled
        onSave={() => {
          r(this.props.history, rMap.resources.node.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.resources.node.list)
        }}
        getFormItems={(rootObject) => getFormItems(rootObject, gateways)}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="Add a Gateway" />
          <PageContent hasNoPaddingTop>{editor} </PageContent>
        </>
      )
    }
    return editor
  }
}

export default UpdatePage

// support functions

const getFormItems = (_rootObject, gateways) => {
  const items = [
    {
      label: "Gateway",
      fieldId: "gatewayId",
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "",
      validated: "default",
      options: gateways,
      validator: { isNotEmpty: {} },
    },
    {
      label: "Node ID",
      fieldId: "nodeId",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid Node ID. isAlphanumeric, chars: min=1 and max=100",
      validated: "default",
      validator: {},
    },
    {
      label: "Name",
      fieldId: "name",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      helperText: "",
      helperTextInvalid: "Invalid name. chars: min=4 and max=100",
      validated: "default",
      validator: { isLength: { min: 4, max: 100 }, isNotEmpty: {} },
    },
    {
      label: "Labels",
      fieldId: "!labels",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "labels",
      fieldType: FieldType.Labels,
      dataType: DataType.Object,
      value: "",
    },
  ]

  return items
}
