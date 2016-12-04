import React, { PropTypes as T } from 'react'
import AuthService from '../../utils/AuthService'
import './NotFound.css'

export class NotFound extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    auth: T.instanceOf(AuthService),
    profile: T.object
  }

  render() {
    return (
      <div className="root">
        Oops! Looks like you've reached a page that doesn't exist 😥
      </div>
    )
  }
}

export default NotFound