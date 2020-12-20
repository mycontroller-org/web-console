import { Divider, Grid, GridItem, Switch as PfSwitch } from "@patternfly/react-core"
import React from "react"
import { api } from "../../../Service/Api"

const SwitchPanel = ({ resources = [], onClickFunc = () => {} }) => {
  if (resources.length === 0) {
    return <div>No resources found</div>
  }

  const switches = resources.map((r, index) => {
    console.log(r)
    return (
      <GridItem span={12} key={"label_" + index}>
        <span style={{ float: "left", fontWeight: r.isChecked ? "bold" : "normal" }}>{r.label}</span>
        <span style={{ float: "right" }}>
          <Switch isChecked={r.isChecked} quickId={r.quickId} />
        </span>
        <Divider style={{ padding: "7px 0px" }} />
      </GridItem>
    )
  })

  return <Grid>{switches}</Grid>
}

class Switch extends React.Component {
  state = { isChecked: this.props.isChecked }

  onChange = (isChecked) => {
    this.setState({ isChecked })
    api.action.send({ resource: this.props.quickId, payload: isChecked })
  }

  render() {
    return <PfSwitch onChange={this.onChange} isChecked={this.state.isChecked} />
  }
}

export default SwitchPanel
