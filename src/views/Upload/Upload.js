import React, { PropTypes as T } from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { Panel } from 'react-bootstrap'
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
			<Col xs={4}>
				<Panel>
					<h3>Data Upload</h3> 
                 </Panel>
            </Col>
        </Row>
      </Grid>
    </div>
    )
  }
}

export default Upload