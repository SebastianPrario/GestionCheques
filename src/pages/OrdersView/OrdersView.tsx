import {  useContext, useEffect} from 'react';
import { CheckContext, Order } from '../../contexts/CheckContext';
import Styled from './styles';
import { AuthContext } from '../../contexts/AuthContext';
import Table from 'react-bootstrap/Table';
import NavBar from '../NavBar/NavBar';
import { Button } from 'react-bootstrap';

const OrdersView = () => {
    const authContext = useContext(AuthContext);
    const { getOrders , orders  } = useContext(CheckContext);
    
  useEffect(() => {
    if (authContext?.user?.token) {
        getOrders(authContext.user?.token)
       }
  }, [authContext?.user?.token, getOrders])
  
  console.log(orders)
  return (
    <div className=''>
      <Styled.Nav>
      <NavBar checkSelection={[]}/>
      </Styled.Nav>
      <div>  
      <Table striped bordered hover variant="dark" className=''>
          <thead>
          <tr>
            <th>Número</th>
            <th>Destino</th>
            <th>Importe</th>
            <th>Fecha</th>
            <th>acciones</th>  
          </tr>
        </thead>
        <div></div>
        <tbody>
          {orders ? (
            orders?.map((elem: Order) => {
              return (
                <tr className='text-end' key={elem.id}>
                  <td className='text-center col-2'> {elem.id} </td>
                  <td> {elem.destination} </td>
                  <td> {elem.totalAmount} </td>
                  <td> {elem.creationDate} </td>
                  <td className='d- justify-content-between'>
                  <Button  className='me-2'variant="primary">
                      ver
                  </Button>
                  <Button variant="primary">
                      descargar
                  </Button>

                  </td>
                </tr>
              );
            })
          ) : (
            <>cargando</>
          )}
        </tbody>
      </Table>
      </div>

    </div>
  );
};

export default OrdersView;
