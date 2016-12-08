import React, { PropTypes as T } from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { Panel } from 'react-bootstrap'
import { Table, FormGroup, FormControl, Button } from 'react-bootstrap'
import './ManageStudents.css'

export class ManageStudents extends React.Component {
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
	      student: [],
	      newStudent: {Grade: '0'}

	    }

	   // this.getStudentList()
	}
/*
	getStudentList(){
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
	}*/


	updateCreateField(field, event){
		let tempMember = this.state.newStudent
		if(field === 'name'){
			tempMember.name = event.target.value
			tempMember.firstName = tempMember.name.split(' ')[0]
			if(tempMember.name.split(' ').length !== 1)
				tempMember.lastName = event.target.value.substr(tempMember.firstName.length + 1)
		} else {
			tempMember[field] = event.target.value
		}
		
		this.setState({
			newStudent: tempMember
		})
	}

	createStudent(){
		if(!this.state.newStudent.firstName || !this.state.newStudent.lastName || !this.stat.newStudent.id){
			let error = ''
			if(!this.state.newStudent.firstName){
				error = 'no name provided'
			} else if(!this.state.newStudent.lastName){
				error = 'no last name provided'
			} 
			this.context.addNotification({
	          title: 'Error',
	          message: 'Failed to create new student, ' + error,
	          level: 'error'
	        })
		} else {
			fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/students`,
		      {
		        method: 'POST',
		        headers: {
		        	'Content-Type':'application/json'
		        },
		        body: JSON.stringify({
		        	student:this.state.newStudent
		        })
		      })
		      .then(() => {
		      	this.context.addNotification({
		          title: 'Success',
		          message: 'Successfully created new student',
		          level: 'success'
		        })
			    this.setState({
			    	newStudent: { grade: '0', name: ''},
			    })
			   // this.getStudentList()
         
                       


		      	})
		      .catch(err => {
		        console.error(err)
		        this.context.addNotification({
		          title: 'Error',
		          message: 'Failed to create new student',
		          level: 'error'
		        })
		      })
	    }
	}





    getSectionDropDown(){


// .filter(grade => {
//                   return 
//                     (gradeFilter === '' || student.grade.toString() === gradeFilter)
//                     && `${student.teacher.firstName} ${student.teacher.lastName}`.toLowerCase().includes(teacherFilter)
//                 })
/*
                const { sections } = this.state.newStudent.grade
                sections.map((section, i) => {

<FormGroup controlId="formSelectSection">
		      <FormControl 
		      	componentClass="select"
		      	value={this.state.newStudent.section ? this.state.newStudent.section : '0'}
		      	onChange={this.updateCreateField.bind(this, 'section')}>
		        <option value="i">${section.teacher.firstName} ${section.teacher.lastName} </option>
		      </FormControl>
		    </FormGroup>


                 
                })*/


switch(this.state.newStudent.grade){
			case '0':
			<FormGroup controlId="formSelectSection">
		      <FormControl 
		      	componentClass="select"
		      	value={this.state.newStudent.section ? this.state.newStudent.section : '0'}
		      	onChange={this.updateCreateField.bind(this, 'section')}>
		        <option value="0">Mr, </option>
		        <option value="1">Mrs</option>
		      </FormControl>
		    </FormGroup>
			case '1':
			<	FormGroup controlId="formSelectSection">
		      <FormControl 
		      	componentClass="select"
		      	value={this.state.newStudent.section ? this.state.newStudent.section : '0'}
		      	onChange={this.updateCreateField.bind(this, 'section')}>
		        <option value="0">Mr,a </option>
		        <option value="1">Mrsa</option>
		      </FormControl>
		    </FormGroup>
			default:

            <	FormGroup controlId="formSelectSection">
		      <FormControl 
		      	componentClass="select"
		      	value={this.state.newStudent.section ? this.state.newStudent.section : '0'}
		      	onChange={this.updateCreateField.bind(this, 'section')}>
		        <option value="0">Mr, b</option>
		        <option value="1">Mrsb</option>
		      </FormControl>
		    </FormGroup>
				
		}

		
	}
  
  	render() {
	    return (
	    <div className="root">
	    	<Panel>
		    	<Table striped bordered condensed hover>
		    		<thead>
		    			<tr>
		    				<th>Name</th>
                            <th>ID</th>
					        <th>Grade</th>
					        <th>Section</th>
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
						            value = {(this.state.newStudent.name)}
						            onChange={this.updateCreateField.bind(this, 'name')}
						          />
						        </FormGroup>
        					</td>
                            <td>
							 	<FormGroup controlId="formBasicTextName">
						          <FormControl
						            type="text"
						            placeholder="Enter Student ID"
						            value = {(this.state.newStudent.id)}
						            onChange={this.updateCreateField.bind(this, 'id')}
						          />
						        </FormGroup>
        					</td>
					       
					        <td>
                            
                                <FormGroup controlId="formSelectGrade">
		                             <FormControl 
                                        componentClass="select"
                                        value={this.state.newStudent.grade ? this.state.newStudent.grade : '0'}
                                        onChange={this.updateCreateField.bind(this, 'grade')}>
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
		                          </FormGroup>
                                  </td>

                            <td>{this.getSectionDropDown()}</td>


					        <td><Button bsStyle='primary' onClick={this.createStudent.bind(this)}>{'Create New Student'}</Button></td>
				
                 
                        </tr>
		    		</tbody>
		    	</Table>
			</Panel>
	    </div>
	    )
	}
}

export default ManageStudents