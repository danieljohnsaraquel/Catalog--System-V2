import React, {useEffect, useState} from 'react'
import { useUser } from '../UserContext'
import webApi from '../api/web'
import CartRow from './CartRow'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Cart() {

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'AED',
	})

	const navigate = useNavigate()
	const [reloader, setReloader] = useState(0)
	const [totalPrice, setTotalPrice] = useState(0)

	const {
        userObject,
		setUserObject
    } = useUser()

	useEffect(() => {
		setTotalPrice(0)
		let cartArray = userObject.cart?.split(', ').filter(element => element !== '') || []
		if (cartArray.length) {
			let promises = []
			cartArray.forEach((element, index) => {
				if (index % 2 === 0) {
					promises.push(
						webApi.getItemById(element)
					.then(response => {
						if (response.data) {
							let sumPrice = parseInt(response.data.price) * parseInt(cartArray[index + 1])
							return sumPrice
						}
						else {
							return 0
						}
					})
					)
				}
				else {
					return null;
				}
			});

			Promise.all(promises)
			.then(response => {
				console.log(response)
				let total = 0
				response.forEach(price => {
					total += price
				})
				setTotalPrice(total)
			})
		}
	}, [userObject.cart])
	

	const editCartQuantity = (index, operation) => {
		let cart = userObject.cart?.split(', ').filter(element => element !== '') || []
		if (operation === '+') cart[index + 1] ++
		else cart[index + 1] -= 1
		webApi.updateCartData(userObject.id, cart.join(', '))
		.then(() => {
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

	const removeProductFromCart = (index) => {
		let cart = userObject.cart?.split(', ').filter(element => element !== '') || []
  		cart.splice(index, 2); // 2nd parameter means remove one item only
		  webApi.updateCartData(userObject.id, cart.join(', '))
		  .then(() => {
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

	const onCheckoutClick = () => {
		let isAllGood = true
		let cartArray = userObject.cart?.split(', ').filter(element => element !== '') || []

		if (cartArray.length) {
			let cartPromises = []
			cartArray.forEach((element, index) => {
				if (index % 2 === 0) {
					cartPromises.push(
						webApi.getItemById(element)
						.then(response => {
							if (!response.data || response.data.quantity < parseInt(cartArray[index + 1])) {
								isAllGood = false
							}
							else {
								return {...response, quantityToBuy: cartArray[index + 1]}
							}
						})
					)
				}
			});

			Promise.all(cartPromises)
			.then(response => {
				console.log(isAllGood)
				if (isAllGood) {
					let editPromises = response.map(({data, quantityToBuy}) => {
						return webApi.editItem(data.id, data.name, data.brand, data.type, parseInt(data.quantity) - parseInt(quantityToBuy), data.price, data.image)
					})

					Promise.all(editPromises)
					.then(response => {
						webApi.addOrder(userObject.id, 'preparing', userObject.cart, null)
						.then(response => {
							toast.success(response.message + 'Will redirect a few moment', {
								toastId: 'checkoutSuccess', 
								autoClose: 3000,
								position: toast.POSITION.TOP_RIGHT
							})

							return webApi.updateCartData(userObject.id, '')

							
						})
						.then(response => {
							setUserObject(prevValue => {
								let newValue = {...prevValue}
								newValue.cart = ''
								return newValue
							})
	
							setTimeout(() => {
								navigate('/user/my-orders')

							}, 3000)
						})
						.catch(error => {
							toast.error(error.message, {
								toastId: 'checkoutFail', 
								autoClose: 3000,
								position: toast.POSITION.TOP_RIGHT
							})
						})
					})
					.catch(error => {
						toast.error(error.message, {
							toastId: 'editError', 
							autoClose: 3000,
							position: toast.POSITION.TOP_RIGHT
						})
					})

				}
				else {
					toast.error('One or more items have stock quantity less than what you input', {
						toastId: 'addToCartWrong', 
						autoClose: 3000,
						position: toast.POSITION.TOP_RIGHT
					})
					setReloader(reloader + 1)
				}
			})
			.catch(error => {
				console.log(error)
			})
		}
	}

	const generateRow = (productId, index, quantityInCart) => {
		return (
			<CartRow key ={`${productId}${index}`}
			onAddClick={() => {editCartQuantity(index, '+')}}
			onSubtractClick={() => {editCartQuantity(index, '-')}}
			onRemoveClick={() => {removeProductFromCart(index)}}
			productId={productId} index={index} quantityInCart={quantityInCart}
			reloader={reloader}
			>
			</CartRow>
		)
	}

	const generateRows = () => {
		let cartArray = userObject.cart?.split(', ').filter(element => element !== '') || []
		if (cartArray.length) {
			return cartArray.map((element, index) => {
				if (index % 2 === 0) {
					return generateRow(element, index, cartArray[index + 1])
				}
				else {
					return null;
				}
			});
		}
		else {
			return <></>
		}
		
	}

	return (
		<div className='m-5'>
			<div className="text-center text-primary" style={{width: '100%'}}>
				<h1>My Cart</h1>
				<hr />
			</div>

			<div>
				{generateRows()}
			</div>

			<hr />

			<div className='mt-2'>
				<h4 className="text-primary">
					Total Price: <b>{formatter.format(totalPrice)}</b>
				</h4>
				<h4 className="text-secondary">
					Your Address: <b>{userObject.address}</b>
				</h4>
				<p>Payment Method: Cash on Delivery</p>
			</div>

			<div className='mt-2'>
				<button className="btn btn-success btn-lg btn-block" onClick={() => onCheckoutClick()} disabled={userObject.cart?.split(', ').filter(element => element !== '').length === 0}>Checkout</button>
			</div>
		</div>
	)
}
