import React, {useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { useUser } from '../UserContext';
import ListGroup from 'react-bootstrap/ListGroup';
import { Outlet } from "react-router-dom";

import './admin.css'

export default function Admin() {
    const navigate = useNavigate()

    const {
		setUserObject,
		userObject
    } = useUser()


    useEffect(() => {
        if (!userObject.type) {
            navigate('/')
        }
        else if (userObject.type === 'user') {
            navigate('/user')
        }
        
    }, [])

    const onLogoutClick = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        setUserObject({})
        navigate('/')

    }

    const generateEmployeesSelection = () =>{
        if (userObject.type === 'admin') {
            return (
                <ListGroup.Item action onClick={() => {navigate('/admin/employees')}} style={{cursor: 'pointer'}}>
                    Employees
                </ListGroup.Item>
            )
        }
        return <></>
    }
    

    return (
        <div id="admin">
            <nav id="sidebar" className="py-4 px-2">
                <h3 className="text-center">Admin Page</h3>
                <hr />
                    <ListGroup variant="flush" defaultActiveKey="#link1">
                        
                        <ListGroup.Item action onClick={() => {navigate('/admin/')}} style={{cursor: 'pointer'}}>
                            Products
                        </ListGroup.Item>

                        <ListGroup.Item action onClick={() => {navigate('/admin/orders')}} style={{cursor: 'pointer'}}>
                            Orders
                        </ListGroup.Item>

                        {generateEmployeesSelection()}

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
