import React from "react"
import PageTitle from "../PageTitle/PageTitle"
import PageContent from "../PageContent/PageContent"
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Card,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Divider,
} from "@patternfly/react-core"

import "./DetailBase.css"
import PropTypes from "prop-types"

export default class DetailBase extends React.Component {
  state = {
    loading: true,
    data: {},
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

  wrapCard = (title, data) => {
    return (
      <GridItem key={title}>
        <Card isFlat style={{ height: "100%" }}>
          <CardTitle>
            {title} <Divider />
          </CardTitle>
          <CardBody>
            <DescriptionList isHorizontal={false}>{data}</DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
    )
  }

  render() {
    const { data, loading } = this.state

    if (loading) {
      return <div>Loading</div>
    }

    const content = this.props.renderFunc(data, this.wrapField, this.wrapCard)

    return (
      <>
        <PageTitle title={this.props.resourceName} />
        <PageContent>
          <Grid hasGutter sm={12} md={12} lg={6} xl={4}>
            {content}
          </Grid>
        </PageContent>
      </>
    )
  }
}

DetailBase.propTypes = {
  resourceName: PropTypes.string,
  apiGetRecord: PropTypes.func,
  renderFunc: PropTypes.func,
  redirectUpdatePage: PropTypes.string,
}
