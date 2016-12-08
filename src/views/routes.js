import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import AuthService from '../utils/AuthService'
import { ACCESS } from '../constants/Constants'
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
import Unauthorized from './Unauthorized/Unauthorized'
import AccessPending from './AccessPending/AccessPending'

const auth = new AuthService(
  process.env.REACT_APP_AUTH0_CLIENT_ID,
  process.env.REACT_APP_AUTH0_DOMAIN)

const requireAuth = (nextState, replace, callback) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }

  auth.getUser()
    .then(user => {
      const accessLevel = parseInt(user.accessLevel, 10)

      if (accessLevel === ACCESS.PENDING) {
        replace({ pathname: '/access-pending' })
      }

      // assume lowest access
      let requiredAccessLevel = ACCESS.TEACHER
      const destination = nextState.location.pathname

      // general route protection
      if (destination.includes('admin')) {
        requiredAccessLevel = ACCESS.ADMIN
      } else if (destination.includes('placement')) {
        requiredAccessLevel = ACCESS.COUNSELOR
      } else if (destination === '/students' || destination.includes('grades')) {
        requiredAccessLevel = ACCESS.COUNSELOR
      } else if (destination.includes('sections') && accessLevel === ACCESS.TEACHER) {
        // teachers only have access to their section
        if (user.sectionID !== nextState.params.sectionID) {
          replace({ pathname: '/unauthorized' })
        }
      }

      if (destination === '/landing' && accessLevel === ACCESS.TEACHER) {
        replace({ pathname: `/sections/${user.gradeTeaching}/${user.sectionID}` })
      } else if (accessLevel > requiredAccessLevel) {
        replace({ pathname: '/unauthorized' })
      }
      callback()
    })
}

export const makeRoutes = () => {
  return (
    <Route path="/" component={Container} auth={auth}>
      <IndexRedirect to="/landing" />
      <Route path="landing" component={Landing} onEnter={requireAuth} />
      <Route path="run-placements" component={RunPlacements} />
      <Route path="placement/:grade" component={Placement} />
      <Route path="admin" component={Admin} onEnter={requireAuth} />
      <Route path="admin/manage-users" component={ManageUsers} />
      <Route path="admin/upload" component={Upload} />
      <Route path="students" component={Students} onEnter={requireAuth} />
      <Route path="grades" component={Grades} onEnter={requireAuth} />
      <Route path="grades/:grade" component={GradeSections} onEnter={requireAuth} />
      <Route path="sections/:grade/:sectionID" component={Section} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="students/:studentID" component={Student} onEnter={requireAuth} />
      <Route path="access_token=:token" component={Login} />
      <Route path="unauthorized" component={Unauthorized} />
      <Route path="access-pending" component={AccessPending} />
      <Route path="*" component={NotFound} />
    </Route>
  )
}

export default makeRoutes