import React, { PropTypes as T } from 'react'
import { Table, Button } from 'react-bootstrap'
import './StudentTable.css'

export class StudentTable extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    sectionID: T.string,
    students: T.array
  }

  render() {
    const { students } = this.props
    return (
      <div>
        <Table striped bordered condensed hover className="student-table-table">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              students
                .map((student, i) => {
                  return (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>
                        <Button
                          block
                          bsStyle="primary"
                          onClick={() => { this.context.router.push(`/students/bulk-edit/${this.props.sectionID}/${student.id}/view`) } }>
                          View Card
                        </Button>
                      </td>
                    </tr>
                  )
                })
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

export default StudentTable