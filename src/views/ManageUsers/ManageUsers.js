import React, { PropTypes as T } from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { Panel } from 'react-bootstrap'
import { Button, DropdownButton, MenuItem, Table } from 'react-bootstrap'
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
	      staff: []
	    }

	    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/staff`,
	      {
	        method: 'GET',
	      })
	      .then(staff => {
	      	staff.json().then(staff => {
			          staff.sort((a, b) => { return a.emailID.localeCompare(b.emailID) })
			          console.log(staff)
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


  	render() {
	    return (
	    <div className="root">

	    	<Table striped bordered condensed hover>
	    		<thead>
	    			<tr>
	    				<th>Name</th>
				        <th>Email</th>
				        <th>Access Level</th>
				        <th>Grade</th>
				        <th>Delete</th>
				    </tr>
	    		</thead>
	    		<tbody>
		    		{
		    			this.state.staff.map((member, i) => {
		    				return (
								 <tr>
								 	<td>{member.firstName + ' ' + member.lastName}</td>
							        <td>{member.emailID}</td>
							        <td>{member.accessLevel}
							        	<FormGroup controlId="formControlsSelectMultiple">
									      <FormControl componentClass="select" multiple>
									        <option value="2">Teacher</option>
									        <option value="1">Counselor</option>
									        <option value="0">Administrator</option>
									      </FormControl>
									    </FormGroup>
							        </td>
							        <td>{member.gradeTeaching}</td>
							        <td>Delete</td>
							    </tr>
							)
		    			})
		    		}
	    		</tbody>
	    	</Table>
			
	    </div>
	    )
	  }
}

export default ManageUsers