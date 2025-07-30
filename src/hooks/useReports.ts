import { useState } from 'react'
import { fetchApi } from '../services/apiService'
import { formatDateByReport } from '../librery/helpers'

interface InputValue {
    cliente: string
    desde: string
    hasta: string
    text: string    
}

enum ReportOptions {
    ChequesEnCartera = 'Cheques en Cartera',
    ChequesPorCliente = 'Cheques por Cliente',
    Ai = 'Buscar con Inteligencia Artificial',
}

export const useReports = () => {
    const [inputValue, setInputValue] = useState<InputValue>({
        cliente: '',
        desde: '',
        hasta: '',
        text: '',
    })
    const [reportOptions, setReportOptions] = useState<ReportOptions | null>(null)

    const handleInputValue = (event: any) => {
        const { value, name } = event.target
        setInputValue({ ...inputValue, [name]: value })
    }

    const handleOptionClick = (event: React.MouseEvent<HTMLInputElement>) => {
        const selectedOption = (event.target as HTMLInputElement).value as ReportOptions
        setReportOptions(selectedOption)
    }

    const fetchReportData = async () => {
        const dataStart = formatDateByReport(inputValue.desde)
        const dataEnd = formatDateByReport(inputValue.hasta)
        
        const reportStrategies = {
            [ReportOptions.ChequesPorCliente]: async () => 
                await fetchApi(`/cheques/cliente?cliente=${inputValue.cliente}&desde=${dataStart}&hasta=${dataEnd}`, 'GET'),
            [ReportOptions.ChequesEnCartera]: async () => 
                await fetchApi('/cheques?orderBy=fechaEntrega'),
            [ReportOptions.Ai]: async () => {
                const response = await fetchApi('/search', 'POST', { prompt: inputValue.text })
                if (response) {
                    response.data = response.data.result
                }
                return response
            }
        }

        if (reportOptions && reportOptions in reportStrategies) {
            return await reportStrategies[reportOptions]()
        }
        return null
    }

    const resetForm = () => {
        setInputValue({
            cliente: '',
            desde: '',
            hasta: '',
            text: ''
        })
        setReportOptions(null)
    }

    return {
        inputValue,
        reportOptions,
        handleInputValue,
        handleOptionClick,
        fetchReportData,
        resetForm,
        ReportOptions
    }
}
