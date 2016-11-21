import React, { PropTypes as T } from 'react'
import { PageHeader, Grid, Row, Col } from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import { ordinal } from '../../utils/Utils'
import SectionListGroup from '../../components/Section/SectionListGroup'
import './Placement.css'

export class Placement extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    auth: T.instanceOf(AuthService),
    profile: T.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      placement: {
        sections: []
      }
    }

    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/placements/${this.props.params.grade}`, {
      method: 'GET'
    })
      .then(response => {
        if (response.ok) {
          response.json().then(placement => {
            this.setState({
              placement: placement
            })
          })
        } else {
          this.context.addNotification({
            title: 'Error',
            message: `Failed to fetch placement for grade ${this.props.params.grade}`,
            level: 'error'
          })
        }
      }).catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: `Failed to fetch placement for grade ${this.props.params.grade}`,
          level: 'error'
        })
      }).catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: 'Failed to fetch placement',
          level: 'error'
      })
    })
  }

  render() {
    const { grade } = this.props.params
    const { placement } = this.state
    return (
      <div className="root">
        <PageHeader>{ordinal(grade)} Placement</PageHeader>
        <Grid>
          <Row>
            {
              placement.sections.map((section, i) => {
                return <Col key={i} md={(placement.sections.length === 4) ? 3 : 4} xs={12}><SectionListGroup section={section}></SectionListGroup></Col>
              })
            }
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Placement