import React, {useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import webApi from '../api/web'
import { useUser } from '../UserContext';


export default function Shop() {

	const [products, setProducts] = useState([])

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'AED',
	})

	const {
        userObject,
		setUserObject
    } = useUser()

	useEffect(() => {
		webApi.getAllItems()
		.then(response => {
			setProducts(response.data.map(product => {
				return {...product, quantityToBuy: 1}
			}))
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'queryFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
	}, [])

	const onQuantityChange = (index, amount) => {
		setProducts(prevValue => {
			let newValue = [...prevValue]
			newValue[index].quantityToBuy = amount 
			if (newValue[index].quantityToBuy > newValue[index].quantity) newValue[index].quantityToBuy = newValue[index].quantity
			newValue[index].quantityToBuy = parseInt(newValue[index].quantityToBuy)
			return newValue
		})
	}

	const onAddtoCart = (product) => {
		let cart = userObject.cart ? userObject.cart.split(', ').filter(element => element !== '') : []
		cart.push(product.id)
		cart.push(product.quantityToBuy)
		webApi.updateCartData(userObject.id, cart.join(', '))
		.then(response => {
			toast.success(response.message, {
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
			setUserObject(prevValue => {
				let newValue = {...prevValue}
				newValue.cart = cart.join(', ')
				return newValue
			})
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'addToCartFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
	}

	const generateCardItems = () => {
		return products.map((product, index) => {
			return (
				<Card style={{ width: '18rem' }} className='m-3' key={product.id}>
					<Card.Img variant="top" src={product.image} width={100} />
					<Card.Body>
						<Card.Title>{product.name}</Card.Title>
						<Card.Subtitle className="mb-2 text-muted">{product.brand}</Card.Subtitle>
						<Card.Subtitle className="mb-2 text-muted">Category: {product.type}</Card.Subtitle>
						<br />
						<Card.Subtitle className="mb-2 text-muted text-right">{formatter.format(product.price)}</Card.Subtitle>
						<Card.Subtitle className={`mb-2 text-${product.quantity > 0 ? 'success' : 'danger'} text-right`}>{product.quantity > 0 ? `stock: ${product.quantity}` : 'Out of Stock'}</Card.Subtitle>
						
					</Card.Body>
					<Card.Footer>
						<InputGroup>
							<Form.Control type="number" placeholder="Set Amount" min={0} max={product.quantity} value={product.quantityToBuy} onChange={e => {onQuantityChange(index, e.target.value)}} disabled={product.quantity === 0}/>
							<Button variant="primary" disabled={product.quantity === 0 || product.quantityToBuy === 0} onClick={() => {onAddtoCart(product)}}>Add to Cart</Button>
						</InputGroup>
					</Card.Footer>
				</Card>
			)
		})
	}
	
	return (
		<div className='m-5'>
			<div className="text-center text-primary" style={{width: '100%'}}>
				<h1>Shop</h1>
				<hr />
			</div>

			<div className='d-flex'>
					{generateCardItems()}
			</div>
		</div>
	)
}
