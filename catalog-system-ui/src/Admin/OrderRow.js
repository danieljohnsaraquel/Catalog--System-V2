import React, {useState, useEffect} from 'react'
import webApi from '../api/web'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';


export default function OrderRow({order, onOrderStatusChanged, onOrderETAChanged}) {
    const [products, setProducts] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [recipient, setRecipient] = useState({})
    const [eta, setETA] = useState(new Date())

    const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'AED',
	})

    useEffect(() => {
        let cartArray = order.products?.split(', ').filter(element => element !== '') || []
        let cartPromises = []
        let price = 0
        cartArray.forEach((element, index) => {
            if (index % 2 === 0) {
                cartPromises.push(
                    webApi.getItemById(element)
                    .then(response => {
                        if (response.data) {
                            price += parseInt(response.data.price) * parseInt(cartArray[index + 1])
                            return {...response.data, quantityToBuy: cartArray[index + 1]}
                        }
                        else {
                            return null
                        }
                    })
                )
            }
        });

        Promise.all(cartPromises)
        .then(response => {
            setProducts(response)
            setTotalPrice(price)
        })
        .catch(error => {
            console.log(error)
        })

        webApi.getUserData(order.recipient)
        .then(response => {
            setRecipient(response.data)
        })
        .catch(error => {
            console.log(error)
        })

        setETA(new Date(order.eta) || new Date())

    }, [])

    const generateProductRows = () => {
        return products.map((product, index) => {
            if (!!product) {
                return (
                    <tr key={`${order.id}-${product.id}`}>
                        <td>{product.name}</td>
                        <td>{product.quantityToBuy}</td>
                        <td>{formatter.format(product.price)}</td>
                    </tr> 
                )
            }
            else {
                return (
                    <tr key={`${order.id}-${index}-${Math.random() * 5}`}>
                        <td colSpan={3} className="text-center"><i>Product Removed</i></td>
                    </tr> 
                )
            }
        })
    }

    const onStatusChanged = (value) => {
        onOrderStatusChanged(value)
    }
    
    return (
        <div className="order-row mb-4 p-3">
            <div>
                <h5 className="text-primary">
                    #{order.id}
                </h5>
                <h5 className='text-secondary'>Recipient Name: {recipient.firstName} {recipient.lastName}</h5>
                <p>Recipient Address: <b>{recipient.address}</b></p>
                <hr />
                <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {generateProductRows()}
                </tbody>
                </Table>
                <div className="text-right">
                    <p>Total Price: {formatter.format(totalPrice)}</p>
                </div>
            </div>
            <hr />
            <div className="mt-4">
                <Form.Label className='text-primary'>Set ETA</Form.Label>
                <DatePicker
                selected={eta}
                onChange={(date) => {setETA(date)}}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
                />
                <button className="btn btn-outline-secondary btn-sm mt-1" onClick={e => {onOrderETAChanged(eta)}}>Apply ETA</button>
            </div>
            <div className='mt-4'>
                <Form.Label className='text-primary'>Set Status</Form.Label>
                <Form.Select className="form-control" value={order.status} onChange={e => {onStatusChanged(e.target.value)}} aria-label="Default select example">
                    <option value="preparing">Preparing Package</option>
                    <option value="otw">On The Way</option>
                    <option value="arrived">Packaged Arrived</option>
                    <option value="completed">Delivered (Completed)</option>
                </Form.Select>
            </div>
            <hr />
        </div>
    )
}
