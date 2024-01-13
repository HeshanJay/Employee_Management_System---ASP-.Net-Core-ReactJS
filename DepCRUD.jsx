import React, {useState, useEffect, Fragment} from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DepCRUD = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //insert
    const[dcode, setDcode] = useState('');
    const[dname, setDname] = useState('');

    //update
    const[editDcode, setEditDcode] = useState('');
    const[editDname, setEditDname] = useState('');

    const depdata = [
        {
            d_code : 'D001',
            dName : 'Information Technology'
        },
        {
            d_code : 'D002',
            dName : 'Human Resources'
        },
        {
            d_code : 'D003',
            dName : 'Marketing'
        }
    ]

    const [data, setData] = useState([]);

    useEffect(() =>{
        getData();
    },[])

    const getData = () =>{
        axios.get('http://localhost:5112/api/Department')
        .then((result)=>{
            setData(result.data)
            const Dcode = 'D' + (result.data.length + 1).toString();
            setDcode(Dcode)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleEdit = (dcode) => {
        handleShow();
        axios.get(`http://localhost:5112/api/Department/${dcode}`)
        .then((result)=>{
            setEditDcode(result.data.dcode);
            setEditDname(result.data.dname);
            setEditDcode(dcode);
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleDelete = (dcode) => {
        if(window.confirm("Are you sure you want to delete this department") === true)
        {
            axios.delete(`http://localhost:5112/api/Department/${dcode}`)
            .then((result) => {
                if(result.status === 200)
                {
                    toast.success('Department deleted successfully');
                    getData();
                }
            }).catch((error)=> {
                toast.error(error);
            })
        }
    }

    const handleUpdate =() =>{
        const url = `http://localhost:5112/api/Department/${editDcode}`;
        const data = {
            "dcode": editDcode,
            "dname": editDname
        }

        axios.put(url, data)
        .then((result) =>{
            getData();
            clear();
            toast.success('Department updated successfully');
        }).catch((error)=> {
            toast.error(error);
        })     
    }

    const handleSave = (e) => {
        e.preventDefault();  
        const url = 'http://localhost:5112/api/Department';
        const data = {
            "dcode": dcode,
            "dname": dname
        };
        console.log(data);
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('Department has been added');
            })
            .catch((error) => {
                toast.error(error.message || 'Failed to add department');
            });
    };
    
    const clear = () => {
        setDcode('');
        setDname('');
        setEditDcode('');
        setEditDname('');
    }

    return(
        <Fragment>
            <ToastContainer />
            <h4>Add New Deparment</h4>
            <br />
            <br />
            <Container>
                <Row>
                    <Col xs={12} md={6}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formEmployeeID">
                        <Form.Label>Department Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter Department Code"   
                        value={dcode} onChange={(e)=> setDcode(e.target.value)}
                        required readOnly/>
                        </Form.Group>
                    </Form>
                    </Col>

                    <Col xs={12} md={6}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formEmployeeID">
                        <Form.Label>Department Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Department Name"   
                        value={dname} onChange={(e)=> setDname(e.target.value)}
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
                        <th>Department Code</th>
                        <th>Department Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return ( 
                                    <tr key={index}>
                                        <td>{item.dcode}</td>
                                        <td>{item.dname}</td>
                                        <td colSpan={2}>
                                            <button className="btn btn-primary" onClick={()=> handleEdit(item.dcode)}>Edit</button> &nbsp;
                                            <button className="btn btn-danger"onClick={()=> handleDelete(item.dcode)}>Delete</button>
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
                <Modal.Title>Edit Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                        <Col xs={12} md={6}>
                            <Form>
                                <Form.Group className="mb-3" controlId="formEmployeeID">
                                <Form.Label>Department Code</Form.Label>
                                <Form.Control type="text" placeholder="Enter Department Code"   
                                value={editDcode} onChange={(e)=> setEditDcode(e.target.value)}
                                required readOnly/>
                                </Form.Group>
                            </Form>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form>
                                <Form.Group className="mb-3" controlId="formEmployeeID">
                                <Form.Label>Department Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter Department Name"   
                                value={editDname} onChange={(e)=> setEditDname(e.target.value)}
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

export default DepCRUD;