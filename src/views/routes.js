import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import AuthService from '../utils/AuthService'
import Container from './Container'
import Landing from './Landing/Landing'
import Placement from './Placement/Placement'
import Login from './Login/Login'
import RunPlacements from './RunPlacements/RunPlacements'
import NotFound from './NotFound/NotFound'
import Students from './Students/Students'
import Admin from './Admin/Admin'
import ManageUsers from './ManageUsers/ManageUsers'
import Upload from './Upload/Upload'
import Grades from './Grades/Grades'
import Section from './Section/Section'
import GradeSections from './GradeSections/GradeSections'
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
  	  <Route path="admin" component={Admin}  />
  	  <Route path="admin/manage-users" component={ManageUsers} />
  	  <Route path="admin/upload" component={Upload} />
      <Route path="students" component={Students} onEnter={requireAuth} />
      <Route path="grades" component={Grades} onEnter={requireAuth} />
      <Route path="sections/:grade" component={GradeSections} onEnter={requireAuth} />
      <Route path="sections/:grade/:sectionID" component={Section} onEnter={requireAuth} />
      <Route path="run-placements" component={RunPlacements} onEnter={requireAuth} />
      <Route path="placement/:grade" component={Placement} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="students/:studentID" component={Student} onEnter={requireAuth} />
      <Route path="access_token=:token" component={Login} />
      <Route path="*" component={NotFound} />
    </Route>
  )
}

export default makeRoutes