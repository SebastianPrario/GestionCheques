import Swal from 'sweetalert2'
import axios from 'axios'
import { SignUp } from './types'
import { format } from 'date-fns';

export const postMethod = async (data: SignUp) => {
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
            localStorage.setItem('token', response.data?.token)
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

export const CheckToken = () => {
    const token = getToken()
    if (token) {
        return true
    }
    return false
}

export const getToken = () => {
    return localStorage.getItem('token') || null
}

export const signUp = async (data: SignUp) => {
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

export const headerToken = (token: string | undefined) => {
    const authorization = { authorization: `Bearer ${token}` }
    return authorization
}

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export const formatDate = (date: string): string => {
    return format(new Date(date), 'dd/MM/yyyy');
};