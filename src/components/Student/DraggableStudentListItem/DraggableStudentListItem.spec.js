import React from 'react'
import ReactDOM from 'react-dom'
import DraggableStudentListItem from './DraggableStudentListItem'

describe('<DraggableStudentListemItem />', () => {
  it('renders without crashing', () => {
    const student = {}
    const div = document.createElement('div')
    ReactDOM.render(<DraggableStudentListItem student={student}/>, div)
  })
})