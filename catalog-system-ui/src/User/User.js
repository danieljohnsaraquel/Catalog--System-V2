import React, {useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { useUser } from '../UserContext';
import ListGroup from 'react-bootstrap/ListGroup';
import { Outlet } from "react-router-dom";

import './user.css'

export default function User() {
    const navigate = useNavigate()
    const {
        userObject,
        setUserObject
    } = useUser()

    useEffect(() => {
        if (!userObject.type) {
            navigate('/')
        }
        else if (userObject.type !== 'user') {
            navigate('/admin')
        }
        
    }, [])

    const onLogoutClick = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        setUserObject({})
        navigate('/')

    }

    return (
        <div id="user">
            <nav id="sidebar" className="py-4 px-2">
                <h4 className=" text-center">{userObject.firstName} {userObject.lastName}</h4>
                <p className="text-secondary text-center"><small>{userObject.email}</small></p>
                <hr />
                    <ListGroup variant="flush" defaultActiveKey="#link1">
                        
                        <ListGroup.Item action onClick={() => {navigate('/user/')}} style={{cursor: 'pointer'}}>
                            Shop
                        </ListGroup.Item>

                        <ListGroup.Item action onClick={() => {navigate('/user/cart')}} style={{cursor: 'pointer'}}>
                            Cart
                        </ListGroup.Item>

                        <ListGroup.Item action onClick={() => {navigate('/user/my-orders')}} style={{cursor: 'pointer'}}>
                            My Orders
                        </ListGroup.Item>

                        <ListGroup.Item action onClick={() => {navigate('/user/profile')}} style={{cursor: 'pointer'}}>
                            Update Profile
                        </ListGroup.Item>

                        <ListGroup.Item action onClick={() => {onLogoutClick()}} style={{cursor: 'pointer'}}>
                            Logout
                        </ListGroup.Item>
                    </ListGroup>
            </nav>
            <div style={{width: '100%'}}>
                <Outlet />
            </div>
        </div>
    )
}
