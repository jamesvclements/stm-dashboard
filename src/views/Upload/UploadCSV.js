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

  constructor(props) {
    super(props)

    this.state = {
      file: null
    }
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
    formData.append('students', this.state.input)
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
      this.setState({
        input:null
      })
      
  }
  onDrop(acceptedFiles, rejectedFiles) {
    if(acceptedFiles.length === 1)
      this.setState({input:acceptedFiles[0]})
    else
      this.context.addNotification({
          title: 'Error',
          message: 'File must in CSV format',
          level: 'error'
        })
  }

  render() {
    return (
    <div className='root'>
    <Panel>
      <Dropzone className='centered' onDrop={this.onDrop.bind(this)} multiple={false} accept='text/csv'>
        <br/>
        <h3>Drop CSV here, or click to select file to upload.</h3>
        <br/>
      </Dropzone>
      <h5>REMINDER: Uploaded date shouldn't contain commas, tabs, or apostrophes</h5>
      {this.state.input ? 
        (<Button bsStyle='primary' onClick={this.submitButton.bind(this)}>Click here to upload CSV</Button>) :
        (<h4>please choose a file</h4>)
      }
      </Panel>
    </div>
    )
  }
}

export default UploadCSV