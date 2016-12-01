import React from 'react'
import ReactDOM from 'react-dom'
import SimStudentItem from './SimStudentItem'

describe('<SimStudentItem />', () => {
  it('renders without crashing', () => {
    const student = {}
    const div = document.createElement('div')
    ReactDOM.render(<StudentListItem student={student}/>, div)
  })
})