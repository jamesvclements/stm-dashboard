import React, { PropTypes as T } from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { Panel } from 'react-bootstrap'
import { Table, FormGroup, FormControl, Button, Breadcrumb} from 'react-bootstrap'
import './ManageUsers.css'

export class ManageUsers extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }
  
  static propTypes = {
    auth: T.instanceOf(AuthService),
    
  }

	constructor() {
	    super()

	    this.state = {
	      staff: [],
	      newStaff: {accessLevel: '2'}

	    }

	    this.getStaffList()
	}

	getStaffList(){
		fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/staff`,
	      {
	        method: 'GET',
	      })
	      .then(staff => {
	      	staff.json().then(staff => {
			          staff.sort((a, b) => { return a.emailID.localeCompare(b.emailID) })
			          this.setState({
			          	staff: staff
			          })
		  		})
	      	})
	      .catch(err => {
	        console.error(err)
	        this.context.addNotification({
	          title: 'Error',
	          message: 'Failed to get staff list',
	          level: 'error'
	        })
	      })
	}

	updateField(field,email,event){
		let memberIndex = -1
		for( let i = 0; i < this.state.staff.length; i++){
			if(this.state.staff[i].emailID === email){
				memberIndex = i
				break
			}
		}
		let tempStaff = this.state.staff
		tempStaff[memberIndex][field] = event.target.value
		this.setState({
			staff: tempStaff
		})

		fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/staff`,
	      {
	        method: 'POST',
	        headers: {
	        	'Content-Type':'application/json'
	        },
	        body: JSON.stringify({
	        	staff:this.state.staff[memberIndex]
	        })
	      })
	      .then(staff => {
	      	this.context.addNotification({
	          title: 'Success',
	          message: 'Successfully updated teacher info',
	          level: 'success'
	        })
	      	})
	      .catch(err => {
	        console.error(err)
	        this.context.addNotification({
	          title: 'Error',
	          message: 'Failed to update staff info',
	          level: 'error'
	        })
	      })

	}

	deleteStaff(email){
		fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/staff`,
	      {
	        method: 'POST',
	        headers: {
	        	'Content-Type':'application/json'
	        },
	        body: JSON.stringify({
	        	emailID:email
	        })
	      })
	      .then(() => {
	      	this.context.addNotification({
	          title: 'Success',
	          message: 'Successfully deleted staff member',
	          level: 'success'
	        })	
	      	})
	      .catch(err => {
	        console.error(err)
	        this.context.addNotification({
	          title: 'Error',
	          message: 'Failed to delete staff member',
	          level: 'error'
	        })
	      })

	      this.getStaffList()
	}

	updateCreateField(field, event){
		let tempMember = this.state.newStaff
		if(field === 'name'){
			tempMember.name = event.target.value
			tempMember.firstName = tempMember.name.split(' ')[0]
			if(tempMember.name.split(' ').length !== 1)
				tempMember.lastName = event.target.value.substr(tempMember.firstName.length + 1)
		} else {
			tempMember[field] = event.target.value
		}
		if(field  === 'accessLevel' && event.target.value !== '2')
			tempMember.gradeTeaching = ''
		this.setState({
			newStaff: tempMember
		})
	}

	createStaff(){
		if(!this.state.newStaff.firstName || !this.state.newStaff.lastName || !this.state.newStaff.emailID){
			let error = ''
			if(!this.state.newStaff.firstName){
				error = 'no name provided'
			} else if(!this.state.newStaff.lastName){
				error = 'no last name provided'
			} else {
				error = 'no email provided'
			}
			this.context.addNotification({
	          title: 'Error',
	          message: 'Failed to create new staff member, ' + error,
	          level: 'error'
	        })
		} else {
			fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/staff`,
		      {
		        method: 'POST',
		        headers: {
		        	'Content-Type':'application/json'
		        },
		        body: JSON.stringify({
		        	staff:this.state.newStaff
		        })
		      })
		      .then(() => {
		      	this.context.addNotification({
		          title: 'Success',
		          message: 'Successfully created new staff member',
		          level: 'success'
		        })
			    this.setState({
			    	newStaff: { accessLevel: '2', name: '', emailID: ''},
			    })
			    this.getStaffList()
		      	})
		      .catch(err => {
		        console.error(err)
		        this.context.addNotification({
		          title: 'Error',
		          message: 'Failed to create new staff member',
		          level: 'error'
		        })
		      })
	    }
	}

	getButtonLabel(){
		if(!this.state.newStaff)
			return 'create new Teacher'
		switch(this.state.newStaff.accessLevel){
			case '0':
				return 'Create New Admin'
			case '1':
				return 'Create New Counselor'
			default:
				return 'Create New Teacher'
		}
	}

	getGradeDropDown(){
		if(this.state.newStaff.accessLevel === '2'){
	    	return (<FormGroup controlId="formControlsSelectGrade">
		      <FormControl 
		      	componentClass="select"
		      	value={this.state.newStaff.gradeTeaching ? this.state.newStaff.gradeTeaching : '0'}
		      	onChange={this.updateCreateField.bind(this, 'gradeTeaching')}>
		        <option value="0">Kindergarten</option>
		        <option value="1">First</option>
		        <option value="2">Second</option>
		        <option value="3">Third</option>
		        <option value="4">Fourth</option>
		        <option value="5">Fifth</option>
		        <option value="6">Sixth</option>
		        <option value="7">Seventh</option>
		        <option value="8">Eighth</option>
		      </FormControl>
		    </FormGroup>)
		} else {
			return null
		}
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
                        Manage Users
          </Breadcrumb.Item>
                </Breadcrumb>
	    	<Panel>
		    	<Table striped bordered condensed hover>
		    		<thead>
		    			<tr>
		    				<th>Name</th>
					        <th>Email</th>
					        <th>Access Level</th>
					        <th>Grade</th>
					        <th>Action</th>
					    </tr>
		    		</thead>
		    		<tbody>
							<tr>
						 	<td>
							 	<FormGroup controlId="formBasicTextName">
						          <FormControl
						            type="text"
						            placeholder="Enter Name"
						            value={(this.state.newStaff.name)}
						            onChange={this.updateCreateField.bind(this, 'name')}
						          />
						        </FormGroup>
        					</td>
					        <td>
							 	<FormGroup controlId="formBasicTextEmail">
						          <FormControl
						            type="text"
						            placeholder="Enter Email"
						            value={this.state.newStaff.emailID}
						            onChange={this.updateCreateField.bind(this, 'emailID')}
						          />
						        </FormGroup>
					        </td>
					        <td>
					        	<FormGroup controlId="formControlsSelectAccess">
							      <FormControl 
							      	componentClass="select"
							      	value={this.state.newStaff.accessLevel ? this.state.newStaff.accessLevel : '2'}
							      	onChange={this.updateCreateField.bind(this, 'accessLevel')}
							      >
							        <option value="2">Teacher</option>
							        <option value="1">Counselor</option>
							        <option value="0">Administrator</option>
							      </FormControl>
							    </FormGroup>
					        </td>
					        <td>{this.getGradeDropDown()}</td>
					        <td><Button bsStyle='primary' onClick={this.createStaff.bind(this)}>{this.getButtonLabel()}</Button></td>
					    </tr>
			    		{
			    			this.state.staff.map((member, i) => {
			    				return (
									 <tr key={i}>
									 	<td>{member.firstName + ' ' + member.lastName}</td>
								        <td>{member.emailID}</td>
								        <td>
								        	<FormGroup controlId="formControlsSelectAccess">
										      <FormControl componentClass="select" value={member.accessLevel} onChange={this.updateField.bind(this, 'accessLevel', member.emailID)}>
										        <option value="2">Teacher</option>
										        <option value="1">Counselor</option>
										        <option value="0">Administrator</option>
										      </FormControl>
										    </FormGroup>
								        </td>
								        <td>
								        	<FormGroup controlId="formControlsSelectGrade">
										      <FormControl componentClass="select" value={member.gradeTeaching} onChange={this.updateField.bind(this, 'gradeTeaching',member.emailID)}>
										        <option value="0">Kindergarten</option>
										        <option value="1">First</option>
										        <option value="2">Second</option>
										        <option value="3">Third</option>
										        <option value="4">Fourth</option>
										        <option value="5">Fifth</option>
										        <option value="6">Sixth</option>
										        <option value="7">Seventh</option>
										        <option value="8">Eighth</option>
												<option value=''>None</option>
										      </FormControl>
										    </FormGroup>
								        </td>
								        <td><Button bsStyle='danger' onClick={this.deleteStaff.bind(this,member.emailID)}>{'Delete ' + member.firstName}</Button></td>
								    </tr>
								)
			    			})
			    		}
			    	
		    		</tbody>
		    	</Table>
			</Panel>
	    </div>
	    )
	}
}

export default ManageUsers