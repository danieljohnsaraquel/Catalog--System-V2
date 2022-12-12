import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useUser } from '../UserContext';
import webApi from '../api/web'
import { toast } from 'react-toastify';

export default function Login() {

	const {
		setUserObject,
    } = useUser()

	const onSubmit = e => {
        e.preventDefault();
		onLogin()

    };

	const onLogin = () => {
		webApi.loginUser(email, password)
		.then(response => {
			toast.success(response.message, { 
				toastId: 'loginSuccess',
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
			setUserObject(response)
			localStorage.setItem('password', password);
			localStorage.setItem('email', email);
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'loginFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
	}

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

    return (
		<Form onSubmit={onSubmit}>
			<Form.Group className="mb-3" controlId="formBasicLoginEmail">
				<Form.Label>Email address</Form.Label>
				<Form.Control type="email" placeholder="Enter email" value={email} onChange={e => {setEmail(e.target.value)}} />
				<Form.Text className="text-muted">
					We'll never share your email with anyone else.
				</Form.Text>
			</Form.Group>
	
			<Form.Group className="mb-3" controlId="formBasicLoginPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password" value={password} onChange={e => {setPassword(e.target.value)}}/>
			</Form.Group>
			
			<Button variant="primary" type="submit">
			Login
			</Button>
	  	</Form>
    )
}
