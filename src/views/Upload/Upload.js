import React, { PropTypes as T } from 'react'
import {Grid, Row, Col, Panel} from 'react-bootstrap'
import fileDownload from 'react-file-download'
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

  downloadFile(){
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/csv-template`, {
        method: 'GET',
      }).then(response => {
        response.text().then(text => {
          fileDownload(text, 'gradeCSVTemplate.csv')
        })
      }).catch(err => {
        this.context.addNotification({
          title: 'Error',
          message: 'An error occurred with the CSV download: ' + err,
          level: 'error'
        })
      })
  }

  render() {
    return (
    <div className="root">
      <Grid>
        <Row>
    			<Col xs={6}>
    				<Panel
              onClick={()=> {
                this.context.router.push('admin/upload/upload-csv')
              }}
              className="upload-panel">
    					<h3>Upload Data</h3> 
            </Panel>
          </Col>
    			<Col xs={6}>
    				<Panel
              onClick={this.downloadFile.bind(this)}
              className="upload-panel">
    					<h3>Download Template</h3> 
            </Panel>
          </Col>
        </Row>
      </Grid>
    </div>
    )
  }
}

export default Upload