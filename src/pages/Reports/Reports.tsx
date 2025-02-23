import { Button, Form, Modal, Row } from 'react-bootstrap'
import { CustomModal } from '../CustomModal/CustomModal'
import React, {   useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import PdfReport from './PdfReport'
import { Check } from '../../contexts/CheckContext'
import { useAuth } from '../../contexts/AuthContext'
import { getAllCheckByReport, getCheckByClient } from '../../services/apiService'


interface EnterCheckProps {
    show: boolean
    onClose: () => void
}
const reports = [ 'Cheques en Cartera', 'Cheques por Cliente']
export const Reports: React.FC<EnterCheckProps> = ({ show, onClose }) => {

    const token = useAuth().user?.token 
    const [data, setData] = useState<Check[]>([])
    const [inputValue, setInputValue] = useState <string>('')
    const [reportOptions, setReportOptions] = useState<string | null>(null)
    const headers = { authorization: `Bearer ${token}` }

    const handleOptionChange = async (event: any) => {
       

        if(event.target.value === 'Cheques en Cartera'){
            setReportOptions(event.target.value)
            try {
                const response = await getAllCheckByReport(headers)
                data  && setData(response?.data)
              
            }catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        if(event.target.value === 'Cheques por Cliente'){
            setReportOptions(event.target.value)  
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCheckByClient(headers, inputValue)
                setData(response?.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [inputValue])
   
    const handleClickSelection =  async () => {
        const newWindow = window.open('', '')
        if (newWindow && data) {
            newWindow.document.write('<div id="pdf-order-root"></div>')
            newWindow.document.title = 'PDF Order'
            newWindow.document.close()
            ReactDOM.render(
                <PdfReport 
                data={data}
                reportOptions = {reportOptions ? reportOptions : ''}
                    />,
                newWindow.document.getElementById('pdf-order-root')
            )
        } 
        setReportOptions(null)
        setInputValue('')
      
      
        onClose()         
    }
    const handleInputValue = (event: any) => {
      
        setInputValue(event.target.value)
    }
    return (
        <CustomModal show={show} onClose={onClose}>
            <Modal.Header closeButton onHide={onClose}>
                 <Row>
                    <Modal.Title className='col-12'>Cheques en Cartera</Modal.Title>
                 </Row>
            </Modal.Header>
                <Modal.Body>
                    <Form>
                    {reports.map((type) => (
                        <div key={`default-${type}`} className="mb-3">
                        <Form.Check
                            type='radio'
                            id={`default-${type}`}
                            label={type}
                            name="reportOptions"
                            value={type}
                            onClick={handleOptionChange}
                            
                        />
                    {reportOptions === type && reportOptions !=='Cheques en Cartera' && (
                                <>
                                    <Form.Label htmlFor={`input-${type}`}></Form.Label>
                                    <Form.Control
                                        type="text"
                                        id={`input-${type}`}
                                        aria-describedby={`detailsHelpBlock-${type}`}
                                        value={inputValue}
                                        onChange={(e) => handleInputValue(e)}
                                    />
                                    <Form.Text id={`detailsHelpBlock-${type}`} muted>
                                        Ingrese los detalles para {type}.
                                    </Form.Text>
                                </>
                            )}
    
                        
                      
                        </div>
                    ))}
                     <Button
                    
                    disabled={!reportOptions}
                    onClick={handleClickSelection}
                    > Listar</Button>
                    </Form>
                   
                </Modal.Body>
              
           
           
        </CustomModal>
    )
}

export default Reports
