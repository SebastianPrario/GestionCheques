import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container, Nav } from 'react-bootstrap';
import React, { useState } from 'react';
import {  useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import EnterCheck from '../EnterCheck/EnterCheck';
import OrderPayment from '../OrderPayment/OrderPayment';
import { Check } from '../../contexts/CheckContext';
import { getCheckByNumber } from '../../services/apiService';
import CheckModal from '../CheckModal/CheckModal';
import { Order } from '../../contexts/CheckContext';

interface NavBarProps {
  checkSelection : Check[]
  setCheckedSelection : React.Dispatch<React.SetStateAction<Check[]|[]>>;
}

export interface CheckData { 
  id: number;
  numero: number;
  importe: number;
  cliente: string;
  librador: string;
  fechaEmision: string;
  fechaEntrega: string;
  banco: string;
  proveedor?: string;
  estado?: string;
  borrado?: boolean;
  user?: string;
  order?:  Order | null;


}

const  NavBar : React.FC<NavBarProps> = ( { checkSelection , setCheckedSelection })  => {
  const token = localStorage.getItem('token') 
  const { signOutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const signOut = () => {
    signOutUser()
    navigate('/')
  }
  const [searchValue, setSearchValue] = useState('');  
  const [modalShow, setModalShow] = useState(false);
  const [modalOrder, setModalOrder] = useState(false);
  const [modalCheck, setModalCheck] = useState(false);
  const [dataCheck, setDataCheck] = useState< CheckData | null> (null)
  const onClose = () =>{
    setModalShow(false)
  }
  const onCloseOrder = () =>{
    setModalOrder(false)
  }
  const onCloseCheck = () =>{
    setModalCheck(false)
  }
  async function handleClickSearch(): Promise<any> {
    try{
      const foundCheck = await getCheckByNumber(Number(searchValue), token ? { authorization: `bear ${token}` } : { authorization: '' })
      console.log(foundCheck)
      const data = foundCheck?.data
      console.log(data)
      
      if (foundCheck?.data =='Cheque no encontrado'){
        window.alert('cheque no encontrado')
      } else {
        setDataCheck(data)
        setModalCheck(true)
        console.log(dataCheck)
      }
    }catch (error){ console.log(error)}
    
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Gestion Cheques</Navbar.Brand>
        <Nav className="ms-4">
          <Button className='me-2' onClick={signOut}>Salir</Button>
          { location.pathname === '/orders' && <Button onClick={() => navigate('/dashboard')}>Volver</Button>}
        </Nav>
      </Container>
      { location.pathname !== '/orders' &&<Container>
        <Row>
          <Col xs="auto">
           <Button variant="primary" onClick={() => setModalOrder(true)}>
             Asignar Cheques
            </Button>
            <OrderPayment
              show={modalOrder}
              onClose={onCloseOrder}
              checkSelection = {checkSelection}
              setCheckedSelection = { setCheckedSelection }
            />
          </Col>
           <Col xs="auto">
           <Button variant="primary" onClick={() => setModalShow(true)}>
             Agregar Cheques
            </Button>
            <EnterCheck
              show={modalShow}
              onClose={onClose}
            />
            <CheckModal
              show={modalCheck}
              onClose={onCloseCheck}
              data={dataCheck}
            />
          </Col>
          <Col>
           <Button variant="primary" onClick={() => navigate('/orders')}>
             Ordenes
            </Button>
          </Col>
        </Row>
      </Container>
      }
      <Form className='col-2'>
        <Row className='me-5 pe-1 d-flex justify-content-end'>
          <Col className='d-flex  pe-4'>
          <input  
          type='number' 
          name='searchbutton' 
          className='form-control col-12' 
          placeholder='N° Cheque'
          value={searchValue}
          onChange={handleInputChange}/>
            <Button onClick={handleClickSearch}>Buscar</Button>
          </Col>
        </Row>
      </Form>
    </Navbar>
  );
}

export default NavBar;
