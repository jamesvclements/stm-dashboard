import React, { PropTypes as T } from 'react'
import AuthService from '../../utils/AuthService'
import { Grid, Row, Col, Panel } from 'react-bootstrap'
import { ACCESS } from '../../constants/Constants'
import './Landing.css'

export class Landing extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    auth: T.instanceOf(AuthService),
    profile: T.object,
    user: T.object
  }

  render() {
    const { user } = this.props
    const accessLevel = parseInt(user.accessLevel, 10)

    return (
      <div className="root">
        <Grid>
          <Row>
            {
              (accessLevel <= ACCESS.COUNSELOR) ?
                <Col md={6} xs={12}>
                  <Panel
                    onClick={() => { this.context.router.push('/students') } }
                    className="clickable-panel">
                    <h3>Students</h3>
                  </Panel>
                </Col>
                : null
            }
            {
              (accessLevel <= ACCESS.COUNSELOR) ?
                <Col md={6} xs={12}>
                  <Panel
                    onClick={() => { this.context.router.push('/grades') } }
                    className="clickable-panel">
                    <h3>Grades</h3>
                  </Panel>
                </Col>
                : null
            }
            {
              (accessLevel <= ACCESS.COUNSELOR) ?
                <Col md={6} xs={12}>
                  <Panel
                    onClick={() => { this.context.router.push('/run-placements') } }
                    className="clickable-panel">
                    <h3>Placement</h3>
                  </Panel>
                </Col>
                : null
            }
            {
              (accessLevel === ACCESS.ADMIN) ? 
              <Col md={6} xs={12}>
                <Panel
                  onClick={() => { this.context.router.push('/admin') } }
                  className="clickable-panel">
                  <h3>Admin</h3>
                </Panel>
              </Col>
              : null
            }
          </Row>
        </Grid>
        <h5>This system contains confidential student information and should not be left unattended.</h5>
      </div>
    )
  }
}
export default Landing