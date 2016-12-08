import React, { PropTypes as T} from 'react'
import { PageHeader, Panel, ListGroup, ListGroupItem, Grid, Row, Col, Button } from 'react-bootstrap'
import * as Utils from '../../../utils/Utils'
  
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
      <div className="root">
        <Grid>
          <Panel>
            <Row>
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
            </Row>
          </Panel>
        </Grid>
		<Button bsStyle="primary" ref="editButton" onClick={this.props.toggleEdit}>Edit Student</Button>
      </div>
    )
  }
}

export default StudentViewForm