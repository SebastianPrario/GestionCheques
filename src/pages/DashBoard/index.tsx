import React, {  useContext, useEffect, useState } from 'react';
import { Check, CheckContext } from '../../contexts/CheckContext';
import Styled from './styles';
import { AuthContext } from '../../contexts/AuthContext';
import { Button, Form } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import NavBar from '../NavBar/NavBar';


const DashBoard = () => {
  const { checkList, addAllCheck, deleteCheck } = useContext(CheckContext);
  const [ checkedSelection, setCheckedSelection ] = useState < Check[] > ([]) // crea un objeto con los elementos seleccionado
  const authContext = useContext(AuthContext);
  
  const handleCheckboxSelection = (e :  React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    const numberCheck = Number(name)
    const itemCheck = checkList?.filter( (check) => 
     check.numero === numberCheck
    )
  
    if (itemCheck){
      if(e.target.checked){ setCheckedSelection([... checkedSelection,itemCheck[0] ] )
    }
    else { console.log('entra')
      setCheckedSelection( checkedSelection.filter( (check) => check.id !== itemCheck[0].id )) }
    }
  }
  const handleDeleteChange  =   (event: React.MouseEvent<HTMLButtonElement>): void => {
    const token = authContext && authContext.user?.token 
    const id = Number((event.target as HTMLButtonElement).name);
    if (token) {deleteCheck(id, token)}
  }
 

  
  useEffect(() => {
    if (authContext?.user?.token) {
       addAllCheck(authContext.user?.token)
      }
    }, []); // Dependencia para volver a cargar cuando el contexto cambie


  return (
    <div className=''>
      <Styled.Nav>
      <NavBar  checkSelection = {checkedSelection}/>
      </Styled.Nav>
      <div>  
      <Table striped bordered hover variant="dark" className=''>
          <thead>
          <tr>
            <th>Sel.</th>
            <th>Número de cheque</th>
            <th>Cliente</th>
            <th>Librador</th>
            <th>Fecha de Cobro</th>
            <th>Fecha de Emisión</th>
            <th>Importe</th>
            <th>Banco emisor</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <div></div>
        <tbody>
          {checkList ? (
            checkList?.map((elem: Check) => {
              return (
                <tr className='text-end' key={elem.id}>
                <td>
                  <Form.Check 
                  name={`${elem.numero}`}
                  onChange={handleCheckboxSelection}
                  />
                </td>  
                  <td className='text-center col-2'> {elem.numero} </td>
                  <td> {elem.cliente} </td>
                  <td> {elem.librador} </td>
                  <td> {elem.fechaEntrega} </td>
                  <td> {elem.fechaEmision} </td>
                  <td> {elem.importe} </td>
                  <td> {elem.banco} </td>
                  <td>
                    <Button
                    onClick={handleDeleteChange}
                    name={`${elem.id}`}
                    > eliminar</Button>
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

export default DashBoard;
