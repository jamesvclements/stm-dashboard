import React, { PropTypes as T } from 'react'
import { Grid, Row, Col, Panel, Breadcrumb } from 'react-bootstrap'
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
            if (grade.sections.length === 0) {
              this.context.addNotification({
                title: 'Error',
                message: `No sections exist for grade ${this.props.params.grade}`,
                level: 'error'
              })
            }
            this.setState({
              grade: grade
            })
          })
        } else {
          this.failToFetchSections()
        }
      }).catch(err => {
        console.error(err)
        this.failToFetchSections()
      })
  }

  failToFetchSections() {
    this.context.addNotification({
      title: 'Error',
      message: `Failed to fetch sections for grade ${this.props.params.grade}`,
      level: 'error'
    })
  }

  render() {
    const { sections } = this.state.grade
    return (
      <div className="root">
        <Breadcrumb>
          <Breadcrumb.Item href="#/landing">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#/grades">
            Grades
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Sections
          </Breadcrumb.Item>
        </Breadcrumb>
        <Grid>
          <Row>
            {
              sections.map((section, i) => {
                return (
                  <Col md={sections.length === 4 ? 3 : 4} xs={6} key={i}>
                    <Panel
                      onClick={() => { this.context.router.push(`/sections/${this.props.params.grade}/${section.sectionID}`) } }
                      className="clickable-panel">
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