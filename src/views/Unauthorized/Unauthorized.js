import React from 'react'
import './Unauthorized.css'

export class Unauthorized extends React.Component {
  render() {
    return (
      <div className="root">
        Oops! Looks like you don't have the required access level for this page 😥
      </div>
    )
  }
}

export default Unauthorized