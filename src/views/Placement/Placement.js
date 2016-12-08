import React, { PropTypes as T } from 'react'
import { PageHeader, Grid, Row, Col, Button, Modal, Breadcrumb } from 'react-bootstrap'
import { Droppable } from 'react-drag-and-drop'
import SectionListGroup from '../../components/Section/SectionListGroup'
import StudentListItem from '../../components/Student/StudentListItem/StudentListItem'
import StudentStats from '../../components/Student/StudentStats/StudentStats'
import { ordinal } from '../../utils/Utils'
import './Placement.css'

export class Placement extends React.Component {
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
      placement: {
        sections: []
      },
      swapInfo: {
        originalSectionIndex: 0,
        destinationSectionIndex: 0,
        originalStudentIndex: 0,
        swapStudentIndex: 0,
        similarStudents: [],
        originalStudent: {},
        showModal: false,
      }
    }

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/placements/${this.props.params.grade}`, {
      method: 'GET'
    })
      .then(response => {
        if (response.ok) {
          response.json().then(placement => {
            this.setState({
              placement: placement
            })
          })
        } else {
          this.context.addNotification({
            title: 'Error',
            message: `Failed to fetch placement for grade ${this.props.params.grade}`,
            level: 'error'
          })
        }
	})
  }

  reset() {
    this.setState({
      swapInfo: {
        originalSectionIndex: 0,
        destinationSectionIndex: 0,
        originalStudentIndex: 0,
        swapStudentIndex: 0,
        similarStudents: [],
        originalStudent: {},
        showModal: false,
      }
    })
  }

  onDrop(destinationSectionIndex, data, event) {
    data = JSON.parse(data.student)
    const { student } = data
    const originalSectionIndex = data.sectionIndex
    const originalStudentIndex = data.studentIndex
    // dropped on a new section
    if (originalSectionIndex !== destinationSectionIndex) {
      fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/students/similar-student/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: student,
          section: this.state.placement.sections[destinationSectionIndex]
        })
      }).then(response => {
        if (response.ok) {
          response.json().then(similarStudents => {
            this.setState({
              swapInfo: {
                originalStudent: student,
                originalSectionIndex: originalSectionIndex,
                originalStudentIndex: originalStudentIndex,
                destinationSectionIndex: destinationSectionIndex,
                similarStudents: similarStudents,
                showModal: true,
              }
            })
          })
        } else {
          this.context.addNotification({
            title: 'Error',
            message: 'Failed to fetch similar students',
            level: 'error'
          })
        }
      }).catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: 'Failed to fetch similar students',
          level: 'error'
        })
      })
    }
  }

  swapStudents(destinationStudent, event) {
    const { originalStudent, originalSectionIndex, originalStudentIndex, destinationSectionIndex } = this.state.swapInfo
    const { placement } = this.state
    let newPlacement = JSON.parse(JSON.stringify(placement))

    // add swap student to original student's section and remove from destination section
    if (destinationStudent) {
      // find destinationStudent's index
      let destinationStudentIndex = -1
      for (let i = 0; i < placement.sections[destinationSectionIndex].students.length; i++) {
        // TODO replace with student.id
        if (placement.sections[destinationSectionIndex].students[i].lastName === destinationStudent.lastName) {
          destinationStudentIndex = i
        }
      }
      newPlacement.sections[originalSectionIndex].students.push(destinationStudent)
      newPlacement.sections[destinationSectionIndex].students.splice(destinationStudentIndex, 1)
    }

    // move student to the destination section and remove from their original section
    newPlacement.sections[destinationSectionIndex].students.push(originalStudent)
    newPlacement.sections[originalSectionIndex].students.splice(originalStudentIndex, 1)

    // save the new placement
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/placements/${this.props.params.grade}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlacement)
      })
      .then(response => {
        if (response.ok) {
          response.json().then(updatedPlacement => {
            this.setState({
              placement: updatedPlacement
            })
            this.context.addNotification({
              title: 'Success',
              message: 'Placement saved',
              level: 'success'
            })
          })
        } else {
          this.context.addNotification({
            title: 'Error',
            message: 'Failed to save placement',
            level: 'error'
          })
        }
      })
      .catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: 'Failed to save placement',
          level: 'error'
        })
      })

    this.reset()
  }

  render() {
    const { grade } = this.props.params
    const { placement } = this.state
    const { originalStudent } = this.state.swapInfo
    const { similarStudents } = this.state.swapInfo

    return (
      <div className="root">
        <Breadcrumb>
          <Breadcrumb.Item href="#/landing">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#/run-placements">
            Run Placements
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Placement
          </Breadcrumb.Item>
        </Breadcrumb>
        <PageHeader>{ordinal(grade)} Placement</PageHeader>
        <Grid>
          <Row>
            {
              placement.sections.map((section, i) => {
                return (
                  <Droppable key={i} types={['student']} onDrop={this.onDrop.bind(this, i)}>
                    <Col md={(placement.sections.length === 4) ? 3 : 4} xs={12}>
                      <SectionListGroup section={section} sectionIndex={i}></SectionListGroup>
                    </Col>
                  </Droppable>
                )
              })
            }
          </Row>
        </Grid>
        <Modal show={this.state.swapInfo.showModal} onHide={this.reset.bind(this)} bsSize='large'>
          <Modal.Body>
            <Grid fluid>
              <Row>
                <Col xs={6}>
                  <h4>{`${originalStudent.firstName} ${originalStudent.lastName}`}</h4>
                  <StudentStats student={originalStudent}></StudentStats>
                </Col>
                <Col xs={6}>
                  <h4>Similar Students</h4>
                  <Grid fluid>
                    {
                      similarStudents.map((similarStudent, i) => {
                        return (
                          <Row key={i}>
                            <Col xs={10}>
                              <StudentListItem student={similarStudent}></StudentListItem>
                            </Col>
                            <Col xs={2}>
                              <Button
                                onClick={this.swapStudents.bind(this, similarStudent)}
                                bsStyle="primary">
                                SWAP
                              </Button>
                            </Col>
                          </Row>
                        )
                      })
                    }
                  </Grid>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button block
                    bsStyle="primary"
                    onClick={this.swapStudents.bind(this, null)}>
                    MOVE WITHOUT SWAPPING
                  </Button>
                </Col>
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button block bsStyle="danger" onClick={this.reset.bind(this)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Placement