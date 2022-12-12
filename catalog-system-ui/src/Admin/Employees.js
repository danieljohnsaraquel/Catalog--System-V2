	import React, {useEffect, useState} from 'react'
	import webApi from '../api/web'
	import { toast } from 'react-toastify';
	import Table from 'react-bootstrap/Table';
	import Button from 'react-bootstrap/Button';
	import Modal from 'react-bootstrap/Modal';
	import Form from 'react-bootstrap/Form';
	import { useUser } from '../UserContext';
	import { useNavigate } from 'react-router-dom';

	export default function Employees() {
		const navigate = useNavigate()

		const {
			userObject
		} = useUser()

		let [employees, setEmployees] = useState([])

		const [addEmployeeModalShow, setAddEmployeeModalShow] = useState(false);
		const handleAddEmployeeModalClose = () => setAddEmployeeModalShow(false);
		const handleAddEmployeeModalShow = () => setAddEmployeeModalShow(true);

		const [deleteEmployeeModalShow, setDeleteEmployeeModalShow] = useState(false);
		const handleDeleteEmployeeModalClose = () => setDeleteEmployeeModalShow(false);
		const handleDeleteEmployeeModalShow = () => setDeleteEmployeeModalShow(true);

		const [editEmployeeModalShow, setEditEmployeeModalShow] = useState(false);
		const handleEditEmployeeModalClose = () => setEditEmployeeModalShow(false);
		const handleEditEmployeeModalShow = () => setEditEmployeeModalShow(true);

		const [email, setEmail] = useState('')
		const [password, setPassword] = useState('')
		const [firstName, setFirstName] = useState('')
		const [lastName, setLastName] = useState('')

		const [selectedForDelete, setSelectedForDelete] = useState({})
		const [selectedForEdit, setSelectedForEdit] = useState({})

		const [firstNameForEdit, setFirstNameForEdit] = useState('')
		const [lastNameForEdit, setLastNameForEdit] = useState('')


		useEffect(() => {
		if (userObject.type !== 'admin') {
			navigate('/')
		}
		webApi.getAllEmployees()
		.then(response => {
			setEmployees(response.data)
		})
		.catch(error => {
			toast.error(error.message, {
				toastId: 'queryFail', 
				autoClose: 3000,
				position: toast.POSITION.TOP_RIGHT
			})
		})
		}, [])

		const onRemoveClick = (employee) => {
			setSelectedForDelete(employee)
			handleDeleteEmployeeModalShow()
		}

		const onEmployeeDelete = () => {
			webApi.deleteEmployee(selectedForDelete.id)
			.then(response => {
				toast.success(response.message, {
					toastId: 'deleteSuccess', 
					autoClose: 3000,
					position: toast.POSITION.TOP_RIGHT
				})
				setEmployees((prevValue) => {
					let newValue = [...prevValue]
					newValue = newValue.filter(employee => employee.id !== selectedForDelete.id)
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
				handleDeleteEmployeeModalClose()

			}) 
		}

		const onEditClick = (employee) => {
			setFirstNameForEdit(employee.firstName)
			setLastNameForEdit(employee.lastName)
			setSelectedForEdit(employee)
			handleEditEmployeeModalShow()	
		}

		const onSubmitUpdate = (e) => {
			e.preventDefault();
			webApi.updateEmployeeData(selectedForEdit.id, firstNameForEdit, lastNameForEdit)
			.then(response => {
				toast.success(response.message, {
					toastId: 'updateSuccess', 
					autoClose: 3000,
					position: toast.POSITION.TOP_RIGHT
				})
				setEmployees((prevValue) => {
					let newValue = [...prevValue]
					let targetValueIndex = newValue.findIndex(employee => employee.id === selectedForEdit.id)
					newValue[targetValueIndex].firstName = firstNameForEdit
					newValue[targetValueIndex].lastName = lastNameForEdit
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
				handleEditEmployeeModalClose()	
			}) 
		}

		const onSubmit = e => {
			e.preventDefault();
			onRegister()
	
		};
	
		const onRegister = () => {
			webApi.registerUser(email, password, firstName, lastName, 'employee', '')
			.then(response => {
				handleAddEmployeeModalClose()
				toast.success(response.message, { 
					toastId: 'registerSuccess',
					autoClose: 3000,
					position: toast.POSITION.TOP_RIGHT
				})
				return  webApi.getAllEmployees()
			})
			.then(response => {
				setEmployees(response.data)
				setEmail('')
				setPassword('')
				setFirstName('')
				setLastName('')
			})
			.catch(error => {
				toast.error(error.message, {
					toastId: 'registerFail', 
					autoClose: 3000,
					position: toast.POSITION.TOP_RIGHT
				})
			})
		}


		const generateTableRow = () => {
			return employees.map(employee => {
				return (
					<tr key={employee.id}>
						<td>{employee.id}</td>
						<td>{employee.firstName} {employee.lastName}</td>
						<td>{employee.email}</td>
						<td>
							<button type="button" className="btn btn-danger mr-2" onClick={() => {onRemoveClick(employee)}}>Remove</button>
							<button type="button" className="btn btn-warning" onClick={() => {onEditClick(employee)}}>Edit</button>
						</td>
					</tr>
				)
			})
			
		}
		
		return (	
		<div className="m-5">
			<div className="text-center text-primary" style={{width: '100%'}}>
				<h1>Employees</h1>
				<hr />
			</div>

			<div className='my-3'>
				<button type="button" className="btn btn-success btn-lg btn-block" onClick={handleAddEmployeeModalShow}>Add Employee</button>
			</div>

			<div style={{height: '70vh', overflow: 'auto'}}>
				<Table responsive>
					<thead>
						<tr>
							<th>id #</th>
							<th>Name</th>
							<th>Email</th>
							<th>Options</th>
						</tr>
					</thead>
					<tbody>
						{generateTableRow()}
					</tbody>
				</Table>
			</div>

			<Modal show={addEmployeeModalShow} onHide={handleAddEmployeeModalClose}>
				<Modal.Header>
					<Modal.Title>Add Employee</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={onSubmit}>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control type="email" placeholder="Enter email" value={email} onChange={e => {setEmail(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="Password" value={password} onChange={e => {setPassword(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicFirstName">
							<Form.Label>First name</Form.Label>
							<Form.Control type="text" placeholder="Enter First name" value={firstName} onChange={e => {setFirstName(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicLastName">
							<Form.Label>Last name</Form.Label>
							<Form.Control type="text" placeholder="Enter Last name" value={lastName} onChange={e => {setLastName(e.target.value)}} />
						</Form.Group>

						<hr />

						<Button variant="primary" type="submit" disabled={!email || !password || !firstName || !lastName}>
							Register
						</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleAddEmployeeModalClose}>
					Close
				</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={deleteEmployeeModalShow} onHide={handleDeleteEmployeeModalClose}>
				<Modal.Header>
					<Modal.Title>Delete Employee?</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to delete Employee #{selectedForDelete.id} {selectedForDelete.firstName} {selectedForDelete.lastName}?</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleDeleteEmployeeModalClose}>
					No
				</Button>
				<Button variant="primary" onClick={onEmployeeDelete}>
					Yes
				</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={editEmployeeModalShow} onHide={handleEditEmployeeModalClose}>
				<Modal.Header>
					<Modal.Title>Edit Employee</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={onSubmitUpdate}>
						<Form.Group className="mb-3" controlId="formBasicFirstName">
							<Form.Label>First name</Form.Label>
							<Form.Control type="text" placeholder="Enter First name" value={firstNameForEdit} onChange={e => {setFirstNameForEdit(e.target.value)}} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicLastName">
							<Form.Label>Last name</Form.Label>
							<Form.Control type="text" placeholder="Enter Last name" value={lastNameForEdit} onChange={e => {setLastNameForEdit(e.target.value)}} />
						</Form.Group>

						<hr />

						<Button variant="primary" type="submit">
							Update
						</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleEditEmployeeModalClose}>
					Close
				</Button>
				</Modal.Footer>
			</Modal>
		</div>
		)
	}
