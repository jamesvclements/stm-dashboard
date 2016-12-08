import React, { PropTypes as T } from 'react'
import { Panel, Table, Button, FormGroup, FormControl, ControlLabel, Grid, Row, Col } from 'react-bootstrap'
import './DelStudentTable.css'

export class DelStudentTable extends React.Component {
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
    }
  }


  deleteStudent(id) {
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/students`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id
        })
      })
      .then(() => {
        this.context.addNotification({
          title: 'Success',
          message: 'Successfully deleted student',
          level: 'success'
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
    const { students } = this.props
    const { nameFilter } = this.state
    return (
      <div>
        <Panel header="Filters">
          <Grid fluid>
            <Row>
              <Col md={4} xs={12}>
                <FormGroup>
                  <ControlLabel>Name</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder="John Smith"
                    onChange={this.changeNameFilter.bind(this)}
                    />
                </FormGroup>
              </Col>
            </Row>
          </Grid>
        </Panel>
        <Table striped bordered condensed hover className="Del-student-table-table">
          <thead>
            <tr>
              <th>#</th>
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
                      <td>{i}</td>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>{(parseInt(student.grade, 10) === 0) ? 'K' : student.grade}</td>
                      <td>{`${student.teacher.firstName} ${student.teacher.lastName}`}</td>
                      <td>
                        <Button
                          block
                          bsStyle="danger"
                          onClick={this.deleteStudent.bind(this, student.id)}>
                          {'Delete ' + student.firstName + student.lastName}
                        </Button>
                      </td>
                    </tr>
                  )
                })
            }
          </tbody>
        </Table>
      </div >
    )
  }
}

export default DelStudentTable