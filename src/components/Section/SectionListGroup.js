import React, { PropTypes as T } from 'react'
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap'
import DraggableStudentListItem from '../Student/DraggableStudentListItem/DraggableStudentListItem'
import * as Utils from '../../utils/Utils'
import './SectionListGroup.css'

export class SectionListGroup extends React.Component {
  static propTypes = {
    section: T.object,
    sectionIndex: T.number
  }

  render() {
    const { section } = this.props
    const { sectionIndex } = this.props
    const { stats } = section
    return (
      <div>
        <h5>Teacher: {section.teacher.name}</h5>
        <Panel header="Statistics">
          <ListGroup fill className="section-stats">
            <ListGroupItem>
              <span>Size:</span>
              <span> {section.students.length}</span>
            </ListGroupItem>
            {
              // only stats in the translations object are displayed
              Object.keys(stats).filter(key => key in Utils.sectionTranslations).sort(Utils.sortSectionStats).map((key, i) => {
                // round numbers to 2 decimals
                let val = (isNaN(stats[key])) ? stats[key] : Utils.round(stats[key], 2)
                // convert age in months to X yr. Y mo.
                val = (key === 'avgAge') ? `${Utils.round(val / 12, 0)} y. ${Utils.round(val % 12, 0)} mo.` : val
                return <ListGroupItem key={i}>
                  <span>{`${Utils.sectionTranslations[key]}:`}</span>
                  <span> {val}</span>
                </ListGroupItem>
              })
            }
          </ListGroup>
        </Panel>
        <Panel header="Students">
          {
            section.students.map((student, i) => {
              return <DraggableStudentListItem key={i} student={student} sectionIndex={sectionIndex} studentIndex={i} />
            })
          }
        </Panel>
      </div>
    )
  }
}

export default SectionListGroup
