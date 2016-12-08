import React, { PropTypes as T } from 'react'
import { Grid, Row, Col, Breadcrumb } from 'react-bootstrap'
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

  render() {
    const { students } = this.state
    return (
      <div className="root">
        <Breadcrumb>
          <Breadcrumb.Item href="#/landing">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Students
          </Breadcrumb.Item>
        </Breadcrumb>
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