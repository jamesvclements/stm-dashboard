import React, { PropTypes } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import * as Utils from '../../../utils/Utils'
import './StudentStats.css'

export class StudentStats extends React.Component {
  static propTypes = {
    student: PropTypes.object,
  }

  render() {
    const student = this.props.student
    return (
        <ListGroup className="student-stats">
          {
            Object.keys(student).filter(key => key in Utils.studentTranslations).sort(Utils.sortStudentStats).map((key, i) => {
              return <ListGroupItem key={i}>{`${Utils.forHumanAttr(key, student[key])}`}</ListGroupItem>
            })
          }
        </ListGroup>
    )
  }
}

export default StudentStats