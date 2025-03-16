import axios from 'axios'
import { Check } from '../contexts/CheckContext'

export interface otherPayment {
    property: string
    number: number
}
export interface Bank {
    id: number
    bank: string
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

export const getCheckApi = async (
    headers: {},
    order?: OrderBy,
    asc?: 'ASC' | 'DES'
) => {
    try {
        const response = order
            ? await apiService.get(`${URL}/cheques?orderBy=${order}${asc}`, {
                  headers,
              })
            : await apiService.get(`${URL}/cheques`, { headers })
        return response
    } catch (error: any) {
        if (error?.response.data.message === 'Token invalido o ruta protegida')
            return 'token invalido'
    }
}
export const getCheckByNumber = async (
    numberCheck: number,
    headers: { authorization: string }
) => {
    try {
        const response = await apiService.get(
            `${URL}/cheques/number?number=${numberCheck}`,
            { headers }
        )
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}
export const deleteCheckApi = async (headers: {}, id: number) => {
    try {
        const URLAPI = `${URL}/cheques`
        const response = await apiService.delete(`${URLAPI}/${id}`, { headers })
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`error axios check: ${error.message}`)
        }
    }
}
export const postCheckApi = async (
    endpoint: string,
    headers: { authorization: string } | undefined,
    data: Check
) => {
    try {
        const URLAPI = `${URL}/${endpoint}`
        const response = await apiService.post(`${URLAPI}`, data, { headers })
        console.log(response)
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error)
            throw new Error(`error axios check: ${error.message}`)
        }
    }
}

export const createOrderApi = async (
    endpoint: string,
    headers: { authorization: string } | undefined,
    data: Order
) => {
    try {
        const URLAPI = `${URL}/${endpoint}`
        const response = await apiService.post(`${URLAPI}`, data, { headers })
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`error axios check: ${error.message}`)
        }
    }
}

export const getApiData = async (
    endpoint: string,
    headers: { authorization: string }
) => {
    try {
        const response = await apiService.get(`${URL}/${endpoint}`, { headers })
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}

export const deleteOrderApi = async (
    endpoint: string,
    headers: { authorization: string } | undefined,
    id: number
) => {
    try {
        const URLAPI = `${URL}/${endpoint}`
        const response = await apiService.delete(`${URLAPI}/${id}`, { headers })
        return response?.data
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`error axios check: ${error.message}`)
        }
    }
}

export const getBankData = async (headers: { authorization: string }) => {
    try {
        const response = await apiService.get(`${URL}/bank`, { headers })
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}

export const createBank = async (
    headers: { authorization: string } | undefined,
    data: NewBank
) => {
    try {
        const URLAPI = `${URL}/bank`
        const response = await apiService.post(`${URLAPI}`, data, { headers })
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`error axios check: ${error.message}`)
        }
    }
}

export const deleteBank = async (
    headers: { authorization: string } | undefined,
    idBank: number
) => {
    try {
        const URLAPI = `${URL}/bank`
        const response = await apiService.delete(`${URLAPI}/${idBank}`, {
            headers,
        })
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`error axios check: ${error.message}`)
        }
    }
}
export const getAllCheckByReport = async (
    headers: {},
    order?: OrderBy,
    asc?: 'ASC' | 'DES'
) => {
    try {
        const response = order
            ? await apiService.get(`${URL}/cheques?orderBy=${order}${asc}`, {
                  headers,
              })
            : await apiService.get(`${URL}/cheques`, { headers })
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}
export const getCheckByClient = async (headers: {}, client: string) => {
    console.log(client)
    try {
        const response = await apiService.get(
            `${URL}/cheques/cliente?cliente=${client}`,
            {
                headers,
            }
        )
        console.log(response)
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error)
        }
    }
}

export const getCuitInfo = async (cuit: string) => {
    try {
        const response = await apiService.get(`${URL}/emisor/info?cuit=${cuit}`)
        return response
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}
export const getChequesInfo = async (cuit: string) => {
    try {
        const response = await apiService.get(
            `${URL}/emisor/cheques?cuit=${cuit}`
        )
        return response.data
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}
