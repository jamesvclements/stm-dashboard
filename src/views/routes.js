import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import AuthService from '../utils/AuthService'
import Container from './Container'
import Landing from './Landing/Landing'
import Placement from './Placement/Placement'
import Login from './Login/Login'
import RunPlacements from './RunPlacements/RunPlacements'
import Student from './Student/Student'

const auth = new AuthService(
  process.env.REACT_APP_AUTH0_CLIENT_ID,
  process.env.REACT_APP_AUTH0_DOMAIN)

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

export const makeRoutes = () => {
  return (
    <Route path="/" component={Container} auth={auth}>
      <IndexRedirect to="/landing" />
      <Route path="landing" component={Landing} onEnter={requireAuth} />
      <Route path="run-placements" component={RunPlacements} />
      <Route path="placement/:grade" component={Placement} />
      <Route path="login" component={Login} />
      <Route path="students/:studentID" component={Student} />
      <Route path="access_token=:token" component={Login} />
    </Route>
  )
}

export default makeRoutes