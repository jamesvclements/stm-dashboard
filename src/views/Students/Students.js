import React, { PropTypes as T } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import DynamicStudentTable from '../../components/Student/DynamicStudentTable/DynamicStudentTable'
import './Students.css'

export class Students extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  notifyError(message) {
    this.context.addNotification({
      title: 'Error',
      message: message,
      level: 'error'
    })
  }

  constructor(props) {
    super(props)

    this.state = {
      students: []
    }

    if ('sectionID' in this.props.params) {
      fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/sections/${this.props.params.sectionID}`, {
        method: 'GET'
      })
        .then(response => {
          if (response.ok) {
            response.json().then(section => {
              this.setState({
                students: section.students
              })
            })
          } else {

          }
        }).catch(err => {
          console.error(err)
          this.notifyError(`Failed to fetch students from section ${this.props.params.sectionID}`)
        })
    } else if ('grade' in this.props.params) {
      fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/grades/${this.props.params.grade}`, {
        method: 'GET'
      })
        .then(response => {
          if (response.ok) {
            response.json().then(grade => {
              let students = []
              for (let section of grade.sections) {
                students.push(section.students)
              }
              this.setState({
                students: students
              })
            })
          } else {
            this.notifyError(`Failed to fetch students from grade ${this.props.params.grade}`)
          }
        }).catch(err => {
          console.error(err)
          this.notifyError(`Failed to fetch students from grade ${this.props.params.grade}`)
        })
    } else {
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
  }

  render() {
    const { students } = this.state
    return (
      <div className="root">
        <Grid>
          <Row>
            <Col xs={12}>
              <DynamicStudentTable students={students} />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Students