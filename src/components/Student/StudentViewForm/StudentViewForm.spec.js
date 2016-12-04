import React from 'react'
import ReactDOM from 'react-dom'
import StudentViewForm from './StudentViewForm'

describe('<StudentViewForm />', () => {
  it('renders without crashing', () => {
    const student = {}
    const div = document.createElement('div')
    ReactDOM.render(<StudentViewForm student={student}/>, div)
  })
})