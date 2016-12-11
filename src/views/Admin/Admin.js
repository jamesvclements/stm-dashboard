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
								className="clickable-panel">
								<h3>Manage Users</h3>
							</Panel>
						</Col>
						<Col xs={6}>
							<Panel
								onClick={() => {this.context.router.push('/admin/upload')}}
								className="clickable-panel">
								<h3>Upload</h3>
							</Panel>
						</Col>
						<Col xs={6}>
							<Panel
								onClick={() => {this.context.router.push('/admin/add-students')}}
								className="clickable-panel">
								<h3>Add Students</h3>
							</Panel>
						</Col>
						<Col xs={6}>
							<Panel
								onClick={() => {this.context.router.push('/admin/delete-students')}}
								className="clickable-panel">
								<h3>Delete Students</h3>
							</Panel>
						</Col>
						<Col xs={6}>
							<Panel
								onClick={() => {this.context.router.push('/admin/change-year')}}
								className="clickable-panel">
								<h3>Advance Academic Year</h3>
							</Panel>
						</Col>
					</Row>
				</Grid>
			</div>
		)
	}
}

export default Admin