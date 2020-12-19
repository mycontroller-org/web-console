import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Grid,
  GridItem
} from "@patternfly/react-core"
import PropTypes from "prop-types"
import React from "react"
import Metrics from "../../Pages/Resources/SensorField/Metrics"
import PageContent from "../PageContent/PageContent"
import Table from "../Table/Table"
import "./DetailBase.scss"

export default class TabDetailsBase extends React.Component {
  state = {
    loading: true,
    data: {},
    graphs: [],
    graphsHeaders: [],
    others: [],
  }

  loadDetail() {
    const { id } = this.props.match.params
    if (id) {
      this.props
        .apiGetRecord(id)
        .then((res) => {
          this.setState({ data: res.data, loading: false })
        })
        .catch((_e) => {
          this.setState({ loading: false })
        })
    }
  }

  wrapField = (key, value) => {
    return (
      <DescriptionListGroup key={key}>
        <DescriptionListTerm>{key}</DescriptionListTerm>
        <DescriptionListDescription>{value}</DescriptionListDescription>
      </DescriptionListGroup>
    )
  }

  wrapCard = (title, fieldsMap) => {
    const content = []
    const fieldMapKeys = Object.keys(fieldsMap)
    fieldMapKeys.map((key) => {
      const fieldsList = fieldsMap[key].map(({ key, value }) => this.wrapField(key, value))
      content.push(
        <DescriptionList key={key} isHorizontal={false}>
          {fieldsList}
        </DescriptionList>
      )
    })
    return (
      <GridItem key={title}>
        <Card isFlat={false}>
          <CardTitle>
            {title} <Divider />
          </CardTitle>
          <CardBody>
            <Grid hasGutter sm={12} md={12} lg={6} xl={6}>
              {content}
            </Grid>
          </CardBody>
        </Card>
      </GridItem>
    )
  }

  getTable = (data) => {
    return (
      <Table
        title={this.props.tableTitle}
        apiGetRecords={this.props.apiListTablesRecord}
        tableColumns={this.props.tableColumns}
        toRowFunc={this.props.getTableRowsFunc}
        history={this.props.history}
        filters={this.props.getTableFilterFunc(data)}
      />
    )
  }

  render() {
    const { data, loading } = this.state

    if (loading) {
      return <div>Loading</div>
    }

    const content = this.wrapCard("Details", this.props.getDetailsFunc(data))
    const metrics = this.props.showMetrics ? <Metrics data={data} /> : null
    return (
      <>
        <PageContent>
          {metrics}
          <Grid hasGutter sm={12} md={12} lg={12} xl={12}>
            {this.props.tableColumns ? this.getTable(data) : null}
          </Grid>
          <Grid hasGutter sm={12} md={12} lg={12} xl={12}>
            {content}
          </Grid>
        </PageContent>
      </>
    )
  }
}

TabDetailsBase.propTypes = {
  apiGetRecord: PropTypes.func,
  apiListTablesRecord: PropTypes.func,
  getTableFilterFunc: PropTypes.func,
  getTableRowsFunc: PropTypes.func,
  tableTitle: PropTypes.string,
  tableColumns: PropTypes.array,
  getDetailsFunc: PropTypes.func,
  showMetrics: PropTypes.bool,
}
