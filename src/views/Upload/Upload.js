import React, { PropTypes as T } from 'react'
import { Grid, Row, Col, Panel, Button, Breadcrumb } from 'react-bootstrap'
import fileDownload from 'react-file-download'
import Dropzone from 'react-dropzone'
import AuthService from '../../utils/AuthService'
import './Upload.css'

export class Upload extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  constructor() {
    super()

    this.state = {
      file: null
    }
  }

  downloadTemplate() {
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/csv-template`, {
      method: 'GET',
    }).then(response => {
      response.text().then(text => {
        fileDownload(text, 'gradeCSVTemplate.csv')
      })
    }).catch(err => {
      this.context.addNotification({
        title: 'Error',
        message: 'Failed to download CSV template',
        level: 'error'
      })
    })
  }

  submitButton(event) {
    event.preventDefault()

    let formData = new FormData()
    formData.append('students', this.state.file)

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/upload`, {
      method: 'POST',
      body: formData
    }).then(response => {
      this.context.addNotification({
        title: 'Success',
        message: 'Uploaded CSV',
        level: 'success'
      })
    }).catch(err => {
      this.context.addNotification({
        title: 'Error',
        message: 'Failed to upload CSV',
        level: 'error'
      })
    })
    this.setState({
      file: null
    })

  }

  onDrop(acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length === 1) {
      this.setState({
        file: acceptedFiles[0]
      })
    } else {
      this.context.addNotification({
        title: 'Error',
        message: 'Invalid file format',
        level: 'error'
      })
    }
  }

  uploadFile() {
    let formData = new FormData()
    formData.append('students', this.state.file)
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/upload`, {
      method: 'POST',
      body: formData
    }).then(response => {
      this.context.addNotification({
        title: 'Success',
        message: 'Uploaded CSV',
        level: 'success'
      })
    }).catch(err => {
      this.context.addNotification({
        title: 'Error',
        message: 'Failed to upload CSV',
        level: 'error'
      })
    })
    this.setState({
      file: null
    })
  }

  render() {
    return (
      <div className="root">
        <Breadcrumb>
          <Breadcrumb.Item href="#/landing">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#/admin">
            Admin
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Upload
          </Breadcrumb.Item>
        </Breadcrumb>
        <Grid>
          <Row>
            <Col xs={12}>
              <Button block bsStyle="primary" onClick={this.downloadTemplate.bind(this)}>
                DOWNLOAD CSV TEMPLATE
              </Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={12}>
              <Grid fluid>
                <Row>
                  <Col xs={12}>
                    <Dropzone className='centered' onDrop={this.onDrop.bind(this)} multiple={false} accept='text/csv'>
                      <Panel className="clickable-panel">
                        <h2>DROP FILE OR CLICK TO UPLOAD CSV</h2>
                      </Panel>
                    </Dropzone>
                  </Col>
                </Row>
                {
                  this.state.file ?
                    <Row>
                      <Col xs={8}>
                        <h4>{this.state.file.name}</h4>
                      </Col>
                      <Col xs={4}>
                        <Button block bsStyle="primary" onClick={this.uploadFile.bind(this)}>UPLOAD</Button>
                      </Col>
                    </Row> : null
                }
              </Grid>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Upload