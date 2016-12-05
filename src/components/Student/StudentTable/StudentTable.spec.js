import React from 'react'
import ReactDOM from 'react-dom'
import StudentTable from './StudentTable'

describe('<StudentTable />', () => {
  it('renders without crashing', () => {
    const students = []
    const div = document.createElement('div')
    ReactDOM.render(<StudentTable students={students}/>, div)
  })
})