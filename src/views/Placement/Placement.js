import React, { PropTypes as T } from 'react'
import { PageHeader, Grid, Row, Col, Button } from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { ordinal } from '../../utils/Utils'
import { Droppable } from 'react-drag-and-drop'
import SectionListGroup from '../../components/Section/SectionListGroup'
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

    this.state = {
      placement: {
        sections: []
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

    //TODO indexof isn't supported in IE 7 and 8, i think that's ok
    //move student from origin to dest
    this.moveStudent(student, origSectionIndex, destSectionIndex)

  }

  moveStudent(student, fromIndex, toIndex){
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
    console.log("student index = " + studentIndex)
    tempPlacement.sections[fromIndex].students.splice(studentIndex,1)
    tempPlacement.sections[toIndex].students.push(student)

    //recalculate the stats for the two sections that changed
    tempPlacement = this.recalculateStats(tempPlacement, [fromIndex, toIndex])

    this.setState({placement: tempPlacement})
  }

  recalculateStats(tempPlacement, indices){
    console.log(indices)
    const { grade } = this.props.params

    if(grade === "0"){
      console.log("kindergarten yo")
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
        console.log("section " + i + " stats: " + tempPlacement.sections[i].stats)
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
  render() {

    const { grade } = this.props.params
    const { placement } = this.state
    return (
      <div className="root">
        <PageHeader>{ordinal(grade)} Placement</PageHeader>
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
      </div>
    )
  }
}

export default Placement