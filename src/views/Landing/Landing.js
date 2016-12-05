import React, { PropTypes as T } from 'react'
import AuthService from '../../utils/AuthService'
import { Grid, Row, Col, Panel } from 'react-bootstrap'
import './Landing.css'

export class Landing extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    auth: T.instanceOf(AuthService),
    profile: T.object
  }

  render() {
    return (
      <div className="root">
        <Grid>
          <Row>
            <Col md={6} xs={12}>
              <Panel
                onClick={() => {this.context.router.push('/students')}}
                className="landing-panel">
                <h3>Students</h3>
              </Panel>
            </Col>
            <Col md={6} xs={12}>
              <Panel
                onClick={() => {this.context.router.push('/sections')}}
                className="landing-panel">
                <h3>Sections</h3>
              </Panel>
            </Col>
            <Col md={6} xs={12}>
              <Panel
                onClick={() => {this.context.router.push('/run-placements')}}
                className="landing-panel">
                <h3>Placement</h3>
              </Panel>
            </Col>
            <Col md={6} xs={12}>
              <Panel
                onClick={() => {this.context.router.push('/admin')}}
                className="landing-panel">
                <h3>Admin</h3>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
export default Landing