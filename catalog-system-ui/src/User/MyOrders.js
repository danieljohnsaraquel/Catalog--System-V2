import React, {useState, useEffect} from 'react'
import webApi from '../api/web'
import { useUser } from '../UserContext'
import { toast } from 'react-toastify';
import OrderRow from './OrderRow';

export default function MyOrders() {

	const [orders, setOrders] = useState([])

	const {
        userObject,
    } = useUser()

	useEffect(() => {
		webApi.getAllOrdersOfRecipient(userObject.id)
		.then(response => {
			setOrders(response.data)
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'queryFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
	}, [])
	

	const generateRow = (order) => {
		return (
			<OrderRow
			key={order.id}
			order={order}
			>
			</OrderRow>
		)
	}

	const generateRows = () => {
		return orders.map(order => {
			return generateRow(order)
		})
	}
	return (
		<div className='m-5'>
			<div className="text-center text-primary" style={{width: '100%'}}>
				<h1>My Orders</h1>
				<hr />
			</div>

			<div>
				{generateRows()}
			</div>
		</div>
	)
}
