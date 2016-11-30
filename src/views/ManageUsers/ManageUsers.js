import React, { PropTypes as T } from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { Panel } from 'react-bootstrap'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'
import './ManageUsers.css'

export class ManageUsers extends React.Component {
  static contextTypes = {
    router: T.object
  }
  
  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  //fetch(`st-thomas-more.auth0.com/api/v2/users`, {
    //  method: 'GET'
    //})
	
	//TO DO:
	//get list of users - emails, access level, grade, section
	//drop downs should include available access levels, grades, sections
	//section depends on the grade selected
	//last row empty to input new user
  
  render() {
    return (
    <div className="root">
      <Grid>
        <Row>
			<Col xs={2}>
				<Panel>
					<h3>Email</h3>
				</Panel>
			</Col>
			<Col xs={2}>
				<Panel>
					<h3>Access Level</h3>
				</Panel>
			</Col>
			<Col xs={2}>
				<Panel>
					<h3>Grade</h3>
				</Panel>
			</Col>
			<Col xs={2}>
				<Panel>
					<h3>Section</h3>
				</Panel>
			</Col>
			<Col xs={2}>
				<Panel>
					<h3>Delete</h3>
				</Panel>
			</Col>
		</Row>
		<Row>
			<Col xs={2}>
				<Panel>
					<h3></h3>
				</Panel>
			</Col>
			<Col xs={2}>
					<DropdownButton bsSize="large" title="access level">
						<MenuItem eventKey="1">Teacher</MenuItem>
						<MenuItem eventKey="2">Counselor</MenuItem>
						<MenuItem eventKey="3">Admin</MenuItem>
						<MenuItem eventKey="4">Default</MenuItem>
					</DropdownButton>
			</Col>
			<Col xs={2}>
					<DropdownButton bsSize="large" title="grade">
						<MenuItem eventKey="1">K</MenuItem>
						<MenuItem eventKey="2">1</MenuItem>
						<MenuItem eventKey="3">2</MenuItem>
					</DropdownButton>
			</Col>
			<Col xs={2}>
					<DropdownButton bsSize="large" title="section">
						<MenuItem eventKey="1">A</MenuItem>
						<MenuItem eventKey="2">B</MenuItem>
						<MenuItem eventKey="3">C</MenuItem>
					</DropdownButton>
			</Col>
			<Col xs={2}>
				<Button bsSize="large">Delete</Button>
			</Col>
		</Row>
			<Row>
			<Col xs={2}>
				<Panel>
					<h3></h3>
				</Panel>
			</Col>
			<Col xs={2}>
					<DropdownButton bsSize="large" title="access level">
						<MenuItem eventKey="1">Teacher</MenuItem>
						<MenuItem eventKey="2">Counselor</MenuItem>
						<MenuItem eventKey="3">Admin</MenuItem>
						<MenuItem eventKey="4">Default</MenuItem>
					</DropdownButton>
			</Col>
			<Col xs={2}>
					<DropdownButton bsSize="large" title="grade">
						<MenuItem eventKey="1">K</MenuItem>
						<MenuItem eventKey="2">1</MenuItem>
						<MenuItem eventKey="3">2</MenuItem>
					</DropdownButton>
			</Col>
			<Col xs={2}>
					<DropdownButton bsSize="large" title="section">
						<MenuItem eventKey="1">A</MenuItem>
						<MenuItem eventKey="2">B</MenuItem>
						<MenuItem eventKey="3">C</MenuItem>
					</DropdownButton>
			</Col>
			<Col xs={2}>
				<Button bsSize="large">Delete</Button>
			</Col>
		</Row>
      </Grid>
    </div>
    )
  }
}

export default ManageUsers