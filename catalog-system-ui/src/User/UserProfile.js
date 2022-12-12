import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useUser } from '../UserContext';
import webApi from '../api/web'
import { toast } from 'react-toastify';

export default function UserProfile() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [address, setAddress] = useState('')

    const {
        userObject,
        setUserObject
    } = useUser()

    useEffect(() => {
        setFirstName(userObject.firstName)
        setLastName(userObject.lastName)
        setAddress(userObject.address)
    }, [])
    

    const onSubmit = (e) => {
        e.preventDefault();
        webApi.updateUserProfile(userObject.id, firstName, lastName, address)
        .then(response => {
			toast.success(response.message, { 
				toastId: 'updateSuccess',
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
			setUserObject(prevValue => {
                let newValue = {...prevValue}
                console.log(newValue)
                newValue.firstName = firstName
                newValue.lastName = lastName
                newValue.address = address
                return newValue
            })
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'updateFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
		
    }

    return (
        <div className="m-5">
            <div className="text-center text-primary" style={{width: '100%'}}>
                <h1>User Profile</h1>
                <hr />
            </div>

            <div>
                <Form onSubmit={onSubmit}>
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

                    <Button variant="primary" type="submit" disabled={!firstName || !lastName}>
                        Update
                    </Button>
                </Form>
            </div>
        </div>
    )
}
