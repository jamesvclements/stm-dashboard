import React, { PropTypes as T} from 'react'
import { Panel, Button } from 'react-bootstrap'
import { Draggable } from 'react-drag-and-drop'
import  { StudentStats } from '../StudentStats/StudentStats'
import './DraggableStudentListItem.css'

export class DraggableStudentListItem extends React.Component {
  static contextTypes = {
    router: T.object
  }
  
  static propTypes = {
    student: T.object,
    sectionIndex: T.number,
    studentIndex: T.number
  }

  constructor() {
    super()

    this.state = {
      open: false,
      button: false
    }
  }


  render() {
    const { student } = this.props
    const { sectionIndex } = this.props
    const { studentIndex } = this.props
    return (
      <Draggable type="student" data={JSON.stringify({student: student, sectionIndex: sectionIndex, studentIndex: studentIndex})}>
        <Panel
          header={`${student.firstName} ${student.lastName}`} 
          collapsible 
          expanded={this.state.open} 
          onClick={() => this.setState({ open: !this.state.open })}
          className="student-panel">
          <StudentStats fill student={student}></StudentStats>
          <Button 
            block
            bsStyle="primary"
            onClick={() => this.context.router.push(`/students/${student.id}`)}>
            View Card
          </Button>
        </Panel>
      </Draggable>
    )
  }
}

export default DraggableStudentListItem