import React, { PropTypes } from 'react'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import * as Utils from '../../utils/Utils'
import './SimStudentItem.css'

export class SimStudentItem extends React.Component {
  static propTypes = {
    student: PropTypes.object,
  }

  constructor(...args) {
    super(...args)
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
        <ListGroup fill className="student-stats">
          {
            Object.keys(student).filter(key => key in Utils.studentTranslations).sort(Utils.sortStudentStats).map((key, i) => {
              return <ListGroupItem key={i}>{`${Utils.forHumanAttr(key, student[key])}`}</ListGroupItem>
            })
          }
        </ListGroup>
      </Panel>
    )
  }
}

export default SimStudentItem