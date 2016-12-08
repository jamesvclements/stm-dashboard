import React, { PropTypes as T } from 'react'
import { ListGroup, ListGroupItem, Grid, Row, Col, Button } from 'react-bootstrap'
import * as Utils from '../../../utils/Utils'
import './StudentViewForm.css'

export class StudentViewForm extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    student: T.object,
    toggleEdit: T.func
  }

  render() {
    const { student } = this.props
    return (
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <Grid fluid>
                <Row>
                  <Col md={6} xs={12}>
                    <ListGroup fill className="student-view-list-group">
                      {
                        Utils.cardKeys.slice(Utils.cardKeys.length / 2, Utils.cardKeys.length).filter(key => key in Utils.studentTranslations).sort(Utils.sortStudentStats).map((key, i) => {
                          return <ListGroupItem key={i} className="student-view-list-group-item">{`${Utils.forHumanAttr(key, student[key])}`}</ListGroupItem>
                        })
                      }
                    </ListGroup>
                  </Col>
                  <Col md={6} xs={12}>
                    <ListGroup fill className="student-view-list-group">
                      {
                        Utils.cardKeys.slice(0, Utils.cardKeys.length / 2).filter(key => key in Utils.studentTranslations).sort(Utils.sortStudentStats).map((key, i) => {
                          return <ListGroupItem key={i} className="student-view-list-group-item">{`${Utils.forHumanAttr(key, student[key])}`}</ListGroupItem>
                        })
                      }
                    </ListGroup>
                  </Col>
                </Row>
              </Grid>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Button bsStyle="primary" ref="editButton" onClick={this.props.toggleEdit}>Edit Student</Button>
            </Col>
          </Row>
        </Grid>
    )
  }
}

export default StudentViewForm