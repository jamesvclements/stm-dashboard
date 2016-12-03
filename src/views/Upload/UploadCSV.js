import React, { PropTypes as T } from 'react'
import {Grid, Row, Col, Panel} from 'react-bootstrap'
import AuthService from '../../utils/AuthService'
import './UploadCSV.css'

export class UploadCSV extends React.Component {
  static contextTypes = {
    router: T.object
  }
  
  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  render() {
    return (
    <div className="root">
      
    </div>
    )
  }
}

export default UploadCSV