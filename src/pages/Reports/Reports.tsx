import { createRoot } from 'react-dom/client';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { CustomModal } from '../CustomModal/CustomModal'
import React, { useState } from 'react'
import PdfReport from './PdfReport'
import { useAuth } from '../../contexts/AuthContext'
import {
    getAllCheckByReport,
    getCheckByClient,
} from '../../services/apiService'

interface EnterCheckProps {
    show: boolean
    onClose: () => void
}
enum ReportOptions {
    ChequesEnCartera = 'Cheques en Cartera',
    ChequesPorCliente = 'Cheques por Cliente',
}

interface InputValue {
    cliente: string
    desde: string
    hasta: string
}
export const Reports: React.FC<EnterCheckProps> = ({ show, onClose }) => {
    const token = useAuth().user?.token
    const headers = { authorization: `Bearer ${token}` }
    const [inputValue, setInputValue] = useState<InputValue>(
        {
            cliente: '',
            desde: '',
            hasta: '',
        }
    )
    const [reportOptions, setReportOptions] = useState<ReportOptions | null>(null)
   

    const handleOptionClick = (event: React.MouseEvent<HTMLInputElement>) => {
        const selectedOption = (event.target as HTMLInputElement).value as ReportOptions
        setReportOptions(selectedOption)
    }

    const handleClickSelection = async () => {
        let response
     
        if (reportOptions === 'Cheques por Cliente') {
            response = await getCheckByClient(headers, inputValue)
        } else if (reportOptions === 'Cheques en Cartera') {
            response = await getAllCheckByReport(headers)
        }
        const newWindow = window.open('', '')
       
        if (newWindow && response?.data) {
            newWindow.document.write('<div id="pdf-order-root"></div>');
            newWindow.document.title = 'PDF Order';
            newWindow.document.close();

            const container = newWindow.document.getElementById('pdf-order-root');
            if (container) {
                const root = createRoot(container); // Crear un contenedor raíz
                root.render(
                    <PdfReport
                        data={response?.data}
                        reportOptions={reportOptions ? reportOptions : ''}
                        inputValue={inputValue.cliente}
                    />
                );
            }
        setReportOptions(null)
        setInputValue({
            cliente: '',
            desde: '',
            hasta: '',
        })
        onClose()
    }
    }
    const handleInputValue = (event: any) => {
        const value = event.target.value
        const name = event.target.name
        console.log(event.target.value , event.target.name)
        setInputValue({ ...inputValue, [name]: value })
    }
    console.log(inputValue)
    return (
        <CustomModal show={show} onClose={onClose}>
            <Modal.Header closeButton onHide={onClose}>
                <Row>
                    <Modal.Title className="col-12">
                        Cheques en Cartera
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
                                    <> 
                                    <Row className='d-flex mt-2'>
                                        <Col className='col-8'>
                                        <Form.Label
                                            htmlFor={`input-${type}`}
                                        >Cliente</Form.Label>
                                        <Form.Control
                                            className='col-4'
                                            type="text"
                                            name= "cliente"
                                            aria-describedby={`detailsHelpBlock-${type}`}
                                            value={inputValue.cliente}
                                            onChange={(e) =>
                                                handleInputValue(e)
                                            }
                                        />
                                        </Col>
                                    </Row>
                                    <Row className='d-flex mt-2'>
                                        <Col className='col-6'>
                                         <Form.Label
                                            htmlFor={`input-${type}`}
                                        >desde</Form.Label>
                                        <Form.Control
                                            className='col-6'
                                            type="date"
                                            name= "desde"
                                            aria-describedby={`detailsHelpBlock-${type}`}
                                            value={inputValue.desde}
                                            onChange={(e) =>
                                                handleInputValue(e)
                                            }
                                        />
                                        </Col>
                                        <Col>
                                          <Form.Label
                                            htmlFor={`input-${type}`}
                                        >hasta</Form.Label>
                                        <Form.Control className='col-6'
                                            type="date"
                                            name= "hasta"
                                            aria-describedby={`detailsHelpBlock-${type}`}
                                            value={inputValue.hasta}
                                            onChange={(e) =>
                                                handleInputValue(e)
                                            }
                                        />
                                        </Col>
                                       
                                    
                                        </Row>
                                       
                                    </>
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
