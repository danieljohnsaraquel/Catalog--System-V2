import React, {useState, useEffect} from 'react'
import webApi from '../api/web'
import { toast } from 'react-toastify';
import OrderRow from './OrderRow';

export default function MyOrders() {

	const [orders, setOrders] = useState([])


	useEffect(() => {
		webApi.getAllOrders()
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

  const onOrderStatusChanged = (index, value) => {
    webApi.updateStatus(orders[index].id, value)
    .then(response => {
      toast.success(response.message, {
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
      setOrders(prevValue => {
        let newValue = [...prevValue]
        newValue[index].status = value
        return newValue
      })
    })
    .catch(error => {
			toast.error(error.message, {
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
  }

  const onOrderETAChanged = (index, value) => {
    webApi.updateETA(orders[index].id, value)
    .then(response => {
      toast.success(response.message, {
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
      setOrders(prevValue => {
        let newValue = [...prevValue]
        newValue[index].eta = value
        return newValue
      })
    })
    .catch(error => {
			toast.error(error.message, {
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
    
  }
	

	const generateRow = (order, index) => {
		return (
			<OrderRow
			key={order.id}
			order={order}
      onOrderStatusChanged={value => {onOrderStatusChanged(index, value)}}
      onOrderETAChanged={date => {onOrderETAChanged(index, date)}}
			>
			</OrderRow>
		)
	}

	const generateRows = () => {
		return orders.map((order, index) => {
			return generateRow(order, index)
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
