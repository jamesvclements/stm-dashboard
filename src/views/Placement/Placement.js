import React, { PropTypes as T } from 'react'
import { PageHeader, Grid, Row, Col, Button, Modal, ListGroupItem, ListGroup, Clearfix } from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { Droppable } from 'react-drag-and-drop'
import SectionListGroup from '../../components/Section/SectionListGroup'
import SimStudentItem from '../../components/Student/SimStudentItem'
import * as Utils from '../../utils/Utils'
import './Placement.css'

export class Placement extends React.Component {
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
    this.dummyStudent = {firstName: '', lastName: ''}
    this.state = {
      placement: {
        sections: []
      },
      swapInfo: {
        origInd: 0,
        destInd: 0,
        simStudents: [],
        droppedStudent: this.dummyStudent,
        showModal: false,
      }
    }

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/placements/${this.props.params.grade}`, {
      method: 'GET'
    })
      .then(response => {
        response.json().then(placement => {
          this.setState({
            placement: placement
          })
        })
      }).catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: 'Failed to fetch placement',
          level: 'error'
      })
    })
  }
  onDrop(destTeacher, origData, event){
    const { placement } = this.state
    const { origin, student } = JSON.parse(origData.student)
    //get the destination and origin section indexes
    //TODO change this search to use sectionID or teacherID instead of teacher name
    let destSectionIndex = -1
    let origSectionIndex = -1
    for(let i = 0; i < placement.sections.length; i++){
      if(placement.sections[i].teacher.name === destTeacher){
        destSectionIndex = i
      }
      if(placement.sections[i].teacher.name === origin){
        origSectionIndex = i
      }
    }
    if(origSectionIndex === destSectionIndex){
      //student was dropped onto the section they are already in
      console.log("same section drop")
      return
    }
    else{
      console.log("dropping from index " + origSectionIndex + " to index " + destSectionIndex)
    }

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/similar-student/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student: student,
        section: placement.sections[destSectionIndex]
      })
    }).then(response => {
      response.json().then(simStudents => {
        this.setState({
          swapInfo:{
            origInd: origSectionIndex,
            destInd: destSectionIndex,
            simStudents: simStudents,
            droppedStudent: student,
            showModal: true,
          }
        })
      })
    }).catch(err => {
      console.error(err)
      this.context.addNotification({
        title: 'Error',
        message: 'Failed to update student info',
        level: 'error'
      })
    })


    //TODO indexof isn't supported in IE 7 and 8, i think that's ok
    //move student from origin to dest
    //this.moveStudent(student, origSectionIndex, destSectionIndex)

  }

  moveStudent(student, fromIndex, toIndex){
    console.log('moving ' + student.firstName + ' from ' + fromIndex + ' to ' + toIndex)
    const { placement } = this.state
    let tempPlacement = JSON.parse(JSON.stringify(placement))
    let studentIndex = -1
    for(let i = 0; i < tempPlacement.sections[fromIndex].students.length; i++){
      //TODO compare student ID's not last names when the database is connected!
      if(tempPlacement.sections[fromIndex].students[i].lastName === student.lastName){
        studentIndex = i
        break
      }
    }
    //console.log(student)
    //console.log(tempPlacement.sections[fromIndex].students)
    //console.log("student index = " + studentIndex)
    tempPlacement.sections[fromIndex].students.splice(studentIndex,1)
    tempPlacement.sections[toIndex].students.push(student)

    //recalculate the stats for the two sections that changed
    tempPlacement = this.recalculateStats(tempPlacement, [fromIndex, toIndex])

    this.setState({placement: tempPlacement})
  }

  swapStudents(destStudent,event){
    let origStudent = this.state.swapInfo.droppedStudent
    const {origInd, destInd } = this.state.swapInfo
    const { placement } = this.state
    let tempPlacement = JSON.parse(JSON.stringify(placement))
    if(destStudent){
      //console.log("moving student from destination")

      let studentIndex = -1
      for(let i = 0; i < tempPlacement.sections[destInd].students.length; i++){
        //TODO compare student ID's not last names when the database is connected!
        if(tempPlacement.sections[destInd].students[i].lastName === destStudent.lastName){
          studentIndex = i
          break
        }
      }
      tempPlacement.sections[destInd].students.splice(studentIndex,1)
      tempPlacement.sections[origInd].students.push(destStudent)
    }

    let studentIndex = -1
    for(let i = 0; i < tempPlacement.sections[origInd].students.length; i++){
      //TODO compare student ID's not last names when the database is connected!
      if(tempPlacement.sections[origInd].students[i].lastName === origStudent.lastName){
        studentIndex = i
        break
      }
    }
    tempPlacement.sections[origInd].students.splice(studentIndex,1)
    tempPlacement.sections[destInd].students.push(origStudent)

    tempPlacement = this.recalculateStats(tempPlacement, [origInd, destInd])

    this.setState({
      placement: tempPlacement,
      swapInfo: {
        origInd: 0,
        destInd: 0,
        simStudents: [],
        droppedStudent: this.dummyStudent,
        showModal: false,
      }
    })
  }

  recalculateStats(tempPlacement, indices){
    console.log(indices)
    const { grade } = this.props.params

    if(grade === "0"){
      //console.log("kindergarten yo")
      const reducer = (stats, student) => {
        stats.behavior += student.behaviorObservation
        stats.dial4 += student.dial4
        stats.age += student.age
        if (student.sex === 'F') {
          stats.females++
        } else {
          stats.males++
        }
        if (student.potentialDelay) {
          stats.potentialDelays++
        }
        stats.count++
        return stats
      }

      for (let i = 0; i < indices.length; i++) {
        let stats = tempPlacement.sections[indices[i]].students.reduce(reducer, {
          behavior: 0,
          dial4: 0,
          age: 0,
          females: 0,
          males: 0,
          potentialDelays: 0,
          count: 0
        })
        stats['avgBehavior'] = stats.behavior / stats.count
        stats['avgDial4'] = stats.dial4 / stats.count
        stats['avgAge'] = stats.age / stats.count
        stats['genderRatio'] = stats.males / stats.females
        tempPlacement.sections[indices[i]].stats = stats
        //console.log("section " + i + " stats: " + tempPlacement.sections[i].stats)
      }
    } else {
      const reducer = (stats, student) => {
        stats.behavior += student.behaviorScore
        stats.score += student.weightedScore
        if (student.sex === 'F') {
          stats.females++
        } else {
          stats.males++
        }
        if (student.asp) {
          stats.asps++
        }
        if (student.hmp) {
          stats.hmps++
        }
        if (student.advancedMath) {
          stats.advancedMaths++
        }
        if (student.medicalConcern) {
          stats.medicalConcerns++
        }
        if (student.facultyStudent) {
          stats.facultyStudents++
        }
        if (student.newStudent) {
          stats.newStudents++
        }
        stats.count++
        return stats
      }

      for (let i = 0; i < indices.length; i++) {
        let stats = tempPlacement.sections[indices[i]].students.reduce(reducer, {
          asps: 0,
          hmps: 0,
          advancedMaths: 0,
          behavior: 0,
          score: 0,
          females: 0,
          males: 0,
          medicalConcerns: 0,
          facultyStudents: 0,
          newStudents: 0,
          count: 0
        })
        stats['avgBehavior'] = stats.behavior / stats.count
        stats['avgTestScore'] = stats.score / stats.count
        stats['genderRatio'] = stats.males / stats.females
        tempPlacement.sections[indices[i]].stats = stats
      }
    }
    return tempPlacement
  }

  savePlacement(event){
    const { grade } = this.props.params
    const { placement } = this.state
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/placements/${grade}`, 
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grade: grade,
        placement: placement
      })
    })
    .then(() => {
      this.context.addNotification({
        title: 'Success',
        message: 'Placement Saved!',
        level: 'success'
      })
    })
    .catch(err => {
      console.error(err)
      this.context.addNotification({
        title: 'Error',
        message: 'Failed to save placement',
        level: 'error'
      })
    })    
  }

  closeModal(){
    this.setState({
      swapInfo: {
        origInd: 0,
        destInd: 0,
        simStudents: [],
        droppedStudent: this.dummyStudent,
        showModal: false,
      }
    })
  }

  render() {

    const { grade } = this.props.params
    const { placement } = this.state
    return (
      <div className="root">
        <PageHeader>{Utils.ordinal(grade)} Placement</PageHeader>
        <Grid>
          <Row>
            <Col xs={12}><Button block bsStyle="primary" onClick={this.savePlacement.bind(this)}>Save Placement</Button></Col>
            {
              placement.sections.map((section, i) => {
                return (
                  <Droppable key={section.teacher.name} types={['student']} onDrop={this.onDrop.bind(this, section.teacher.name)}>
                    <Col key={i} md={(placement.sections.length === 4) ? 3 : 4} xs={12}><SectionListGroup section={section}></SectionListGroup></Col>
                  </Droppable>
                )
              })
            }
          </Row>
        </Grid>
        <Modal show={this.state.swapInfo.showModal} onHide={this.closeModal.bind(this)} bsSize='large'>
          <Modal.Header>
            <Modal.Title>Similar Students to {this.state.swapInfo.droppedStudent.firstName + ' ' + this.state.swapInfo.droppedStudent.lastName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid fluid>
              
              <ListGroup fill className="student-stats">
                {
                  Object.keys(this.state.swapInfo.droppedStudent).filter(key => key in Utils.studentTranslations).sort(Utils.sortStudentStats).map((key, i) => {
                    return (
                      <Col key={i + 'A'}xs={6}>
                        <ListGroupItem key={i + 'B'}>{`${Utils.forHumanAttr(key, this.state.swapInfo.droppedStudent[key])}`}</ListGroupItem>
                      </Col>
                    )
                  })
                  
                }
              </ListGroup>
              <Clearfix visibleLgBlock visibleMdBlock visibleSmBlock visibleXsBlock/>
              <br/>
              <ListGroup>
                {
                  this.state.swapInfo.simStudents.map((student, i) => {
                    return (
                        <Col key={i + 'A'} xs={6}>
                          <ListGroupItem key={i + 'B'}>
                            <SimStudentItem student={student} key={i + 'C'}/>
                            <Button onClick={this.swapStudents.bind(this, student)}className='modalButton' bsStyle="primary" key={i + 'D'}>{'Swap ' + student.firstName + ' and ' + this.state.swapInfo.droppedStudent.firstName}</Button>
                          </ListGroupItem>
                        </Col>
                    )
                  })
                }
                
                <Col xs={6}>
                  <ListGroupItem>
                    <Button className='modalButton' bsStyle="primary" onClick={this.swapStudents.bind(this, null)}>{'Move ' + this.state.swapInfo.droppedStudent.firstName + ', dont swap with anyone'}</Button>
                  </ListGroupItem>
                </Col>
              </ListGroup>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.closeModal.bind(this)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Placement