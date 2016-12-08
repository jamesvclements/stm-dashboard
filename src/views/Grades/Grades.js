import React, { PropTypes as T } from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { Panel } from 'react-bootstrap'
import './Grades.css'

export class Grades extends React.Component {
  static contextTypes = {
    router: T.object
  }
  
  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  render() {
    return (
    <div className="root">
      <Grid>
        <Row>
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 'All'].map((grade, i) => {
              return (
                <Col md={2} xs={4} key={i}>
                  <Panel
                    onClick={() => {
                      this.context.router.push(`/grades/${grade}`)
                    }}
                    className="grades-panel">
                    <h2>{(grade === 0) ? 'K' : grade}</h2>
                  </Panel>
                </Col>)
            })
          }
        </Row>
      </Grid>
    </div>
    )
  }
}

export default Grades