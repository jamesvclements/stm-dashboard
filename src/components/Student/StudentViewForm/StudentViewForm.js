import React, { PropTypes as T} from 'react'
import { PageHeader, Panel, ListGroup, ListGroupItem, Grid, Row, Col } from 'react-bootstrap'
import * as Utils from '../../../utils/Utils'
  
export class StudentViewForm extends React.Component {
  static contextTypes = {
    router: T.object
  }
  
  static propTypes = {
    student: T.object
  }
  
  constructor(props) {
    super(props)

    this.state = {
      student: {}
    }
	
	fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/students/${this.props.params.studentID}`, {
      method: 'GET'
    }).then(response => {
      response.json().then(student => {
        if (response.ok) {
          this.setState({
            student: student
          })
        } else {
          this.context.addNotification({
            title: 'Error',
            message: 'Failed to fetch student',
            level: 'error'
          })
        }
      }).catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: 'Failed to fetch student',
          level: 'error'
        })
      })
    })
	
  }
  
   getInfo() {
    const { student } = this.state
    return (
      <ListGroup fill className="student-info-list-group">
        {
          Utils.cardKeys.filter(key => key in Utils.studentTranslations).sort(Utils.sortStudentStats).map((key, i) => {
            return (
              <Col key={i} xs={12} md={6}>
                <ListGroupItem className="student-info-list-group-item">{`${Utils.forHumanAttr(key, student[key])}`}</ListGroupItem>
              </Col>)
          })
        }
      </ListGroup>
    )
  }

  render() {
    const { student } = this.state
    return (
      <div className="root">
        <PageHeader>{`${student.firstName} ${student.lastName}`}</PageHeader>
        <Grid>
          <Panel>
            <Row>
                {this.getInfo()}
            </Row>
          </Panel>
        </Grid>
      </div>
    )
  }
}

export default StudentViewForm