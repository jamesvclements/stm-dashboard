import React, { PropTypes as T } from 'react'
import { Grid, Row, Col, PageHeader, Button } from 'react-bootstrap'
import { StudentViewForm } from '../../components/Student/StudentViewForm/StudentViewForm'
import { StudentEditForm } from '../../components/Student/StudentEditForm/StudentEditForm'
import './BulkEdit.css'

export class BulkEdit extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  constructor(props) {
    super(props)

    this.state = {
      section: {
        students: [
          {}
        ]
      },
      studentIndex: 0,
      editing: this.props.params.mode === 'edit'
    }


    console.log(`${process.env.REACT_APP_SERVER_ADDRESS}/api/sections/${this.props.params.sectionID}`)
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/sections/${this.props.params.sectionID}`, {
      method: 'GET'
    })
      .then(response => {
        if (response.ok) {
          response.json().then(section => {
            let studentIndex = -1
            for (let i = 0; i < section.students.length; i++) {
              if (section.students[i].id === this.props.params.studentID) {
                studentIndex = i
                break
              }
            }
            this.setState({
              section: section,
              studentIndex: studentIndex
            })
          })
        } else {
          this.context.addNotification({
            title: 'Error',
            message: `Failed to fetch section ${this.props.params.sectionID}`,
            level: 'error'
          })
        }
      })
      .catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: `Failed to fetch section ${this.props.params.sectionID}`,
          level: 'error'
        })
      })
  }

  getPrevStudent() {
    const { students } = this.state.section
    const { studentIndex } = this.state
    return studentIndex === 0 ? students[students.length - 1].id : students[studentIndex - 1].id
  }

  getNextStudent() {
    const { students } = this.state.section
    const { studentIndex } = this.state
    return studentIndex === students.length - 1 ? students[0].id : students[studentIndex - 1].id
  }

  toggleEdit() {
    this.setState({ editing: !this.state.editing })
  }

  updateStudent(student) {
    let section = JSON.parse(JSON.stringify(this.state.section))
    section.students[this.state.studentIndex] = student
    this.setState({
      section: section
    })
  }

  render() {
    console.log(this.state.section)
    console.log(this.state.studentIndex)
    const { section } = this.state
    const student = section.students[this.state.studentIndex]
    return (
      <div className="root">
        <PageHeader>{`${student.firstName} ${student.lastName}`}</PageHeader>
        <Grid>
          <Row>
            <Col xs={1}>
              <Button onClick={() => 
                {
                  this.context.router.push(`/students/bulk-edit/${section.sectionID}/${this.getPrevStudent()}/${this.state.editing ? 'edit' : 'view'}`)
                  location.reload()
                }}>
                Previous &larr;
              </Button>
            </Col>
            <Col xs={10}>
              {
                this.state.editing ?
                  <StudentEditForm studentID={student.id} toggleEdit={this.toggleEdit.bind(this)} updateStudent={this.updateStudent.bind(this)} />
                  : <StudentViewForm student={student} toggleEdit={this.toggleEdit.bind(this)} />
              }
            </Col>
            <Col xs={1}>
              <Button onClick={() => 
                {
                  this.context.router.push(`/students/bulk-edit/${section.sectionID}/${this.getNextStudent()}/${this.state.editing ? 'edit' : 'view'}`)
                  location.reload()
                }}>
                Next &rarr;
              </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default BulkEdit