import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import web from '../api/web'
import { toast } from 'react-toastify';
import { useUser } from '../UserContext';

export default function Register() {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [address, setAddress] = useState('')

	const {
		setUserObject,
    } = useUser()

	const onSubmit = e => {
        e.preventDefault();
		onRegister()

    };

	const onRegister = () => {
		web.registerUser(email, password, firstName, lastName, 'user', address)
		.then(response => {
			toast.success(response.message, { 
				toastId: 'registerSuccess',
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
			return web.loginUser(email, password)
		})
		.then(response => {
			setUserObject(response)
			localStorage.setItem('password', password);
			localStorage.setItem('email', email);
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'registerFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
	}

	return (
		<Form onSubmit={onSubmit}>
			<Form.Group className="mb-3" controlId="formBasicEmail">
				<Form.Label>Email address</Form.Label>
				<Form.Control type="email" placeholder="Enter email" value={email} onChange={e => {setEmail(e.target.value)}} />
			</Form.Group>

			<Form.Group className="mb-3" controlId="formBasicPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password" value={password} onChange={e => {setPassword(e.target.value)}} />
			</Form.Group>

			<Form.Group className="mb-3" controlId="formBasicFirstName">
				<Form.Label>First name</Form.Label>
				<Form.Control type="text" placeholder="Enter First name" value={firstName} onChange={e => {setFirstName(e.target.value)}} />
			</Form.Group>

			<Form.Group className="mb-3" controlId="formBasicLastName">
				<Form.Label>Last name</Form.Label>
				<Form.Control type="text" placeholder="Enter Last name" value={lastName} onChange={e => {setLastName(e.target.value)}} />
			</Form.Group>

			<Form.Group className="mb-3" controlId="formBasicAddress">
				<Form.Label>Address</Form.Label>
				<Form.Control type="text" placeholder="Enter Address" value={address} onChange={e => {setAddress(e.target.value)}} />
			</Form.Group>

			<Button variant="primary" type="submit" disabled={!email || !password || !firstName || !lastName}>
				Register
			</Button>
		</Form>
	)
}
