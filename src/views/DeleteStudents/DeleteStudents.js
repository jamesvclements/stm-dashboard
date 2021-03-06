import React, { PropTypes as T } from 'react'
import { Panel, Table, Button, FormGroup, FormControl, Breadcrumb, ControlLabel, Grid, Row, Col } from 'react-bootstrap'
import './DeleteStudents.css'

export class DeleteStudents extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    students: T.array
  }

  constructor() {
    super()

    this.state = {
      nameFilter: '',
      students: []
    }

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/students`, {
      method: 'GET'
    })
      .then(response => {
        if (response.ok) {
          response.json().then(students => {
            this.setState({
              students: students
            })
          })
        } else {
          this.notifyError('Failed to fetch students')
        }
      }).catch(err => {
        console.error(err)
        this.notifyError('Failed to fetch students')
      })
  }


  deleteStudent(studentID) {

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/students/${studentID}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: studentID
        })


      })
      .then(() => {
        this.context.addNotification({
          title: 'Success',
          message: 'Successfully deleted student',
          level: 'success'
        })
        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/students`, {
          method: 'GET'
        })
          .then(response => {
            if (response.ok) {
              response.json().then(students => {
                this.setState({
                  students: students
                })
              })
            } else {
              this.notifyError('Failed to fetch students')
            }
          }).catch(err => {
            console.error(err)
            this.notifyError('Failed to fetch students')
          })


      })
      .catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: 'Failed to delete student',
          level: 'error'
        })
      })

  }

  changeNameFilter(event) {
    this.setState({
      nameFilter: event.target.value
    })
  }



  render() {
    const { nameFilter, students } = this.state
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
            Delete Student
          </Breadcrumb.Item>
        </Breadcrumb>

        <Grid fluid>
          <Row>
            <Col xs={12}>
              <Panel header="Filters">
                <FormGroup>
                  <ControlLabel>Name</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder="John Smith"
                    onChange={this.changeNameFilter.bind(this)}
                    />
                </FormGroup>
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Table striped bordered condensed hover className="delete-students">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Grade</th>
                    <th>Teacher</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    students
                      .filter(student => {
                        return `${student.firstName} ${student.lastName}`.toLowerCase().includes(nameFilter)
                      })
                      .map((student, i) => {
                        return (
                          <tr key={i}>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td>{(parseInt(student.grade, 10) === 0) ? 'K' : student.grade}</td>
                            <td>{`${student.teacher.firstName} ${student.teacher.lastName}`}</td>
                            <td><Button block bsStyle='danger' onClick={this.deleteStudent.bind(this, student.id)}>{`DELETE ${student.firstName} ${student.lastName}`}</Button></td>
                          </tr>
                        )
                      })
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Grid>

      </div >
    )
  }
}

export default DeleteStudents