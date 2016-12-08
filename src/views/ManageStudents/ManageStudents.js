import React, { PropTypes as T } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { Panel } from 'react-bootstrap'
import { Table, FormGroup, FormControl, Button, Breadcrumb } from 'react-bootstrap'
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
            newStudent: {
                Grade: '0', 
                id: null,
                lastName: null,
                sex: null,
                dob: null
            },
            options: [],
        }

        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/grades/0`, {
            method: 'GET'
        })
            .then(response => {

                if (response.ok) {
                    response.json().then(grade => {
                        console.log(grade)
                        // bind the values of section dropdown to 
                        let options = []
                        for (let section of grade.sections) {
                            options.push({ teacher: section.teacher, sectionID: section.sectionID })
                        }
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

        // this.getStudentList()
    }


    updateCreateField(field, event) {
        let tempMember = this.state.newStudent
        if (field === 'name') {
            tempMember.name = event.target.value
            tempMember.firstName = tempMember.name.split(' ')[0]
            if (tempMember.name.split(' ').length !== 1)
                tempMember.lastName = event.target.value.substr(tempMember.firstName.length + 1)
        } else if (field === 'grade') {
            tempMember.grade = event.target.value
            this.setState({
                newStudent: tempMember
            })
            fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/grades/${event.target.value}`, {
                method: 'GET'
            })
                .then(response => {

                    if (response.ok) {
                        response.json().then(grade => {
                            console.log(grade)
                            // bind the values of section dropdown to 
                            let options = []
                            for (let section of grade.sections) {
                                options.push({ teacher: section.teacher, sectionID: section.sectionID })
                            }
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
        else {
            tempMember[field] = event.target.value
        }

        this.setState({
            newStudent: tempMember
        })
    }





    createStudent() {
        if (!this.state.newStudent.firstName || !this.state.newStudent.lastName || !this.state.newStudent.id) {
            let error = ''
            if (!this.state.newStudent.firstName) {
                error = 'no name provided'
            } else if (!this.state.newStudent.lastName) {
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
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        student: this.state.newStudent
                    })
                })
                .then(() => {
                    this.context.addNotification({
                        title: 'Success',
                        message: 'Successfully created new student',
                        level: 'success'
                    })

                    this.context.router.push(`/students/${this.state.newStudent.id}`)




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
                                            value={(this.state.newStudent.name)}
                                            onChange={this.updateCreateField.bind(this, 'name')}
                                            />
                                    </FormGroup>
                                </td>
                                <td>
                                    <FormGroup controlId="formBasicTextID">
                                        <FormControl
                                            type="text"
                                            placeholder="Enter Student ID"
                                            value={(this.state.newStudent.id)}
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

                                <td>{

                                    <FormGroup controlId="formSelectSection">
                                        <FormControl
                                            componentClass="select"
                                            value={this.state.newStudent.section ? this.state.newStudent.section : '0'}
                                            onChange={this.updateCreateField.bind(this, 'section')}>

                                            {
                                                this.state.options.map((option, i) => {
                                                    return (<option key={i} value={option.sectionID}>{option.teacher.firstName + ' ' + option.teacher.lastName}</option>)
                                                })
                                            }
                                        </FormControl>
                                    </FormGroup>


                                }</td>


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
//onClick={this.context.router.push(`/students/${this.state.newStudent.id}`)