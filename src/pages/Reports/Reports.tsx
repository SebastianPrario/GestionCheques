import { createRoot } from 'react-dom/client'
import { Button, Form, Modal } from 'react-bootstrap'
import { CustomModal } from '../CustomModal/CustomModal'
import React from 'react'
import PdfReport from './PdfReport'
import ReportByClient from '../../components/ReportByClient/ReportByClient'
import ReportByAi from '../../components/ReportByAi/ReportByAi'
import { useReports } from '../../hooks/useReports'
import { GiArtificialIntelligence } from 'react-icons/gi'
import { BsFileEarmarkCheck } from 'react-icons/bs'

interface ReportsProps {
    show: boolean
    onClose: () => void
}

export const Reports: React.FC<ReportsProps> = ({ show, onClose }) => {
    const {
        inputValue,
        reportOptions,
        handleInputValue,
        handleOptionClick,
        fetchReportData,
        resetForm,
        ReportOptions
    } = useReports()

    const handleClickSelection = async () => {
        const response = await fetchReportData()
        
        if (!response?.data || response.data.length === 0) {
            alert('No hay datos para mostrar')
            return
        }

        if (response.data.error) {
            alert(response.data.error)
            return
        }

        const newWindow = window.open('', '')
        if (newWindow && response.data) {
            newWindow.document.write('<div id="pdf-order-root"></div>')
            newWindow.document.title = 'PDF Order'
            newWindow.document.close()

            const container = newWindow.document.getElementById('pdf-order-root')
            if (container) {
                createRoot(container).render(
                    <PdfReport
                        data={response.data}
                        reportOptions={reportOptions || ''}
                        inputValue={inputValue.cliente}
                    />
                )
            }
            resetForm()
            onClose()
            
        }
    }

    return (
        <CustomModal show={show} onClose={onClose}>
            <Modal.Header closeButton onHide={onClose}>
                <Modal.Title>Informes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    {Object.values(ReportOptions).map((type) => (
                        <div key={`default-${type}`} className="mb-3">
                            <Form.Check 
                                type="radio"
                                id={`default-${type}`}
                                label={
                                    <span className="d-flex align-items-center">
                                        {type === ReportOptions.Ai && 
                                            <GiArtificialIntelligence className="me-2" />}
                                        {type === ReportOptions.ChequesPorCliente && 
                                            <BsFileEarmarkCheck className="me-2" />}
                                        {type}
                                    </span>
                                }
                                name="reportOptions"
                                value={type}
                                onClick={handleOptionClick}
                            />
                            {reportOptions === type && type === ReportOptions.ChequesPorCliente && (
                                <ReportByClient
                                    inputValue={inputValue}
                                    handleInputValue={handleInputValue}
                                    type={type}
                                />
                            )}
                            {reportOptions === type && type === ReportOptions.Ai && (
                                <ReportByAi
                                    inputValue={inputValue}
                                    handleInputValue={handleInputValue}
                                    type={type}
                                />
                            )}
                        </div>
                    ))}
                    <Button
                        disabled={!reportOptions}
                        onClick={handleClickSelection}
                    >
                        Listar
                    </Button>
                </div>
            </Modal.Body>
        </CustomModal>
    )
}

export default Reports
