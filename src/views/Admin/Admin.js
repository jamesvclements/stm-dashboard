import React, { PropTypes as T } from 'react'
import { Grid, Row, Col, Breadcrumb } from 'react-bootstrap'
import { Panel } from 'react-bootstrap'
import './Admin.css'

export class Admin extends React.Component {
	static contextTypes = {
		router: T.object
	}

	render() {
		return (
			<div className="root">
				<Breadcrumb>
          <Breadcrumb.Item href="#/landing">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Admin
          </Breadcrumb.Item>
        </Breadcrumb>
				<Grid>
					<Row>
						<Col xs={6}>
							<Panel
								onClick={() => {this.context.router.push('/admin/manage-users')}}
								className="admin-panel">
								<h3>Manage Users</h3>
							</Panel>
						</Col>
						<Col xs={6}>
							<Panel
								onClick={() => {this.context.router.push('/admin/upload')}}
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