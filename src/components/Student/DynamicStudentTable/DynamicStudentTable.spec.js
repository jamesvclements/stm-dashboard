import React from 'react'
import ReactDOM from 'react-dom'
import DynamicStudentTable from './DynamicStudentTable'

describe('<DynamicStudentTable />', () => {
  it('renders without crashing', () => {
    const students = []
    const div = document.createElement('div')
    ReactDOM.render(<DynamicStudentTable students={students}/>, div)
  })
})