import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container, Nav } from 'react-bootstrap';
import React from 'react';
import {  useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import EnterCheck from '../EnterCheck/EnterCheck';
import OrderPayment from '../OrderPayment/OrderPayment';
import { Check } from '../../contexts/CheckContext';

interface NavBarProps {
  checkSelection : Check[]
 
}


const  NavBar : React.FC<NavBarProps> = ( { checkSelection })  => {

  const { signOutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const signOut = () => {
    signOutUser()
    navigate('/')
  }
    
  const [modalShow, setModalShow] = React.useState(false);
  const [modalOrder, setModalOrder] = React.useState(false);
  const onClose = () =>{
    setModalShow(false)
  }
  const onCloseOrder = () =>{
    setModalOrder(false)
  }
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
          </Col>
          <Col>
           <Button variant="primary" onClick={() => navigate('/orders')}>
             Ordenes
            </Button>
          </Col>
        </Row>
      </Container>
      }
      <Form>
        <Row>
          <Col xs="4">
            <Form.Control
              type="text"
              className=" mr-sm-2"
            />
          </Col>
          <Col xs="1">
            <Button type="submit">Buscar</Button>
          </Col>
        </Row>
      </Form>
    </Navbar>
  );
}

export default NavBar;
