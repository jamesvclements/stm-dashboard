import React, { PropTypes as T } from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { Panel } from 'react-bootstrap'
import './Admin.css'

export class Admin extends React.Component {
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
						this.context.router.push('/manage-users')
					}}
					className="admin-panel">
					<h3>Manage Users</h3>
				</Panel>
			</Col>
			<Col xs={6}>
				<Panel
					onClick={()=> {
						this.context.router.push('/upload')
					}}
					className="admin-panel">
					<h3>Upload</h3>
				</Panel>
			</Col>
        </Row>
      </Grid>
    </div>
    )
  }
}

export default Admin