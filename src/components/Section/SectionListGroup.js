import React, { PropTypes } from 'react'
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap'
import StudentListItem from '../Student/StudentListItem/StudentListItem'
import * as Utils from '../../utils/Utils'
import './SectionListGroup.css'

export class Section extends React.Component {
  static propTypes = {
    section: PropTypes.object
  }

  render() {
    const section = this.props.section
    const { stats } = section
    return (
      <div>
        <h5>Teacher: {section.teacher.name}</h5>
        <Panel header="Statistics">
          <ListGroup fill className="section-stats">
            <ListGroupItem>
              <span className="stat-key">Size:</span>
              <span className="stat-val"> {section.students.length}</span>
            </ListGroupItem>
            {
              // only stats in the translations object are displayed
              Object.keys(stats).filter(key => key in Utils.sectionTranslations).sort(Utils.sortSectionStats).map((key, i) => {
                // round numbers to 2 decimals
                let val = (isNaN(stats[key])) ? stats[key] : Utils.round(stats[key], 2)
                // convert age in months to X yr. Y mo.
                val = (key === 'avgAge') ? `${Utils.round(val / 12, 0)} y. ${Utils.round(val % 12, 0)} mo.` : val
                return <ListGroupItem key={i}>
                  <span className="stat-key">{`${Utils.sectionTranslations[key]}:`}</span>
                  <span className="stat-val"> {val}</span>
                </ListGroupItem>
              })
            }
          </ListGroup>
        </Panel>
        <Panel header="Students">
          <ListGroup>
            {
              section.students.map((student, i) => {
                return <StudentListItem student={student} key={i} />
              })
            }
          </ListGroup>
        </Panel>
      </div>
    )
  }
}

export default Section