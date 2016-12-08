import React, { PropTypes as T } from 'react'
import { render } from 'react-dom'
import { PageHeader, Breadcrumb, ListGroup, ListGroupItem, Panel, Grid, Row, Col, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import { StudentViewForm } from '../../components/Student/StudentViewForm/StudentViewForm'
import { StudentEditForm } from '../../components/Student/StudentEditForm/StudentEditForm'
import * as Utils from '../../utils/Utils'
import './BulkEdit.css'

export class BulkEdit extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    student: T.array
  }

  constructor(props) {
    super(props)

    this.state = {
      student: [],
	  currentStudentIndex: 0
    }

	//TO DO: change to fetch section
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/sections/${this.props.params.sectionID}`, {
      method: 'GET'
    }).then(response => {
      response.json().then(section => {
        this.setState({
          student: section.students
        })
        if (response.ok) {
          this.setState({
            student: section.students
          })
        } else {
          this.context.addNotification({
            title: 'Error',
            message: 'Failed to fetch student',
            level: 'error'
          })
        }
      }).catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: 'Failed to fetch student',
          level: 'error'
        })
      })
    })
  }


  toggleEdit() {
    if (this.state.editStudent) {
      let tempStudent = this.state.student
      if (tempStudent.behavior === 'null') {
        tempStudent.behavior = null
      } else {
        tempStudent.behavior = parseInt(tempStudent.behavior, 10)
      }
      if (tempStudent.workEthic === 'null') {
        tempStudent.workEthic = null
      } else {
        tempStudent.workEthic = parseInt(tempStudent.workEthic, 10)
      }
      let numericKeys = ['mathBench', 'cogAT', 'dra', 'elaTotal', 'mathTotal', 'behaviorObservation', 'dial4']
      for (let i = 0; i < numericKeys.length; i++) {
        let key = numericKeys[i]
        if (typeof this.state.student[key] === 'string' && this.state.student[key]) {
          tempStudent[key] = parseInt(this.state.student[key], 10)
        }
      }

      this.setState({ student: tempStudent })

      for (let i = 0; i < numericKeys.length; i++) {
        let key = numericKeys[i]
        if (Utils.validateScore(key, this.state.student[key]) === 'error') {
          this.context.addNotification({
            title: 'Error',
            message: `Invalid value entered for ${Utils.studentTranslations[key]}`,
            level: 'error'
          })
          return
        }
      }
      fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/students/${this.props.params.studentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: this.state.student
        })
      }).catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: 'Failed to update student info',
          level: 'error'
        })
      })
    } else {
      this.unchangedStudent = JSON.parse(JSON.stringify(this.state.student))
    }
    this.setState({ editStudent: !this.state.editStudent})
  }

  /*
  discardChanges(){
    this.setState({ student[this.state.currentStudentIndex]: this.unchangedStudent})
  }
*/

  render() {
    const { student } = this.state
    return (
      <div className="root">
      <Breadcrumb>
          <Breadcrumb.Item href="#/landing">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#/students">
            Students
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            EditStudent
          </Breadcrumb.Item>
        </Breadcrumb>
        <PageHeader>{`${student[this.currentStudentIndex].firstName} ${student[this.state.currentStudentIndex].lastName}`}</PageHeader>
        <Grid>
            <Row>
				<StudentEditForm student={student[this.state.currentStudentIndex]}/> 
            </Row>
        </Grid>
		<Button bsStyle="primary" ref="editButton" onClick={() => this.toggleEdit()}>
          {this.state.editStudent ? 'Save Changes' : 'Edit Student'}
        </Button>
        {this.state.editStudent ? (<Button ref="editButton" onClick={() => this.discardChanges()}> Discard Changes</Button>) : null}
	  </div>
    )
  }
}

export default BulkEdit