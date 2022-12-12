import React, {useEffect} from 'react'
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Login from './Login';
import Register from './Register';
import './login.css'
import webApi from '../api/web'
import { useUser } from '../UserContext';
import { useNavigate } from "react-router-dom";

export default function Main() {

	const {
		setUserObject,
		userObject
    } = useUser()

	const navigate = useNavigate()

	useEffect(() => {
		if (!userObject.type) {

		}
		else if (userObject.type === 'user') {
			navigate('/user')
		}
		else {
			navigate('/admin')
		}
	}, [userObject.type])

	useEffect(() => {
		let email = localStorage.getItem('email');
		let password = localStorage.getItem('password');

		if (email && password) {
			webApi.loginUser(email, password)
			.then(response => {
				setUserObject(response)
			})
			.catch(error => {
				console.log(error)
			})
		}
	}, [])
	
  	return (
		<Container className="text-primary">
			<div id="main-section" className="mx-auto">
				<h1 className='text-center'>Catalog System</h1>
				<div id="login-panel" className='mt-5'>
				<Tabs
				defaultActiveKey="login"
				id="main-tabs"
				className="mb-3"
      			fill
				>
					<Tab eventKey="login" title="Login">
						<Login />
					</Tab>
					<Tab eventKey="register" title="Register">
						<Register />
					</Tab>
				</Tabs>
				</div>
			</div>

		</Container>
	)
}
