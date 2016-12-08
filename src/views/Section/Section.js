import React, { PropTypes as T } from 'react'
import { PageHeader, Grid, Row, Col, Breadcrumb } from 'react-bootstrap'
import { StudentTable } from '../../components/Student/StudentTable/StudentTable'
import './Section.css'

export class Section extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  constructor(props) {
    super(props)

    this.state = {
      section: {
        teacher: {},
        students: []
      }
    }

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/sections/${this.props.params.sectionID}`, {
      method: 'GET'
    })
      .then(response => {
        if (response.ok) {
          response.json().then(section => {
            this.setState({
              section: section
            })
          })
        } else {
          this.context.addNotification({
            title: 'Error',
            message: `Failed to fetch section ${this.props.params.sectionID}`,
            level: 'error'
          })
        }
      }).catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: `Failed to fetch section ${this.props.params.sectionID}`,
          level: 'error'
        })
      })
  }

  render() {
    const { section } = this.state
    const { params } = this.props
    return (
      <div className="root">
        <Breadcrumb>
          <Breadcrumb.Item href="#/landing">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#/grades">
            Grades
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`#/grades/${params.grade}`}>
            Sections
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Section
          </Breadcrumb.Item>
        </Breadcrumb>
        <PageHeader>
          {`${section.teacher.firstName} ${section.teacher.lastName}`}
          <small>{` ${params.grade === '0' ? 'Kindergarten' : `Grade ${params.grade}`} Section ${params.sectionID}`}</small>
        </PageHeader>
        <Grid>
          <Row>
            <Col xs={12}>
              <StudentTable students={section.students} />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Section