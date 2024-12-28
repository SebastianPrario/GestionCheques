import {  useContext, useEffect, useState} from 'react';
import { Check, CheckContext, Order } from '../../contexts/CheckContext';
import Styled from './styles';
import { AuthContext } from '../../contexts/AuthContext';
import Table from 'react-bootstrap/Table';
import NavBar from '../NavBar/NavBar';
import { Button } from 'react-bootstrap';
import { headerToken } from '../../librery/helpers';
import { deleteOrderApi, getApiData } from '../../services/apiService';
import PdfOrder from './Pdfview/PdfDown';
import { number } from 'zod';
import ReactDOM from 'react-dom';


const OrdersView = () => {
    const [orders, setOrders] = useState<Order[] | null | undefined>(null);
    const authContext = useContext(AuthContext);
    const token = authContext && authContext.user?.token 
    const headers = headerToken(token)
    
    const getOrders = async (token: string) => {
       
       //tLoading(true);
        const response = await  getApiData( 'order/allorders',  headers );
        const data: Order[] = response?.data;
        setOrders(data);
        //setLoading(false);
        console.log(response)
    };
    
    
    
    const handleDownloadClick = (id: number) => {
      const newWindow = window.open('', '');
      if (newWindow) {
          newWindow.document.write('<div id="pdf-order-root"></div>');
          newWindow.document.title = "PDF Order";
          newWindow.document.close();
          ReactDOM.render(<PdfOrder
             id={id}
             token={token} />,
          newWindow.document.getElementById('pdf-order-root'));
      }
  };
      
  const handleDelete = async (id: number) => {
    try {
      await deleteOrderApi('order', headers, id);
      const response = await getApiData('order/allorders', headers);
      setOrders(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  // al cargar la pagina se obtienen todas las ordenes y se muestran en el estado
  useEffect(() => {
    if (authContext?.user?.token) {
      getOrders(authContext.user?.token);
    } 
  }, [authContext]);  

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
            orders?.map((order: Order) => {
              return (
                <tr className='text-end' key={order.id}>
                  <td className='text-center col-2'> {order.id} </td>
                  <td> {order.destination} </td>
                  <td> {order.totalAmount} </td>
                  <td> {order.creationDate} </td>
                  <td className='d- justify-content-between'>
                    <div> 
                    <Button className='me-2' variant="primary" onClick={() => order.id && handleDelete(order.id)}> 
                        Eliminar 
                      </Button> 
                      <Button variant="primary" onClick={() => order.id && handleDownloadClick(order.id)}> 
                        Mostrar 
                      </Button> 
                    </div>
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
