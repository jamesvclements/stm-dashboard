import React from 'react'
import ReactDOM from 'react-dom'
import StudentStats from './StudentStats'

describe('<StudentStats />', () => {
  it('renders without crashing', () => {
    const student = {}
    const div = document.createElement('div')
    ReactDOM.render(<StudentStats student={student}/>, div)
  })
})