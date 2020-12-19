import {
  ActionGroup,
  Button,
  Checkbox,
  Form,
  FormGroup,
  Grid,
  GridItem,
  TextInput
} from "@patternfly/react-core"
import React from "react"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"

class AddPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value1: "",
      value2: "",
      value3: "",
    }
    this.handleTextInputChange1 = (value1) => {
      this.setState({ value1 })
    }
    this.handleTextInputChange2 = (value2) => {
      this.setState({ value2 })
    }
    this.handleTextInputChange3 = (value3) => {
      this.setState({ value3 })
    }
  }
  render() {
    const { value1, value2, value3 } = this.state
    const form = (
      <Form>
        <FormGroup
          label="ID"
          isRequired
          validated="default"
          helperTextInvalid="something went wrong"
          fieldId="simple-form-name-01"
          helperText="Please provide your full name"
        >
          <TextInput
            validated="default"
            isRequired
            type="text"
            id="simple-form-name-01"
            name="simple-form-name-01"
            aria-describedby="simple-form-name-01-helper"
            value={value1}
            onChange={this.handleTextInputChange1}
          />
        </FormGroup>
        <FormGroup
          label="Name"
          isRequired
          validated="default"
          helperTextInvalid="something went wrong"
          fieldId="simple-form-name-01"
          helperText="Please provide your full name"
        >
          <TextInput
            validated="default"
            isRequired
            type="text"
            id="simple-form-name-01"
            name="simple-form-name-01"
            aria-describedby="simple-form-name-01-helper"
            value={value1}
            onChange={this.handleTextInputChange1}
          />
        </FormGroup>
        <FormGroup isInline fieldId="simple-form-checkbox-group" label="Enable" isRequired>
          <Checkbox label="" aria-label="" id="inlinecheck01" />
        </FormGroup>
        <FormGroup
          label="Provider"
          isRequired
          validated="default"
          helperTextInvalid="something went wrong"
          fieldId="simple-form-name-01"
          helperText="Please provide your full name"
        >
          <TextInput
            validated="default"
            isRequired
            type="text"
            id="simple-form-name-01"
            name="simple-form-name-01"
            aria-describedby="simple-form-name-01-helper"
            value={value1}
            onChange={this.handleTextInputChange1}
          />
        </FormGroup>



        <FormGroup label="Email" isRequired fieldId="simple-form-email-01">
          <TextInput
            isRequired
            type="email"
            id="simple-form-email-01"
            name="simple-form-email-01"
            value={value2}
            onChange={this.handleTextInputChange2}
          />
        </FormGroup>
        <FormGroup label="Phone number" isRequired fieldId="simple-form-number-01">
          <TextInput
            isRequired
            type="tel"
            id="simple-form-number-01"
            placeholder="555-555-5555"
            name="simple-form-number-01"
            value={value3}
            onChange={this.handleTextInputChange3}
          />
        </FormGroup>
        <FormGroup isInline fieldId="simple-form-checkbox-group" label="How can we contact you?" isRequired>
          <Checkbox label="Email" aria-label="Email" id="inlinecheck01" />
          <Checkbox label="Phone" aria-label="Phone" id="inlinecheck02" />
          <Checkbox label="Please don't contact me" aria-label="Please don't contact me" id="inlinecheck03" />
        </FormGroup>
        <FormGroup label="Additional Note" fieldId="simple-form-note-01">
          <TextInput
            isDisabled
            type="text"
            id="simple-form-note-01"
            name="simple-form-number"
            value="disabled"
          />
        </FormGroup>
        <FormGroup fieldId="checkbox01">
          <Checkbox
            label="I'd like updates via email"
            id="checkbox01"
            name="checkbox01"
            aria-label="Update via email"
          />
        </FormGroup>
        <ActionGroup>
          <Button variant="primary">Submit form</Button>
          <Button variant="link">Cancel</Button>
        </ActionGroup>
      </Form>
    )
    return (
      <>
        <PageTitle title="Add a Gateway" />
        <PageContent>
          <Grid>
            <GridItem sm={12} md={8} lg={7} xl={6}>
              {form}
            </GridItem>
          </Grid>
        </PageContent>
      </>
    )
  }
}

export default AddPage
