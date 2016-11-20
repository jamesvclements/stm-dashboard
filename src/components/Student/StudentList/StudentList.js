import React, { PropTypes } from 'react'
import { ListGroup } from 'react-bootstrap'
import StudentListItem from '../StudentListItem/StudentListItem'
import './StudentList.css'

export class StudentList extends React.Component {
  static propTypes = {
    students: PropTypes.array
  }

  render() {
    const { students } = this.props
    return (
      <ListGroup>
        {
          students.map((student, i) => {
            return <StudentListItem student={student} key={i} />
          })
        }
      </ListGroup>
    )
  }
}

export default StudentList