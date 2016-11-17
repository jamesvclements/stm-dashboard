import React, { PropTypes as T } from 'react'
import AuthService from '../../utils/AuthService'
import { Link } from 'react-router'
import './Landing.css'

export class Landing extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    auth: T.instanceOf(AuthService),
    profile: T.object
  }

  render() {
    const { profile } = this.props
    return (
      <div className="root">
        Hi{profile.given_name ? ` ${profile.given_name}` : ''}, 
        welcome to the St. Thomas More Student Management System.
        <br/>
        Go to classroom <Link to="/run-placements">placement</Link>.
      </div>
    )
  }
}

export default Landing