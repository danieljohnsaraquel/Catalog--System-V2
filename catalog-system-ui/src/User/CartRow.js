import React, {useState, useEffect} from 'react'
import webApi from '../api/web'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function CartRow({index, productId, quantityInCart, onAddClick, onSubtractClick, onRemoveClick, reloader}) {
    const [product, setProduct] = useState({})

    const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'AED',
	})

    useEffect(() => {
        webApi.getItemById(productId)
        .then(response => {
			setProduct(response.data || {})
		})
		.catch(error => {
			console.log(error)
		})
    }, [reloader])

    
    
    return (
        <div key={index} className="cart-row p-3 my-4">
            <div className='d-flex'>
                <img src={product.image} alt={product.name} height={100}/>
                <div className='ml-5 p-2' style={{width: '100%'}}>
                    <h5 className="text-primary">{product.name}</h5>
                    <p className="text-secondary">{product.brand}</p>
                    <p className="text-secondary text-right">stock: {product.quantity}</p>
                    <p className="text-secondary text-right">{formatter.format(product.price)}</p>
                </div>
            </div>
            <div className='d-flex mt-3 text-right'>
                <InputGroup className="mr-3">
                    <Button variant="outline-secondary" id="button-minus"
                        onClick={onSubtractClick}
                        disabled={parseInt(quantityInCart) === 1}
                    >
                        -
                        
                    </Button>
                    <Form.Control
                        className={'row-quantity'}
                        htmlSize={5}
                        readOnly
                        value={quantityInCart}
                    />
                    <Button variant="outline-secondary" id="button-plus"
                        onClick={onAddClick}
                        disabled={parseInt(quantityInCart) === parseInt(product.quantity)}
                    >
                        +
                    </Button>
                </InputGroup>
                <button className="btn btn-outline-danger" type="button"
                    onClick={onRemoveClick}
                >Remove from Cart</button>
            </div>
        </div>
    )
}
