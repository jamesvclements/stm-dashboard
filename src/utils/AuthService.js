import Auth0Lock from 'auth0-lock'
import { EventEmitter } from 'events'
import logo from '../images/stm-logo.png'

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super()
    const options = {
      allowedConnections: ['google-oauth2'],
      theme: {
        logo: logo,
        primaryColor: 'red'
      },
      languageDictionary: {
        title: 'Student Management Login'
      }
    }
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, options)
    // Add callback for lock 'authenticated' event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // Add callback for 'setProfile' event
    this.on('profile_updated', profile => {
      this.setProfile(profile)
    })
    // Bind login functions to keep this context
    this.login = this.login.bind(this)
  }

  _doAuthentication(authResult) {
    // Save user token
    this.setToken(authResult.idToken)

    // Async load the user profile data
    fetch(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/tokeninfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: authResult.idToken
      })
    })
      .then(response => {
        if (response.ok) {
          response.json()
            .then(profile => {
              console.log('this profile')
              console.log(profile)
              this.setProfile(profile)
            })
        } else {
          console.error('Error loading the Profile')
        }
      })
      .catch(err => {
        console.error('Error loading the Profile', err)
      })

    // Trigger authenticated event
    this.emit('fuckjames')
    this.emit('authenticated')
  }

  login() {
    // Call the show method to display the widget
    this.lock.show()
  }

  loggedIn() {
    // Check if there is a saved valid token
    return !!this.getToken()
  }

  setToken(idToken) {
    // Save user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken() {
    // Retrieve user token from localStorage
    return localStorage.getItem('id_token')
  }

  setProfile(profile) {
    localStorage.setItem('profile', JSON.stringify(profile))
    this.setUser(profile.email)
  }

  getProfile() {
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(profile) : {}
  }

  updateProfile(userId, data) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken() //setting authorization header
    }

    // make PATCH http request to auth0 api
    return fetch(`https://${this.domain}/api/v2/users/${userId}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(newProfile => this.setProfile(newProfile))
  }

  setUser(emailID) {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/staff/${emailID}`, {
        method: 'GET'
      })
        .then(response => {
          if (response.ok) {
            response.json().then(user => {
              localStorage.setItem('user', JSON.stringify(user))
              resolve()
            })
          } else {
            console.error('Error fetching the user')
            reject(new Error(`Error fetching the user: ${emailID}`))
          }
        })
        .catch(err => {
          console.error('Error fetching the user')
          reject(new Error(`Error fetching the user: ${emailID}`))
        })
    })
  }

  getUser() {
    return new Promise((resolve, reject) => {
      const user = localStorage.getItem('user')
      if (user) {
        resolve(JSON.parse(user))
      } else {
        this.setUser(this.getProfile().email)
          .then(() => {
            resolve(JSON.parse(localStorage.getItem('user')))
          })
          .catch(() => {
            resolve(this.getUser())
          })
      }
    })
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token')
    localStorage.removeItem('profile')
    localStorage.removeItem('user')
  }
}