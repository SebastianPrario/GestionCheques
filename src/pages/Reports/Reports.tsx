import { createRoot } from 'react-dom/client'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { CustomModal } from '../CustomModal/CustomModal'
import React, { useState } from 'react'
import PdfReport from './PdfReport'
import {
    fetchApi,
} from '../../services/apiService'
import { formatDateByReport } from '../../librery/helpers'
import ReportByClient from '../../components/ReportByClient/ReportByClient'
import ReportByAi from '../../components/ReportByAi/ReportByAi'
import { set } from 'date-fns'

interface EnterCheckProps {
    show: boolean
    onClose: () => void
}
enum ReportOptions {
    ChequesEnCartera = 'Cheques en Cartera',
    ChequesPorCliente = 'Cheques por Cliente',
    Ai = 'Buscar con Inteligencia Artificial',
}

interface InputValue {
    cliente: string
    desde: string
    hasta: string
    text: string    
}
export const Reports: React.FC<EnterCheckProps> = ({ show, onClose }) => {
    const [inputValue, setInputValue] = useState<InputValue>({
        cliente: '',
        desde: '',
        hasta: '',
        text: '',
    })
    const [reportOptions, setReportOptions] = useState<ReportOptions | null>(
        null
    )
   

    const handleOptionClick = (event: React.MouseEvent<HTMLInputElement>) => {
        const selectedOption = (event.target as HTMLInputElement)
            .value as ReportOptions
        setReportOptions(selectedOption)
    }

    const handleClickSelection = async () => {
       
        const dataStart =  formatDateByReport(inputValue.desde)
        const dataEnd = formatDateByReport(inputValue.hasta)
        let response = null
        switch (reportOptions) {
            
            case ReportOptions.ChequesPorCliente:
                response = await fetchApi(
                    `/cheques/cliente?cliente=${inputValue.cliente}&desde=${dataStart}&hasta=${dataEnd}`,
                    'GET'
                )
               
                break
            
            case ReportOptions.ChequesEnCartera:
                response = await fetchApi(
                    `/cheques?orderBy=fechaEntrega`
                )
            
                break
            
            case ReportOptions.Ai:
                response = await fetchApi(
                    '/search', 
                    'POST', 
                    { prompt: inputValue.text }
                )
                if (response) {
                    response.data = response.data.result
                } 
              
                break
            
            default:
                console.log('Opción no válida')
                return
        }

        const newWindow = window.open('', '')
        
        if (newWindow && response?.data) {
            newWindow.document.write('<div id="pdf-order-root"></div>')
            newWindow.document.title = 'PDF Order'
            newWindow.document.close()

            const container =
                newWindow.document.getElementById('pdf-order-root')
            if (container && response?.data) {
                const root = createRoot(container) // Crear un contenedor raíz
                root.render(
                    <PdfReport
                        data={response?.data}
                        reportOptions={reportOptions ? reportOptions : ''}
                        inputValue={inputValue.cliente}
                    />
                )
            }
            setReportOptions(null)
            setInputValue({
                cliente: '',
                desde: '',
                hasta: '',
                text: ''
            })
         
            onClose()
        }
    }
   
    const handleInputValue = (event: any) => {
        const value = event.target.value
        const name = event.target.name
        console.log(event.target.value, event.target.name)
        setInputValue({ ...inputValue, [name]: value })
    }
    return (
        <CustomModal show={show} onClose={onClose}>
            <Modal.Header closeButton onHide={onClose}>
                <Row>
                    <Modal.Title className="col-12">
                        Informes
                    </Modal.Title>
                </Row>
            </Modal.Header>
            <Modal.Body>
                <div>
                    {Object.values(ReportOptions).map((type) => (
                        <div key={`default-${type}`} className="mb-3">
                            <Form.Check
                                type="radio"
                                id={`default-${type}`}
                                label={type}
                                name="reportOptions"
                                value={type}
                                onClick={handleOptionClick}
                            />
                            {reportOptions === type &&
                                reportOptions === 'Cheques por Cliente' && (
                                   <ReportByClient
                                        inputValue={inputValue}
                                        handleInputValue={handleInputValue}
                                        type ={type}
                                    />
                                )}
                            {reportOptions === type &&
                                reportOptions === 'Buscar con Inteligencia Artificial' && (
                                   <ReportByAi
                                        inputValue={inputValue}
                                        handleInputValue={handleInputValue}
                                        type ={type}
                                    />
                                )}
                        </div>
                    ))}
                    <Button
                        disabled={!reportOptions}
                        onClick={handleClickSelection}
                    >
                        {' '}
                        Listar
                    </Button>
                </div>
            </Modal.Body>
        </CustomModal>
    )
}

export default Reports
