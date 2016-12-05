import React, { PropTypes as T } from 'react'
import { Grid, Row, Col, Panel } from 'react-bootstrap'
import './GradeSections.css'

export class GradeSections extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  constructor(props) {
    super(props)

    this.state = {
      grade: {
        sections: []
      }
    }

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/grades/${this.props.params.grade}`, {
      method: 'GET'
    })
      .then(response => {
        if (response.ok) {
          response.json().then(grade => {
            this.setState({
              grade: grade
            })
          })
        } else {
          this.context.addNotification({
            title: 'Error',
            message: `Failed to fetch sections for grade ${this.props.params.grade}`,
            level: 'error'
          })
        }
      }).catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: `Failed to fetch sections for grade ${this.props.params.grade}`,
          level: 'error'
        })
      })
  }

  render() {
    const { sections } = this.state.grade
    return (
      <div className="root">
        <Grid>
          <Row>
            {
              sections.map((section, i) => {
                return (
                  <Col md={3} xs={6} key={i}>
                    <Panel
                      onClick={() => { this.context.router.push(`/sections/${this.props.params.grade}/${section.sectionID}`) } }
                      className="grade-sections-panel">
                      <h3>{`${section.teacher.firstName} ${section.teacher.lastName}`}</h3>
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

export default GradeSections