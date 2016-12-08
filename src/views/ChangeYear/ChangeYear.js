import React, { PropTypes as T } from 'react'
import { Grid, Row, Col, Breadcrumb, Panel, PageHeader } from 'react-bootstrap'
import './ChangeYear.css'

export class ChangeYear extends React.Component {

	static contextTypes = {
		router: T.object,
		addNotification: T.func
	}

	constructor(props) {
		super(props)

		this.state = {
			year: 0
		}

		fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/change-year`,
		{
			method: 'GET',
		})
		.then(response => {
				response.json().then(year => {
					if(response.ok){
						console.log(year)
						this.setState({
							year: year
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

	incrementYear(){
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
		.then(() => {
			this.context.addNotification({
				title: 'Success',
				message: `Successfully advanced to the next year`,
				level: 'success'
			})
			this.setState({
				year: this.state.year+1
			})
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

	decrementYear(){
		fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/change-year`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				increment: 'N'
			})
		})
		.then(() => {
			this.context.addNotification({
				title: 'Success',
				message: `Successfully went back to the previous year`,
				level: 'success'
			})
			this.setState({
				year: this.state.year-1
			})
		})
		.catch(err => {
			console.error(err)
			this.context.addNotification({
				title: 'Error',
				message: 'Failed to go back year',
				level: 'error'
			})
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
			Change-Year
			</Breadcrumb.Item>
			</Breadcrumb>
			<PageHeader>{`Current Academic Year: ${this.state.year} - ${this.state.year + 1}`}</PageHeader>
			<Grid>
			<Row>
			<Col xs={12}>
			<Panel
			onClick={this.incrementYear.bind(this)}
			className="admin-panel">
			<h3>Go to Next Year</h3>
			</Panel>
			</Col>
			</Row>
			</Grid>
			</div>
			)
	}
}

export default ChangeYear