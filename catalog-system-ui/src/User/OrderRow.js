import React, {useState, useEffect, useRef} from 'react'
import webApi from '../api/web'
import Table from 'react-bootstrap/Table';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from './ComponentToPrint';
import { useUser } from '../UserContext';


export default function OrderRow({order}) {
    const [products, setProducts] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const componentRef = useRef();

    const {
        userObject,
    } = useUser()

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
                    <tr key={`${order.id}-${index}`}>
                        <td colSpan={3} className="text-center"><i>Product Removed</i></td>
                    </tr> 
                )
            }
        })
    }

    const dhm = (ms) => {
        const days = Math.floor(ms / (24*60*60*1000));
        const daysms = ms % (24*60*60*1000);
        const hours = Math.floor(daysms / (60*60*1000));
        const hoursms = ms % (60*60*1000);
        const minutes = Math.floor(hoursms / (60*1000));
        return days + " days " + hours + " hours " + minutes + " minutes";
      }

    const generateStatus = (status) => {
        let date = new Date().getTime()
        let expectedDate = new Date(order.eta).getTime();
        let evaluated = expectedDate - date
        if (status === 'preparing') {
            return 'Preparing Package'
        }
        else if (status === 'otw') {
            return `On The Way (estimated ${dhm(evaluated)})`
        }
        else if (status === 'arrived') {
            return 'Packaged Arrived'

        }
        else if (status === 'completed') {
            return 'Delivered'
        }
    }
    
    return (
        <div className="order-row mb-4 p-3">
            <div>
                <h5 className="text-primary">
                    #{order.id}
                </h5>
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
            <p>Status: <b>{generateStatus(order.status)}</b> </p>
            <hr />
            
            <div>
                <ReactToPrint
                    trigger={() => <div><button className="btn btn-outline-primary btn-block">Download Receipt</button></div>}
                    content={() => componentRef.current}
                />
                <div style={{display: 'none'}}>
                    <ComponentToPrint
                    ref={componentRef}
                    user={userObject}
                    order={order}
                    products={products}
                    totalPrice={totalPrice}
                     />
                </div>
            </div>
        </div>
    )
}
