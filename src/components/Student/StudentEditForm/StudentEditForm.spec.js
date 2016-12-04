import React from 'react'
import ReactDOM from 'react-dom'
import StudentEditForm from './StudentEditForm'

describe('<StudentEditForm />', () => {
  it('renders without crashing', () => {
    const student = {}
    const div = document.createElement('div')
    ReactDOM.render(<StudentEditForm student={student}/>, div)
  })
})