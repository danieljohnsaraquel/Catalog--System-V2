import React, {} from 'react'
import Table from 'react-bootstrap/Table';

export const ComponentToPrint = React.forwardRef((props, ref) => {
    const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'AED',
	})


    const generateProductRows = () => {
        return props.products.map((product, index) => {
            if (!!product) {
                return (
                    <tr key={`${props.order.id}-${product.id}`}>
                        <td>{product.name}</td>
                        <td>{product.quantityToBuy}</td>
                        <td>{formatter.format(product.price)}</td>
                    </tr> 
                )
            }
            else {
                return (
                    <tr key={`${props.order.id}-${index}`}>
                        <td colSpan={3}>Product Removed</td>
                    </tr> 
                )
                
            }
        })
    }

    return (
        <div ref={ref} style={{margin: '20px 30px'}}>
            <h1>Test Receipt</h1>
            <hr />

            <br />
            <br />
            
            <h2>Recipient Name: {props.user.firstName} {props.user.lastName}</h2>
            <h4>Recipient Address: {props.user.address}</h4>
            <hr />

            <br />
            <br />

            <h1>Items</h1>

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
                <p>Total Price: {formatter.format(props.totalPrice)}</p>
            </div>
        </div>
    );
});
  