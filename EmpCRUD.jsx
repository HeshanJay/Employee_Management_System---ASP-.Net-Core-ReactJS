import React, {useState, useEffect, Fragment} from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmpCRUD = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    

    //insert
    const[eid, setEid] = useState('');
    const[dcode, setDcode] = useState('');
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[dateOfBirth, setDateOfBirth] = useState('');
    const[age, setAge] = useState('');
    const[employeeType, setEmployeeType] = useState('');
    const[salary, setSalary] = useState('');

    //update
    const[editEid, setEditEid] = useState('');
    const[editDcode, setEditDcode] = useState('');
    const[editFirstName, setEditFirstName] = useState('');
    const[editLastName, setEditLastName] = useState('');
    const[editEmail, setEditEmail] = useState('');
    const[editDateOfBirth, setEditDateOfBirth] = useState('');
    const[editAge, setEditAge] = useState('');
    const[editEmployeeType, setEditEmployeeType] = useState('');
    const[editSalary, setEditSalary] = useState('');
    

    const [data, setData] = useState([]);// array that stores employees

    const [department, setDeparment] = useState([]);//array that stores department


    //age calcuation
    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      
        const hasBirthdayOccurred =
          today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
      
        if (!hasBirthdayOccurred) {
          calculatedAge--;
        }
      
        return calculatedAge;
    };
      
     
    useEffect(() => {
        setAge(calculateAge(dateOfBirth));
      }, [dateOfBirth]);
      
      
    useEffect(() => {   
        setEditAge(calculateAge(editDateOfBirth));
    }, [editDateOfBirth]);
    

    useEffect(() =>{
        getData();//Initialization of employees 
        getDepartments();//Initialization of departments
    },[])

    //getDepartments
    const getDepartments = () =>{
        axios.get('http://localhost:5112/api/Department')
        .then((result)=>{
            setDeparment(result.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const getData = () =>{
        axios.get('http://localhost:5112/api/Employee')//get url
        .then((result)=>{
            setData(result.data)
            const EID = 'E' + (result.data.length + 1).toString();
            setEid(EID)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleEdit = (eid) => {
        handleShow();
        axios.get(`http://localhost:5112/api/Employee/${eid}`)
        .then((result)=>{
            console.log(result)
            setEditEid(result.data.eid);
            setEditDcode(result.data.dcode);
            setEditFirstName(result.data.firstName);
            setEditLastName(result.data.lastName);
            setEditEmail(result.data.email);
            setEditDateOfBirth(result.data.dateOfBirth);
            setEditAge(result.data.age);
            setEditEmployeeType(result.data.employeeType);
            setEditSalary(result.data.salary);
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleDelete = (eid) => {
        if(window.confirm("Are you sure you want to delete this employee") === true)
        {
            axios.delete(`http://localhost:5112/api/Employee/${eid}`)//delete url
            .then((result) => {
                if(result.status === 200)
                {
                    toast.success('Employee deleted successfully');
                    getData();
                }
            }).catch((error)=> {
                toast.error(error);
            })
        }
    }

    const handleUpdate =() =>{
        const url = `http://localhost:5112/api/Employee/${editEid}`;//put url
        const data = {
            "eid": editEid,
            "dcode": editDcode,
            "firstName": editFirstName,
            "lastName": editLastName,
            "email": editEmail,
            "dateOfBirth": editDateOfBirth,
            "age": editAge,
            "employeeType": editEmployeeType,
            "salary": editSalary
        }

        axios.put(url, data)
        .then((result) =>{
            getData();
            clear();
            toast.success('Employee updated successfully');
        }).catch((error)=> {
            toast.error(error);
        })     
    }

    const handleSave = (e) => {
        e.preventDefault();  
        const url = 'http://localhost:5112/api/Employee';
        const data = {
            "eid": eid,
            "dcode": dcode,
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "dateOfBirth": dateOfBirth,
            "age": age,
            "employeeType": employeeType,
            "salary": salary
        };
        console.log(data);
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('Employee has been added');
            })
            .catch((error) => {
                toast.error(error.message || 'Failed to add employee');
                console.error(error.response.data);
            });
    };
    
    const clear = () => {
        setEid('');
        setDcode('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setDateOfBirth('');
        setAge('');
        setEmployeeType(''); 
        setSalary('');
        setEditEid('');
        setEditDcode('');
        setEditFirstName('');
        setEditLastName('');
        setEditEmail('');
        setEditDateOfBirth('');
        setEditAge('');
        setEditEmployeeType('');
        setEditSalary('');
    }

    return(
        <Fragment>
            <ToastContainer />
            <h4>Add New Employee</h4>
            <br />
            <br />
            <Container>
                <Row>
                    <Col xs={12} md={6}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formEmployeeID">
                        <Form.Label>Employee ID</Form.Label>
                        <Form.Control type="text" placeholder="Enter Employee ID" 
                        value={eid} required readOnly/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDepartmentCode">
                        <Form.Label>Select Department</Form.Label>
                        <Form.Control as="select" value={dcode} onChange={(e)=> setDcode(e.target.value)} required>
                            <option value="" disabled>Select Department</option>
                                {department.map((department, index) => (
                            <option key={index} value={department.dcode}>
                            {department.dname}
                            </option>
                            ))}
                        </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter First Name" 
                        value={firstName} onChange={(e)=> setFirstName(e.target.value)}
                        required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Last Name" 
                        value={lastName} onChange={(e)=> setLastName(e.target.value)}
                        required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter Email" 
                        value={email} onChange={(e)=> setEmail(e.target.value)}
                        required/>
                        </Form.Group>
                    </Form>
                    </Col>

                    <Col xs={12} md={6}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formDateOfBirth">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" placeholder="Enter Date of Birth" 
                        value={dateOfBirth} onChange={(e)=> setDateOfBirth(e.target.value)}
                        required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAge">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="number" placeholder="Enter Age" 
                        value={age} onChange={(e)=> setAge(e.target.value)} readOnly/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmployeeType">
                        <Form.Label>Employee Type</Form.Label>
                        <Form.Control as="select" placeholder="Select Employee Type"
                        value={employeeType} onChange={(e)=> setEmployeeType(e.target.value)}
                        required>
                            <option value="">Select Employee Type</option>
                            <option value="Permanent">Permanent</option>
                            <option value="Contract">Contract</option>
                        </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formSalary">
                        <Form.Label>Salary</Form.Label>
                        <Form.Control type="number" placeholder="Enter Salary" 
                        value={salary} onChange={(e)=> setSalary(e.target.value)}
                        required/>
                        </Form.Group>

                        <Button variant="primary" type="submit" onClick={(e) => handleSave(e)}>
                            Submit
                        </Button>
                    </Form>
                    </Col>
                </Row>
                </Container>
            <br />
            <br />
            <Table striped bordered hover>
                    
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Department Code</th>
                            <th>Fist Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Date of Birth</th>
                            <th>Age</th>
                            <th>Employee Type</th>
                            <th>Salary</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.length > 0 ?
                                data.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.eid}</td>
                                            <td>{item.dcode}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.email}</td>
                                            <td>{item.dateOfBirth}</td>
                                            <td>{item.age}</td>
                                            <td>{item.employeeType}</td>
                                            <td>{item.salary}</td>
                                            <td colSpan={2}>
                                                <button className="btn btn-primary" onClick={()=> handleEdit(item.eid)}>Edit</button> &nbsp;
                                                <button className="btn btn-danger" onClick={()=> handleDelete(item.eid)}>Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                'Londing...'
                        }
                    </tbody>
                </Table>
            <Modal show={show} onHide={handleClose} dialogClassName="modal-fullscreen">
                <Modal.Header closeButton>
                <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Container>
                <Row>
                    <Col xs={12} md={6}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formEmployeeID">
                        <Form.Label>Employee ID</Form.Label>
                        <Form.Control type="text" placeholder="Enter Employee ID" 
                        value={editEid}
                        required readOnly/>
                        </Form.Group>

                        {/* <Form.Group className="mb-3" controlId="formDepartmentCode">
                        <Form.Label>Department Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter Department Code" 
                        value={editDcode} onChange={(e)=> setEditDcode(e.target.value)}
                        required/>
                        </Form.Group> */}

                        <Form.Group className="mb-3" controlId="formDepartmentCode">
                        <Form.Label>Select Department</Form.Label>
                        <Form.Control as="select" value={editDcode} onChange={(e)=> setEditDcode(e.target.value)} required>
                            <option value="" disabled>Select Department</option>
                                {department.map((department, index) => (
                            <option key={index} value={department.dcode}>
                            {department.dname}
                            </option>
                            ))}
                        </Form.Control>
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter First Name" 
                        value={editFirstName} onChange={(e)=> setEditFirstName(e.target.value)}
                        required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Last Name" 
                        value={editLastName} onChange={(e)=> setEditLastName(e.target.value)}
                        required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter Email" 
                        value={editEmail} onChange={(e)=> setEditEmail(e.target.value)}
                        required/>
                        </Form.Group>
                    </Form>
                    </Col>

                    <Col xs={12} md={6}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formDateOfBirth">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" placeholder="Enter Date of Birth" 
                        value={editDateOfBirth} onChange={(e)=> setEditDateOfBirth(e.target.value)}
                        required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formAge">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="number" placeholder="Enter Age" 
                        value={editAge} onChange={(e)=> setEditAge(e.target.value)} readOnly/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmployeeType">
                        <Form.Label>Employee Type</Form.Label>
                        <Form.Control as="select" placeholder="Select Employee Type"
                        value={editEmployeeType} onChange={(e)=> setEditEmployeeType(e.target.value)}
                        required>
                            <option value="">Select Employee Type</option>
                            <option value="permanent">Permanent</option>
                            <option value="contract">Contract</option>
                        </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formSalary">
                        <Form.Label>Salary</Form.Label>
                        <Form.Control type="number" placeholder="Enter Salary" 
                        value={editSalary} onChange={(e)=> setEditSalary(e.target.value)}
                        required/>
                        </Form.Group>
                    </Form>
                    </Col>
                </Row>
                </Container>
                    </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleUpdate}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                </Modal>
        </Fragment>
    )
}

export default EmpCRUD;