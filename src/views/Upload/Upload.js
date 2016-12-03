import React, { PropTypes as T } from 'react'
import {Grid, Row, Col, Panel} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import './Upload.css'

export class Upload extends React.Component {
  static contextTypes = {
    router: T.object
  }
  
  static propTypes = {
    auth: T.instanceOf(AuthService)
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
              onClick={()=> {
                this.context.router.push('admin/upload/download-template')
              }}
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