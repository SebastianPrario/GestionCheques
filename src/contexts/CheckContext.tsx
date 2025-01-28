import React, { createContext, useState } from 'react'
import Swal from 'sweetalert2'
import { deleteCheckApi } from '../services/apiService'
import { headerToken } from '../librery/helpers'

export interface Check {
    // Define las propiedades del cheque
    id?: number
    numero: number
    importe: number
    cliente: string
    librador: string
    fechaEmision: string
    fechaEntrega: string
    banco: string
    proveedor?: string
    estado?: string
    borrado?: boolean
    user?: string
}
export interface Order {
    // Define las propiedades del cheque
    id?: number
    destination: string
    totalAmount: string
    otherPayment: []
    creationDate: string
    delete: boolean
    user: string
}

interface CheckContextType {
    checkedSelection: Check[]
    setCheckedSelection: (data: Check[]) => void
    deleteCheck: (
        id: number,
        token: string
    ) => Promise<Check[] | void | undefined | null>
}

export const CheckContext = createContext<CheckContextType>({
    checkedSelection: [],
    deleteCheck: async () => {},
    setCheckedSelection: () => [],
})

function CheckProvider({ children }: { children: React.ReactNode }) {
    const [checkedSelection, setCheckedSelection] = useState<Check[]>([]) // crea un objeto con los elementos seleccionado

    const deleteCheck = async (id: number, token: string) => {
        const headers = headerToken(token)
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar',
        })
        if (result.isConfirmed) {
            if (URL) {
                const response = await deleteCheckApi('cheques', headers, id)

                if (response) {
                    Swal.fire('¡Eliminado!')
                    return
                }
            }
        }
    }
    const value = {
        checkedSelection,
        deleteCheck,
        setCheckedSelection,
    }
    return (
        <CheckContext.Provider value={value}>{children}</CheckContext.Provider>
    )
}

export default CheckProvider
