import React, { PropTypes as T } from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { Link } from 'react-router'
import NotificationSystem from 'react-notification-system'

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
      profile: props.route.auth.getProfile()
    }

    props.route.auth.on('profile_updated', profile => {
      this.setState({ profile: profile })
    })
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
        profile: this.state.profile
      })
    }

    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/landing">St. Thomas More Student Management</Link>
            </Navbar.Brand>
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