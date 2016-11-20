import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import AuthService from '../utils/AuthService'
import Container from './Container'
import Landing from './Landing/Landing'
import Placement from './Placement/Placement'
import Login from './Login/Login'
import RunPlacements from './RunPlacements/RunPlacements'
import NotFound from './NotFound/NotFound'
import Grades from './Grades/Grades'
import Grade from './Grade/Grade'
import Students from './Students/Students'

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
      <Route path="students" component={Students} />
      <Route path="students/:grade" component={Students} />
      <Route path="students/:grade/:sectionID" component={Students} />
      <Route path="grades" component={Grades} />
      <Route path="grades/:grade" component={Grade} />
      <Route path="run-placements" component={RunPlacements} />
      <Route path="placement/:grade" component={Placement} />
      <Route path="login" component={Login} />
      <Route path="access_token=:token" component={Login} />
      <Route path="*" component={NotFound} />
    </Route>
  )
}

export default makeRoutes