import axios from 'axios'
import Swal from 'sweetalert2'
import { SignUp } from './../librery/types'

export interface otherPayment {
    property: string
    number: number
}
export interface Bank {
    id: number
    bank: string
    user: string
}
export interface Cliente {
    id: string
    name: string
    user: string
}
export interface NewBank {
    bank: string
}
export interface Order {
    destination: string
    totalAmount: number
    detail: string
    creationDate: string
    chequesId: number[]
    otherPayment?: otherPayment[]
}

export type OrderBy =
    | 'numero'
    | 'importe'
    | 'cliente'
    | 'librador'
    | 'fechaEmision'
    | 'fechaEntrega'
    | 'banco'

const URL = import.meta.env.VITE_API_URL


export const apiService = axios.create({ baseURL: URL })

export const fetchApi = async <T>(
    endpoint: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: T,
    params?: { [key: string]: string | number }
) => {
    
    const instance = axios.create({
    baseURL: URL,
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('userGestionToken')}`,
        'Content-Type': 'application/json',
    }})
   
    try {
        const response = await instance.request({
            url: `${endpoint}`,
            method,
            params,
            data,
        })
        return response
    } catch (error: unknown) {
        console.log(error)
    }
}


export const getCuitInfo = async(
        endpoint: string,
        params?: { [key: string]: string | number }
    ) => {
        
        const instance = axios.create({
        baseURL: URL,
        })
        try {
            const response = await instance.request({
                url: `${endpoint}`,
                method: 'GET',
                params,
                
            })
       
            return response
        } catch (error: unknown) {
            console.log(error)
        }
    
}
   
   
   
   
   
   

export const fetchLogin = async (data: SignUp) => {
    const URL: string | undefined = import.meta.env.VITE_API_URL_SIGNIN
    try {
        if (URL) {
            const response = await axios.post(URL, data)
            if (response.data === 'usuario o password incorrecta') {
                Swal.fire({
                    title: 'Error!',
                    text: 'email o contraseña incorrecta',
                    icon: 'error',
                    confirmButtonText: 'error',
                })
            }
           
            return response.data
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: 'email o contraseña incorrecta',
            icon: 'error',
            confirmButtonText: 'aceptar',
        })
        return
    }
}

export const fetchSignUp = async (data: SignUp) => {
    const URL: string | undefined = import.meta.env.VITE_API_URL_SIGNUP
    try {
        if (URL) {
            const response = await axios.post(URL, data)
            console.log(response)
            if (response) {
                Swal.fire({
                    title: 'Usuario Creado',
                    icon: 'success',
                    confirmButtonText: 'cerrar',
                })
                return response
            }
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response?.data?.message === 'email existente') {
                Swal.fire({
                    title: 'Error!',
                    text: 'Email Existente',
                    icon: 'error',
                    confirmButtonText: 'cerrar',
                })
            }
        } else {
            console.error('Unexpected error:', error)
        }
    }
}