import React, { createContext, useState } from 'react'

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
}

export const CheckContext = createContext<CheckContextType>({
    checkedSelection: [],
    setCheckedSelection: () => [],
})

function CheckProvider({ children }: { children: React.ReactNode }) {
    const [checkedSelection, setCheckedSelection] = useState<Check[]>([]) // crea un objeto con los elementos seleccionado

    const value = {
        checkedSelection,
        setCheckedSelection,
    }
    return (
        <CheckContext.Provider value={value}>{children}</CheckContext.Provider>
    )
}

export default CheckProvider
