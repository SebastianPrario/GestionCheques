import { format } from 'date-fns'




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
    }).format(value)
}

export const formatDate = (date: string): string => {
    return format(new Date(date), 'dd/MM/yyyy')
}

export const formatDateByReport= (date: string): string => {
    return date.replace(/-/g, '/') // Reemplaza los guiones por barras
}