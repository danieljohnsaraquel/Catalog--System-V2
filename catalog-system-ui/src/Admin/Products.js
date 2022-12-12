import React, {useState, useEffect} from 'react'
import webApi from '../api/web'
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import fileDownload from "js-file-download";


export default function Products() {
	const [products, setProducts] = useState([])
	const [name, setName] = useState('')
	const [brand, setBrand] = useState('')
	const [type, setType] = useState('')
	const [quantity, setQuantity] = useState(0)
	const [price, setPrice] = useState(0)
	const [image, setImage] = useState('')

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'AED',
	})

	const [addProductModalShow, setAddProductModalShow] = useState(false);
	const handleAddProductModalClose = () => setAddProductModalShow(false);
	const handleAddProductModalShow = () => setAddProductModalShow(true);

	const [editProductModalShow, setEditProductModalShow] = useState(false);
	const handleEditProductModalClose = () => setEditProductModalShow(false);
	const handleEditProductModalShow = () => setEditProductModalShow(true);

	const [deleteProductModalShow, setDeleteProductModalShow] = useState(false);
	const handleDeleteProductModalClose = () => setDeleteProductModalShow(false);
	const handleDeleteProductModalShow = () => setDeleteProductModalShow(true);

	const [nameForEdit, setNameForEdit] = useState('')
	const [brandForEdit, setBrandForEdit] = useState('')
	const [typeForEdit, setTypeForEdit] = useState('')
	const [quantityForEdit, setQuantityForEdit] = useState(0)
	const [priceForEdit, setPriceForEdit] = useState(0)
	const [imageForEdit, setImageForEdit] = useState('')

	const [selectedForEdit, setSelectedForEdit] = useState({})
	const [selectedForDelete, setSelectedForDelete] = useState({})


	useEffect(() => {
		webApi.getAllItems()
		.then(response => {
			setProducts(response.data)
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'queryFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
	}, [])

	const onSubmit = e => {
		e.preventDefault();
		onRegister()

	};

	const onRegister = () => {
		webApi.addItem(name, brand, type, quantity, price, image)
		.then(response => {
			handleAddProductModalClose()
			toast.success(response.message, { 
				toastId: 'addSuccess',
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
			return  webApi.getAllItems()
		})
		.then(response => {
			setProducts(response.data)
			setName('')
			setBrand('')
			setType('')
			setQuantity(0)
			setPrice(0)
			setImage('')
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'addFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
	}

	const onEditClick = (product) => {
		setNameForEdit(product.name)
		setBrandForEdit(product.brand)
		setTypeForEdit(product.type)
		setQuantityForEdit(product.quantity)
		setPriceForEdit(product.price)
		setImageForEdit(product.image)
		setSelectedForEdit(product)
		handleEditProductModalShow()	
	}

	const onSubmitUpdate = (e) => {
		e.preventDefault();
		webApi.editItem(selectedForEdit.id, nameForEdit, brandForEdit, typeForEdit, quantityForEdit, priceForEdit, imageForEdit)
		.then(response => {
			toast.success(response.message, {
				toastId: 'updateSuccess', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
			setProducts((prevValue) => {
				let newValue = [...prevValue]
				let targetValueIndex = newValue.findIndex(product => product.id === selectedForEdit.id)
				newValue[targetValueIndex].name = nameForEdit
				newValue[targetValueIndex].brand = brandForEdit
				newValue[targetValueIndex].type = typeForEdit
				newValue[targetValueIndex].quantity = quantityForEdit
				newValue[targetValueIndex].price = priceForEdit
				newValue[targetValueIndex].image = imageForEdit
				return newValue
			})
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'updateFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
		.finally(() => {
			handleEditProductModalClose()	
		}) 
	}

	const onRemoveClick = (product) => {
		setSelectedForDelete(product)
		handleDeleteProductModalShow()
	}

	const onProductDelete = () => {
		webApi.deleteItem(selectedForDelete.id)
		.then(response => {
			toast.success(response.message, {
				toastId: 'deleteSuccess', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
			setProducts((prevValue) => {
				let newValue = [...prevValue]
				newValue = newValue.filter(product => product.id !== selectedForDelete.id)
				return newValue
			})
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'deleteFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
		.finally(() => {
			handleDeleteProductModalClose()

		}) 
	}

	const onCSVFileDownload = () => {
		let blobString = ''
        blobString += ['id#', 'Product Name', 'Brand', 'Type', 'Price', 'Stock', 'Image URL'].join(',') + '\n'
		products.forEach(product => {
			blobString += [product.id, product.name, product.brand, product.type, product.price, product.quantity, product.image].join(',') + '\n'
		})
        var myblob = new Blob([blobString], {
            type: 'text/csv'
        });
        let fileName = `Products.csv`
        fileDownload(myblob, fileName)
	}

	const generateTableRow = () => {
		return products.map(product => {
			return (
				<tr key={product.id}>
					<td>{product.id}</td>
					<td><img src={product.image} alt={product.name} width="100"/></td>
					<td>{product.name}</td>
					<td>{product.brand}</td>
					<td>{product.type}</td>
					<td>{formatter.format(product.price)}</td>
					<td>{product.quantity}</td>
					<td>
						<button type="button" className="btn btn-danger mr-2" onClick={() => {onRemoveClick(product)}}>Remove</button>
						<button type="button" className="btn btn-warning" onClick={() => {onEditClick(product)}}>Edit</button>
					</td>
				</tr>
			)
		})
		
	}
	

	return (
		<div className="m-5">
			<div className="text-center text-primary" style={{width: '100%'}}>
				<h1>Products</h1>
				<hr />
			</div>

			<div className='my-3'>
				<button type="button" className="btn btn-success btn-lg btn-block" onClick={handleAddProductModalShow}>Add Product</button>
			</div>

			<div style={{height: '70vh', overflow: 'auto'}}>
				<Table bordered hover responsive>
					<thead>
						<tr>
							<th>id #</th>
							<th>Image</th>
							<th>Name</th>
							<th>Brand</th>
							<th>Type</th>
							<th>Price</th>
							<th>Stock</th>
							<th>Options</th>
						</tr>
					</thead>
					<tbody>
						{generateTableRow()}
					</tbody>
				</Table>
			</div>

			<div className="mt-3">
				<button className="btn btn-outline-primary btn-block" onClick={() => {onCSVFileDownload()}}>Download CSV File</button>
			</div>

			<Modal show={addProductModalShow} onHide={handleAddProductModalClose}>
				<Modal.Header>
					<Modal.Title>Add Product</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={onSubmit}>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Product Name</Form.Label>
							<Form.Control type="text" placeholder="Enter Product Name" value={name} onChange={e => {setName(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label>Brand</Form.Label>
							<Form.Control type="text" placeholder="Enter Brand" value={brand} onChange={e => {setBrand(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicFirstName">
							<Form.Label>Type</Form.Label>
							<Form.Control type="text" placeholder="Enter Type" value={type} onChange={e => {setType(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicLastName">
							<Form.Label>Stock</Form.Label>
							<Form.Control type="number" placeholder="Set Amount" min={0} value={quantity} onChange={e => {setQuantity(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicLastName">
							<Form.Label>Price</Form.Label>
							<Form.Control type="number" placeholder="Set Amount" min={0} value={price} onChange={e => {setPrice(e.target.value)}} />
						</Form.Group>
						
						<Form.Group className="mb-3" controlId="formBasicFirstName">
							<Form.Label>Image URL (optional)</Form.Label>
							<Form.Control type="text" placeholder="Enter Image URL" value={image} onChange={e => {setImage(e.target.value)}} />
						</Form.Group>

						<hr />

						<Button variant="primary" type="submit" disabled={!name || !brand || !type}>
							Register
						</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleAddProductModalClose}>
					Close
				</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={editProductModalShow} onHide={handleEditProductModalClose}>
				<Modal.Header>
					<Modal.Title>Edit Product</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={onSubmitUpdate}>
					<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Product Name</Form.Label>
							<Form.Control type="text" placeholder="Enter Product Name" value={nameForEdit} onChange={e => {setNameForEdit(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label>Brand</Form.Label>
							<Form.Control type="text" placeholder="Enter Brand" value={brandForEdit} onChange={e => {setBrandForEdit(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicFirstName">
							<Form.Label>Type</Form.Label>
							<Form.Control type="text" placeholder="Enter Type" value={typeForEdit} onChange={e => {setTypeForEdit(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicLastName">
							<Form.Label>Stock</Form.Label>
							<Form.Control type="number" placeholder="Set Amount" min={0} value={quantityForEdit} onChange={e => {setQuantityForEdit(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicLastName">
							<Form.Label>Price</Form.Label>
							<Form.Control type="number" placeholder="Set Amount" min={0} value={priceForEdit} onChange={e => {setPriceForEdit(e.target.value)}} />
						</Form.Group>
						
						<Form.Group className="mb-3" controlId="formBasicFirstName">
							<Form.Label>Image URL (optional)</Form.Label>
							<Form.Control type="text" placeholder="Enter Image URL" value={imageForEdit} onChange={e => {setImageForEdit(e.target.value)}} />
						</Form.Group>

						<hr />

						<Button variant="primary" type="submit">
							Update
						</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleEditProductModalClose}>
					Close
				</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={deleteProductModalShow} onHide={handleDeleteProductModalClose}>
				<Modal.Header>
					<Modal.Title>Delete Product?</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to delete Product #{selectedForDelete.id} {selectedForDelete.name}?</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleDeleteProductModalClose}>
					No
				</Button>
				<Button variant="primary" onClick={onProductDelete}>
					Yes
				</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}
