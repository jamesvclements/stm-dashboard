import React, { PropTypes as T } from 'react'
import { PageHeader, ListGroup, ListGroupItem, Panel, Grid, Row, Col, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import * as Utils from '../../utils/Utils'
import './Student.css'

export class Student extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    auth: T.instanceOf(AuthService),
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
          student: student[0]
        })
        console.log(student)
      }).catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: 'Failed to get student from server',
          level: 'error'
        })
      })
    })
  }

  toggleEdit(){
    if(this.state.editStudent){
      let numericKeys = ['behavior','workEthic', 'mathBench', 'cogAT', 'dra', 'elaTotal', 'mathTotal', 'behaviorObservation', 'dial4']
      for (let i = 0; i < numericKeys.length; i++){
        let key = numericKeys[i]
        if( typeof this.state.student[key] === 'string' && this.state.student[key]){
          let tempStudent = this.state.student
          tempStudent[key] = parseInt(this.state.student[key],10)
          this.setState({student : tempStudent })
        }
      }
      let checkedScores = numericKeys.slice(2)
      for (let i = 0; i < checkedScores.length; i++){
        let key = checkedScores[i]
        if(this.validateScore(key) === 'error'){
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


  getInfo(){
    const { student } = this.state
    return (
      <ListGroup fill>
        {
          Utils.cardKeys.filter(key => key in Utils.studentTranslations).sort(Utils.sortStudentStats).map((key, i) => {
            return <Col xs={12} md={6}> <ListGroupItem key={i}>{`${Utils.forHumanAttr(key, student[key])}`}</ListGroupItem> </Col>
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
            return <Col xs={12} md={6}> {this.getFormItem(key, student[key])}</Col>
          })
        }
      </div>
    )
  }

  validateScore(key){
    let val = this.state.student[key]
    let retVal = ''
    //alert(key + " with value " + val)
    if (typeof val === 'undefined'){
      return 'success'
    } else if (isNaN(val)){
      return 'error'
    } else if (typeof val === 'string'){
      if(!val)
        return 'success'
      else {
        val = parseInt(val,10)
        if(isNaN(val))
          return 'error'
      }

    } else if(!val){
      return 'error'
    }
    switch(key){
      case 'mathBench':
        if(val < 0 || val > 100)
          retVal = 'error'
        else
          retVal = 'success'
        break
      case 'cogAT':
        if(val < 0 || val > 160)
            retVal = 'error'
        else
          retVal = 'success'
        break
      case 'dra':
        if(val < 0 || val > 70)
          retVal = 'error'
        else
          retVal = 'success'
        break
      case 'elaTotal':
        if(val < 0 || val > 100)
          retVal = 'error'
        else
          retVal = 'success'
        break
      case 'mathTotal':
        if(val < 0 || val > 100)
          retVal = 'error'
        else
          retVal = 'success'
        break
      case 'behaviorObservation':
        if(val < 0 || val > 54)
          retVal = 'error'
        else
          retVal = 'success'
        break
      case 'dial4':
        if(val < 0 || val > 105)
          retVal = 'error'
        else
          retVal = 'success'
        break
      default:
        retVal = null
    }
    return retVal
  }

  handleChange(key, event){
    let tempStudent = this.state.student
    tempStudent[key] = event.target.value
    this.setState({student : tempStudent })
  }

  getFormItem(key, val){
      //first switch non test scores that expect an empty string
    let nullFlag = false
    if (typeof val === 'undefined' || !val){
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
          <FormGroup controlId={key + "Select"}>
            <ControlLabel>{Utils.studentTranslations[key]}</ControlLabel>
            <FormControl
              componentClass="select"
              onChange={this.handleChange.bind(this, key)}
              value={"" + this.state.student[key]}
              >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </FormControl>
          </FormGroup>
        )
    }
    
    // for rest of the keys, an empty string is ok
    if (typeof val === 'undefined' || !val){
      val = ""
    }

    //test scores
    switch(key){
      case 'mathBench':
      case 'cogAT':
      case 'dra':
      case 'elaTotal':
      case 'mathTotal':
      case 'behaviorObservation':
      case 'dial4':
        return (
          <FormGroup
          controlId={key + "Input"}
          validationState={this.validateScore(key)}
        >
          <ControlLabel>{Utils.studentTranslations[key]}</ControlLabel>
          <FormControl
            value={this.state.student[key]}
            placeholder="Enter Score"
            onChange={this.handleChange.bind(this, key)}
          />
          <FormControl.Feedback />
        </FormGroup>
        )
      case 'behavior':
      case 'workEthic':
        return (
          <FormGroup controlId={key + "Select"}>
            <ControlLabel>{Utils.studentTranslations[key]}</ControlLabel>
            <FormControl componentClass="select" value={this.state.student[key].toString()} onChange={this.handleChange.bind(this,key)} placeholder={'1'}>
              <option value="0">-</option>
              <option value="1">{'\u2713'}</option>
              <option value="2">+</option>
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
              {Utils.round(val / 12, 0)} y. {Utils.round(val % 12, 0)} mo.
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
              value={this.state.student[key]}
              onChange={this.handleChange.bind(this,key)}/>
          </FormGroup>
          )     
      default:
        return null
    }
  }


  render() {
    const { student } = this.state
    return (
      <div className="root">
        <PageHeader>Student Card for {student.firstName + " " + student.lastName}</PageHeader>
          <Grid>
            <Row>
              <Panel>
                {this.state.editStudent ? this.getEditForm() : this.getInfo()}
              </Panel>
            </Row>
          </Grid>
          <Button bsStyle="primary" ref="editButton" onClick={() => this.toggleEdit()}>
            {this.state.editStudent ? "Save Changes" : "Edit Student"}
          </Button>
          {this.state.editStudent ? (<Button ref="editButton" onClick={() => this.discardChanges()}> Discard Changes</Button>) : null}
      </div>
    )
  }
}

export default Student