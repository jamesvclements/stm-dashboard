import React, { PropTypes as T } from 'react'
import AuthService from '../../utils/AuthService'
import { Grid, Row, Col, Panel } from 'react-bootstrap'
import DatePicker from "react-bootstrap-date-picker";
import { Table, FormGroup, FormControl, Button, Breadcrumb, ControlLabel } from 'react-bootstrap'
import './AddStudents.css'



export class AddStudents extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  constructor() {
    super()

    this.state = {
      student: [],
      newStudent: {
        grade: '0',
        sectionID: '00',
        id: null,
        firstName: null,
        lastName: null,
        sex: 'M',
        dob: null
      },
      options: [],
    }

    // initalize dropdown
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/grades/0`, {
      method: 'GET'
    })
      .then(response => {

        if (response.ok) {
          response.json().then(grade => {
            // bind the values of section dropdown to 
            let options = []
            for (let section of grade.sections) {
              options.push({ teacher: section.teacher, sectionID: section.sectionID })
            }
            // student.sectionID = options[0]
            this.setState({
              options: options
            })
          })
        } else {
          this.notifyError('Failed to fetch sections')
        }
      }).catch(err => {
        console.error(err)
        this.notifyError('Failed to fetch sections')
      })
  }

  updateCreateDOB(value, formattedValue) {
    console.log(value)
    console.log(formattedValue)
    let tempMember = this.state.newStudent
    tempMember['dob'] = formattedValue
    tempMember['dobValue'] = value
    this.setState({
      newStudent: tempMember,
    })
  }

  updateCreateField(field, event) {
    let tempMember = this.state.newStudent

    if (field === 'grade') {
      tempMember.grade = event.target.value

      fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/grades/${event.target.value}`, {
        method: 'GET'
      })
        .then(response => {
          if (response.ok) {
            response.json().then(grade => {

              // bind the values of section dropdown to 
              let options = []
              for (let section of grade.sections) {
                options.push({ teacher: section.teacher, sectionID: section.sectionID })
              }
              if (options[0] != null) {
                tempMember.sectionID = options[0].sectionID
              }
              else {
                tempMember.sectionID = ''
              }

              this.setState({
                options: options,
                newStudent: tempMember
              })
            })
          } else {
            this.notifyError('Failed to fetch sections')
          }
        }).catch(err => {
          console.error(err)
          this.notifyError('Failed to fetch sections')
        })
    }
    tempMember[field] = event.target.value


    this.setState({
      newStudent: tempMember
    })
  }




  createStudent() {
    if (!this.state.newStudent.firstName || !this.state.newStudent.lastName || !this.state.newStudent.id || !this.state.newStudent.sectionID || !this.state.newStudent.dob || !this.state.newStudent.sex) {
      let error = ''
      if (!this.state.newStudent.firstName) {
        error = 'no name provided'
      } else if (!this.state.newStudent.lastName) {
        error = 'no last name provided'
      } else if (!this.state.newStudent.sectionID) {
        error = 'no sectionID'
      }
      else if (!this.state.newStudent.id) {
        error = 'no student ID'
      }
      else if (!this.state.newStudent.dob) {
        error = 'no student date of birth'
      }
      else if (!this.state.newStudent.sex) {
        error = 'no student gender'
      }
      this.context.addNotification({
        title: 'Error',
        message: 'Failed to create new student, ' + error,
        level: 'error'
      })
    } else {
      let tempStudent = this.state.newStudent
      delete tempStudent['dobValue']
      console.log(tempStudent)
      fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/students`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            student: tempStudent
          })
        })
        .then(response => {
          if (response.ok) {
            this.context.addNotification({
              title: 'Success',
              message: 'Successfully created new student',
              level: 'success'
            })
            this.context.router.push(`/students/${this.state.newStudent.id}`)
          } else {
            this.context.addNotification({
              title: 'Error',
              message: 'Failed to create new student',
              level: 'error'
            })
          }
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
            Add Student
          </Breadcrumb.Item>
        </Breadcrumb>
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                <Table striped bordered condensed hover fill>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>ID</th>
                      <th>Gender</th>

                    </tr>
                    <tr>
                      <th>DOB</th>
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
                            placeholder="Enter First Name"
                            value={this.state.newStudent.firstName == null ? '' : this.state.newStudent.firstName}
                            onChange={this.updateCreateField.bind(this, 'firstName')}
                            />
                        </FormGroup>
                      </td>
                      <td>
                        <FormGroup controlId="formBasicTextName">
                          <FormControl
                            type="text"
                            placeholder="Enter Last Name"
                            value={(this.state.newStudent.lastName == null ? '' : this.state.newStudent.lastName)}
                            onChange={this.updateCreateField.bind(this, 'lastName')}
                            />
                        </FormGroup>
                      </td>
                      <td>
                        <FormGroup controlId="formBasicTextID">
                          <FormControl
                            type="text"
                            placeholder="Enter Student ID"
                            value={(this.state.newStudent.id == null ? '' : this.state.newStudent.id)}
                            onChange={this.updateCreateField.bind(this, 'id')}
                            />
                        </FormGroup>
                      </td>


                      <td>

                        <FormGroup controlId="formSelectSex">

                          <FormControl

                            componentClass="select"
                            value={this.state.newStudent.sex ? this.state.newStudent.sex : 'M'}
                            onChange={this.updateCreateField.bind(this, 'sex')}>
                            <option value="M">Male</option>
                            <option value="F">Female</option>

                          </FormControl>
                        </FormGroup>
                      </td>

                    
                   
                    </tr>
 </tbody>
                     <thead>
                
                    <tr>
                      <th>DOB</th>
                      <th>Grade</th>
                      <th>Section</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                <tbody>

                    <tr>
                      <td>
                        <FormGroup controlId="formSelectDOB">
                          <DatePicker id="datepicker"
                            value={this.state.newStudent.dobValue ? this.state.newStudent.dobValue : new Date().toISOString()}
                            onChange={this.updateCreateDOB.bind(this)} />
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

                      <td>{
                        <FormGroup controlId="formSelectSection">
                          <FormControl
                            componentClass="select"
                            value={this.state.newStudent.sectionID ? this.state.newStudent.sectionID : '0'}
                            onChange={this.updateCreateField.bind(this, 'sectionID')}>
                            {
                              this.state.options.map((option, i) => {
                                return (<option key={i} value={option.sectionID}>{option.teacher.firstName + ' ' + option.teacher.lastName}</option>)
                              })
                            }
                          </FormControl>
                        </FormGroup>
                      } </td>
                      <td><Button bsStyle='primary' onClick={this.createStudent.bind(this)}>ADD STUDENT</Button></td>
                    </tr>
                  </tbody>
                </Table>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default AddStudents