import React, { createContext, useState } from 'react';
import Swal from 'sweetalert2';
import { deleteCheckApi, getCheckApi, getApiData, postCheckApi } from '../services/apiService';
import { headerToken } from '../librery/helpers';

export interface Check {
  // Define las propiedades del cheque
  id?: number;
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
}
export interface Order {
  // Define las propiedades del cheque
  id?: number;
  destination: string;
  totalAmount: string;
  otherPayment: [];
  creationDate: string;
  delete: boolean;
  user: string;
}

interface CheckContextType {
  checkList: Check[] | null | undefined;
  orders: Order[] | null | undefined;
  addCheck: (data: Check , token: string) => Promise<Check[] | null| void>;
  deleteCheck: (id: number , token: string) => Promise<Check[] | void | undefined| null> ;
  addAllCheck: (token: string) => Promise<void | null>;
  getOrders: (token: string) => Promise<void | null>;
  loading: boolean | null;
}

export const CheckContext = createContext<CheckContextType>({
  checkList: [],
  orders: [],
  addCheck:  async () => {},
  deleteCheck:async () => {},
  addAllCheck: async () => null,
  getOrders: async () => null,
  loading: false,
});

function CheckProvider({ children }: { children: React.ReactNode }) {
  const [checkList, setCheck] = useState<Check[] | null | undefined>(null);
  const [orders, setOrders] = useState<Order[] | null | undefined>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error] = useState<Error | null>(null);

 
  
  const addCheck = async (data: Check, token : string | undefined) => {
      const headers = headerToken(token)
      setLoading(true);
    try {
      await postCheckApi( 'cheques', headers , data)
      if (  checkList ){
        const newCheckList = [ ...checkList , data]
        setCheck(newCheckList);
        return newCheckList}
      } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
      
  }
}

  const addAllCheck = async (token: string) => {
    try{
    const headers = headerToken(token)
    setLoading(true);
    const response = await  getCheckApi( 'cheques',  headers );
    const data: Check[] = response?.data;
    setCheck(data);
    setLoading(false);
    console.log(error)
    }catch (error) {console.log(error )}
  };

  const getOrders = async (token: string) => {
    const headers = headerToken(token)
    setLoading(true);
    const response = await  getApiData( 'order/allorders',  headers );
    const data: Order[] = response?.data;
    setOrders(data);
    setLoading(false);
    console.log(error)
  };

  const deleteCheck = async (id: number, token: string ) => {
    const headers = headerToken(token)
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    })
    if (result.isConfirmed) {
        if (URL) {
            const response = await deleteCheckApi( 'cheques', headers , id)
            const newCheckList = checkList?.filter( elem => elem?.id !== id )
            setCheck(newCheckList)
            ;
            if (response) {
              Swal.fire(
                '¡Eliminado!'
              );
              return checkList;
            }
      } 
    }
  };
  const value = {
    checkList,
    orders,
    addCheck,
    addAllCheck,
    deleteCheck,
    getOrders,
    loading,
  };
  return (
    <CheckContext.Provider value={value}>{children}</CheckContext.Provider>
  );
}

export default CheckProvider;
