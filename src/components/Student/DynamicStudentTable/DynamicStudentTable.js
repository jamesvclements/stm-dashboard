import React, { PropTypes as T } from 'react'
import { Panel, Table, Button, FormGroup, FormControl, ControlLabel, Grid, Row, Col } from 'react-bootstrap'
import './DynamicStudentTable.css'

export class DynamicStudentTable extends React.Component {
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
      gradeFilter: '',
      teacherFilter: ''
    }
  }

  changeNameFilter(event) {
    this.setState({
      nameFilter: event.target.value
    })
  }

  changeGradeFilter(event) {
    this.setState({
      gradeFilter: event.target.value
    })
  }

  changeTeacherFilter(event) {
    this.setState({
      teacherFilter: event.target.value
    })
  }

  render() {
    const { students } = this.props
    const { nameFilter } = this.state
    const { gradeFilter } = this.state
    const { teacherFilter } = this.state
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
              <Col md={4} xs={12}>
                <FormGroup>
                  <ControlLabel>Grade</ControlLabel>
                  <FormControl 
                    componentClass="select"
                    placeholder="ALL"
                    onChange={this.changeGradeFilter.bind(this)}>
                    <option value={''}>ALL</option>
                    <option value={0}>K</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                  </FormControl>
                </FormGroup>
              </Col>
              <Col md={4} xs={12}>
                <FormGroup>
                  <ControlLabel>Teacher</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder="Sally Mae"
                    onChange={this.changeTeacherFilter.bind(this)}
                    />
                </FormGroup>
              </Col>
            </Row>
          </Grid>
        </Panel>
        <Table striped bordered condensed hover className="dynamic-student-table-table">
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
                    && (gradeFilter === '' || student.sectionID[0] === gradeFilter)
                    && `${student.teacher.firstName} ${student.teacher.lastName}`.toLowerCase().includes(teacherFilter)
                })
                .map((student, i) => {
                  return (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>{student.grade ? ((parseInt(student.grade, 10) === 0) ? 'K' : student.grade) : ((parseInt(student.sectionID[0], 10) === 0) ? 'K' : parseInt(student.sectionID[0], 10))}</td>
                      <td>{student.teacher.firstName ? `${student.teacher.firstName} ${student.teacher.lastName}`: ''}</td>
                      <td>
                        <Button
                          block
                          bsStyle="primary"
                          onClick={() => { this.context.router.push(`/students/${student.id}`) } }>
                          View Card
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

export default DynamicStudentTable