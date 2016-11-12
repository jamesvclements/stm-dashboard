import React, { PropTypes as T } from 'react'
import { PageHeader, ListGroup, ListGroupItem, Panel, Grid, Row, Col} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import * as Utils from '../../utils/Utils'
import './Student.css'

export class Placement extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    auth: T.instanceOf(AuthService),
    profile: T.object,
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
        this.setState({
          student: student
        })
        console.log(student)
      })
    })
  }

  render() {
    const { studentID } = this.props.params
    const { student } = this.state

    return (
      <div className="root">
        <PageHeader>Student Card for {student.firstName + " " + student.lastName}</PageHeader>
          <Grid>
            <Row>
              <Panel>
                <ListGroup fill className="student-stats">
                  {
                    Utils.cardKeys.filter(key => key in Utils.studentTranslations).sort(Utils.sortStudentStats).map((key, i) => {
                      return <Col xs={12} md={6}> <ListGroupItem key={i}>{`${Utils.forHumanAttr(key, student[key])}`}</ListGroupItem> </Col>
                    })
                  }
                </ListGroup>
              </Panel>
            </Row>
          </Grid>
      </div>
    )
  }
}

export default Placement