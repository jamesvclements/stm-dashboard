import React, { PropTypes as T } from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import NotificationSystem from 'react-notification-system'
import logo from '../images/stm-logo.png'
import './Container.css'

export class Container extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static childContextTypes = {
    addNotification: T.func
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      profile: props.route.auth.getProfile(),
      user: {}
    }

    props.route.auth.on('authenticated', () => {
     /* this.sleep(00).then(()=>{
        this.forceUpdate()
        location.reload()        
      })*/

    })

    props.route.auth.on('profile_updated', profile => {
      this.setState({ profile: profile })
    })

    props.route.auth.getUser()
      .then(user => {
        this.setState({
          user: user
        })
      })
  }

  sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


  getChildContext() {
    return {
      addNotification: this.addNotification.bind(this)
    }
  }

  addNotification(notification) {
    notification.position = 'br'
    this.notifications.addNotification(notification)
  }

  loggedIn() {
    return this.props.route.auth.loggedIn()
  }

  login() {
    this.props.route.auth.login()
  }

  logout() {
    this.props.route.auth.logout()
    this.context.router.push('/login')
  }

  land() {
    this.context.router.push('/landing')
  }

  render() {
    let children = null
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth,
        profile: this.state.profile,
        user: this.state.user
      })
    }

    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <img src={logo} alt="" className="logo" onClick={this.land.bind(this)}></img>
            </Navbar.Brand>
            <Navbar.Text>
              <span className="title" onClick={this.land.bind(this)}>St. Thomas More Student Management</span>
            </Navbar.Text>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {
                this.loggedIn() ?
                  <NavItem onClick={this.logout.bind(this)}>Logout</NavItem>
                  :
                  <NavItem onClick={this.login.bind(this)}>Login</NavItem>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <NotificationSystem ref={notifications => this.notifications = notifications} />
        {children}
      </div>
    )
  }
}

export default Container