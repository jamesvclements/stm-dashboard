import React, { PropTypes } from 'react'
import { Panel } from 'react-bootstrap'
import { StudentStats } from '../StudentStats/StudentStats'
import './StudentListItem.css'

export class StudentListItem extends React.Component {
  static propTypes = {
    student: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      open: false,
      button: false
    }
  }


  render() {
    const student = this.props.student
    return (
      <Panel 
        header={
          // temp solution until JSON is standardized
          student.hasOwnProperty('name')
            ? student.name : `${student.firstName} ${student.lastName}`
        } 
        collapsible 
        expanded={this.state.open} 
        onClick={() => this.setState({ open: !this.state.open })}
        className="student-panel">
        <StudentStats student={student}></StudentStats>
      </Panel>
    )
  }
}

export default StudentListItem