import React from "react"
import { AlertGroup, Alert, AlertActionCloseButton } from "@patternfly/react-core"
import { connect } from "react-redux"
import { toasterRemove } from "../../store/entities/toaster"
import { TOAST_ALERT_TIMEOUT } from "../../config/globalConfig"

class Toaster extends React.Component {
  render() {
    const elements = this.props.items.map((a) => {
      // set timeout to remove this alert
      setTimeout(() => {
        this.props.onRemove(a.id)
      }, TOAST_ALERT_TIMEOUT)

      return (
        <Alert
          isInline={false}
          key={a.id}
          title={a.title}
          // timeout={TOAST_ALERT_TIMEOUT}
          variant={a.type}
          actionClose={<AlertActionCloseButton title={a.title} onClose={() => this.props.onRemove(a.id)} />}
        >
          {a.description.map((txt, index) => {
            return <p key={index}>{txt}</p>
          })}
        </Alert>
      )
    })
    return <AlertGroup isToast={true}>{elements}</AlertGroup>
  }
}

const mapStateToProps = (state) => ({
  items: state.entities.toaster.items,
})

const mapDispatchToProps = (dispatch) => ({
  onRemove: (id) => dispatch(toasterRemove({ id })),
})

export default connect(mapStateToProps, mapDispatchToProps)(Toaster)
