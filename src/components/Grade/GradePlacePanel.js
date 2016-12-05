import React, { PropTypes as T } from 'react'
import { Panel, Button } from 'react-bootstrap'

export class GradePlacePanel extends React.Component {
  static contextTypes = {
    router: T.object,
    addNotification: T.func
  }

  static propTypes = {
    grade: T.number
  }

  run() {
    const { grade } = this.props
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/placements/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade: grade
        })
      })
      .then(() => {
        this.context.router.push(`/placement/${grade}`)
      })
      .catch(err => {
        console.error(err)
        this.context.addNotification({
          title: 'Error',
          message: `Failed to run placement for grade ${grade}`,
          level: 'error'
        })
      })
  }

  view() {
    this.context.router.push(`/placement/${this.props.grade}`)
  }

  render() {
    const { grade } = this.props
    return (
      <div>
        <Panel>
          <h2>{(grade === 0) ? 'K' : grade}</h2>
          <Button
            block
            bsStyle="primary"
            onClick={this.run.bind(this)}>Run</Button>
          <Button
            block
            bsStyle="info"
            onClick={this.view.bind(this)}>View</Button>
        </Panel>
      </div>
    )
  }
}

export default GradePlacePanel