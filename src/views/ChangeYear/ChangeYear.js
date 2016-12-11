import React, { PropTypes as T } from 'react'
import { Grid, Row, Col, Breadcrumb, Panel, PageHeader, Modal, Button } from 'react-bootstrap'
import './ChangeYear.css'

export class ChangeYear extends React.Component {

	static contextTypes = {
		router: T.object,
		addNotification: T.func
	}

	constructor(props) {
		super(props)

		this.state = {
			year: 0,
			showWarningModal: false
		}

		fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/change-year`,
			{
				method: 'GET',
			})
			.then(response => {
				response.json().then(year => {
					if (response.ok) {
						this.setState({
							year: year
						})
					} else {
						this.context.addNotification({
							title: 'Error',
							message: 'Failed to get year',
							level: 'error'
						})
					}
				})

			})
			.catch(err => {
				console.error(err)
				this.context.addNotification({
					title: 'Error',
					message: 'Failed to get year',
					level: 'error'
				})
			})
	}

	incrementYear() {
		fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/change-year`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					increment: 'Y'
				})
			})
			.then(response => {
				if (response.ok) {
					this.context.addNotification({
						title: 'Success',
						message: `Successfully advanced to the next year`,
						level: 'success'
					})
					this.setState({
						year: this.state.year + 1
					})
					this.hideWarning()
				} else {
					this.context.addNotification({
						title: 'Error',
						message: 'Failed to advance year',
						level: 'error'
					})
				}
			})
			.catch(err => {
				console.error(err)
				this.context.addNotification({
					title: 'Error',
					message: 'Failed to advance year',
					level: 'error'
				})
			})
	}

	showWarning() {
		this.setState({
			showWarningModal: true
		})
	}

	hideWarning() {
		this.setState({
			showWarningModal: false
		})
	}

	render() {
		return (
			<div className="root">
				<Breadcrumb>
					<Breadcrumb.Item href="#/landing">
						Home
			</Breadcrumb.Item>
					<Breadcrumb.Item href="#/admin">
						Admin
			</Breadcrumb.Item>
					<Breadcrumb.Item active>
						Change Year
			</Breadcrumb.Item>
				</Breadcrumb>
				<PageHeader>{`Current Academic Year: ${this.state.year} - ${this.state.year + 1}`}</PageHeader>
				<Grid>
					<Row>
						<Col xs={12}>
							<Panel
								onClick={this.showWarning.bind(this)}
								className="clickable-panel">
								<h3>Advance Year</h3>
							</Panel>
						</Col>
					</Row>
				</Grid>
				<Modal show={this.state.showWarningModal} onHide={this.hideWarning.bind(this)}>
					<Modal.Body>
						<h4>WARNING</h4>
						<p>This is an irreversible action.</p>
						<p>Upon advancing the year, the student data will be altered to the new year.</p>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="danger" onClick={this.incrementYear.bind(this)}>ADVANCE YEAR</Button>
						<Button onClick={this.hideWarning.bind(this)}>CLOSE</Button>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
}

export default ChangeYear