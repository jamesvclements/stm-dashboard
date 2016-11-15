import React, { PropTypes } from 'react'
import { Router } from 'react-router'

class App extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.element.isRequired
  }

  render() {
     return (
       <div style={{ height: '100%' }}>
         <Router routes={this.props.routes} history={this.props.history} />
       </div>
     )
   }
}

export default App