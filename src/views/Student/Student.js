import React, { PropTypes as T } from 'react'
import { render } from 'react-dom'
import { PageHeader, Breadcrumb, ListGroup, ListGroupItem, Panel, Grid, Row, Col, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import * as Utils from '../../utils/Utils'
import './Student.css'

export class Student extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    profile: T.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      student: {},
      editStudent: false,
      allowSave: true
    }

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/students/${this.props.params.studentID}`, {
      method: 'GET'
    }).then(response => {
      response.json().then(student => {
        this.setState({
          student: student
        })
        if (response.ok) {
          this.setState({
            student: student
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

  discardChanges(){
    this.setState({ student: this.unchangedStudent})
    this.setState({ editStudent: false})
  }

  getInfo() {
    const { student } = this.state
    return (
      <ListGroup fill className="student-info-list-group">
        {
          Utils.cardKeys.filter(key => key in Utils.studentTranslations).sort(Utils.sortStudentStats).map((key, i) => {
            return (
              <Col key={i} xs={12} md={6}>
                <ListGroupItem className="student-info-list-group-item">{`${Utils.forHumanAttr(key, student[key])}`}</ListGroupItem>
              </Col>)
          })
        }
      </ListGroup>
    )
  }

  getEditForm(){
    const { student } = this.state
    return (
      <div>
        {
          Utils.cardKeys.filter(key => key in Utils.studentTranslations).sort(Utils.sortStudentStats).map((key, i) => {
            return <Col xs={12} md={6} key={i}>{this.getFormItem(key, student[key])}</Col>
          })
        }
      </div>
    )
  }

  handleChange(key, event){
    let tempStudent = this.state.student
    tempStudent[key] = event.target.value
    this.setState({student : tempStudent })
  }

  getFormItem(key, val) {
    // first switch non test scores that expect an empty string
    if (typeof val === 'undefined' || !val) {
      val = 0
    }
    switch (key) {
      case 'potentialDelay':
      case 'advancedMath':
      case 'medicalConcern':
      case 'facultyStudent':
      case 'newStudent':
      case 'hmp':
      case 'asp':
        return (
          <FormGroup controlId={key + 'Select'}>
            <ControlLabel>{Utils.studentTranslations[key]}</ControlLabel>
            <FormControl
              componentClass="select"
              onChange={this.handleChange.bind(this, key)}
              value={'' + this.state.student[key]}
              >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </FormControl>
          </FormGroup>
        )

      default:
        // for rest of the keys, an empty string is ok
        if (typeof val === 'undefined' || !val) {
          val = ''
        }
        // test scores
        switch (key) {
          case 'mathBench':
          case 'cogAT':
          case 'dra':
          case 'elaTotal':
          case 'mathTotal':
          case 'behaviorObservation':
          case 'dial4':
            return (
              <FormGroup
                controlId={key + 'Input'}
                validationState={Utils.validateScore(key, val)}
                >
                <ControlLabel>{Utils.studentTranslations[key]}</ControlLabel>
                <FormControl
                  value={val}
                  placeholder="Enter Score"
                  onChange={this.handleChange.bind(this, key)}
                  />
                <FormControl.Feedback />
              </FormGroup>
            )
          case 'behavior':
          case 'workEthic':
            if (val)
              val = val.toString()
            else
              val = 'null'
            return (
              <FormGroup controlId={key + 'Select'}>
                <ControlLabel>{Utils.studentTranslations[key]}</ControlLabel>
                <FormControl componentClass="select" value={val} onChange={this.handleChange.bind(this, key)} placeholder={'1'}>
                  <option value="0">-</option>
                  <option value="1">{'\u2713'}</option>
                  <option value="2">+</option>
                  <option value="null">N/A</option>
                </FormControl>
              </FormGroup>
            )
          case 'sex':
            return (
              <FormGroup>
                <ControlLabel>{Utils.studentTranslations[key]}</ControlLabel>
                <FormControl.Static>
                  {val}
                </FormControl.Static>
              </FormGroup>
            )
          case 'age':
            return (
              <FormGroup>
                <ControlLabel>{Utils.studentTranslations[key]}</ControlLabel>
                <FormControl.Static>
                  {Utils.round(val / 12, 0)}y. {Utils.round(val % 12, 0)}mo.
                </FormControl.Static>
              </FormGroup>
            )
          case 'comments':
            return (
              <FormGroup controlId="CommentsTextarea">
                <ControlLabel>Comments</ControlLabel>
                <FormControl
                  placeholder="Enter comments here"
                  componentClass="textarea"
                  value={val}
                  onChange={this.handleChange.bind(this, key)} />
              </FormGroup>
            )
          default:
            return null
        }
    }
  }


  render() {
    const { student } = this.state
    return (
      <div className="root">
        <PageHeader>{`${student.firstName} ${student.lastName}`}</PageHeader>
        <Grid>
          <Panel>
            <Row>
                {this.state.editStudent ? this.getEditForm() : this.getInfo()}
            </Row>
          </Panel>
        </Grid>
        <Button bsStyle="primary" ref="editButton" onClick={() => this.toggleEdit()}>
          {this.state.editStudent ? 'Save Changes' : 'Edit Student'}
        </Button>
        {this.state.editStudent ? (<Button ref="editButton" onClick={() => this.discardChanges()}> Discard Changes</Button>) : null}
      </div>
    )
  }
}

export default Student