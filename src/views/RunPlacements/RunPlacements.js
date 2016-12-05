import React, { PropTypes as T } from 'react'
import { render } from 'react-dom'
import { Grid, Row, Col, Breadcrumb } from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import GradePlacePanel from '../../components/Grade/GradePlacePanel'
import './RunPlacements.css'

export class RunPlacements extends React.Component {
  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  render() {
    return (
      <div className="root">
        <Breadcrumb>
          <Breadcrumb.Item href="#/landing">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Placement
          </Breadcrumb.Item>
        </Breadcrumb>
        <Grid>
          <Row>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map((grade, i) => {
                return (
                  <Col lg={2} xs={4} key={i}>
                    <GradePlacePanel grade={grade} />
                  </Col>)
              })
            }
          </Row>
        </Grid>
      </div>
    )
  }
}

export default RunPlacements