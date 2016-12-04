import React, { PropTypes as T } from 'react'
import {FormGroup, ControlLabel, FormControl, HelpBlock, Panel, Button} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import Dropzone from 'react-dropzone'
import './UploadCSV.css'

export class UploadCSV extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }
  
  static propTypes = {
    auth: T.instanceOf(AuthService)

  }

  submitButton(event){
    event.preventDefault()
    console.log(typeof this.input)
    if(!this.refs.fileUpload){
      console.log('uh oh')
    } else {
      console.log(this.refs.uploadFile)
    }

    var formData = new FormData()
    formData.append('students', this.input.file)
    console.log(formData)

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/upload`, {
        method: 'POST',
        body:formData
      }).then(response => {
        this.context.addNotification({
          title: 'Success',
          message: 'Successfully uploaded csv file',
          level: 'success'
        })
      }).catch(err => {
        this.context.addNotification({
          title: 'Error',
          message: 'An error occurred with the CSV upload: ' + err,
          level: 'error'
        })
      })
      
  }
  handleChange(event){
    console.log(event.target)
    this.input = event.target
  }

  render() {
    return (
    <div className='root'>
      <Panel>
        <form encType="multipart/form-data" action={`${process.env.REACT_APP_SERVER_ADDRESS}/api/upload`} method="post">
          <FormGroup controlId='uploadCSVFormGroup' className="centered">
            <ControlLabel className="centered">Upload Student Data File</ControlLabel>
            <FormControl type='file' className="centered" onChange={this.handleChange.bind(this)}/>
            <HelpBlock className="centered">REMINDER: csv file shouldn't contain apostrophes, tabs, or commas</HelpBlock>
          </FormGroup>
          <Button onClick={this.submitButton.bind(this)}type="submit">Upload CSV file</Button>
        </form>
      </Panel>
    </div>
    )
  }
}

export default UploadCSV