import { Form, Modal, Row } from 'react-bootstrap'
import { CustomModal } from '../CustomModal/CustomModal'
import { useState } from 'react'

interface EnterCheckProps {
    show: boolean
    onClose: () => void
}
const reports = [ 'Cheques en Cartera', 'Cheques por Cliente' , 'Cheques por Fecha']
export const Reports: React.FC<EnterCheckProps> = ({ show, onClose }) => {

const [reportOptions , setreportOptions] = useState('')

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
                            id={`default-${type}`}
                            label={type}
                            
                        />
                        </div>
                    ))}
                    </Form>
                </Modal.Body>
              
           
           
        </CustomModal>
    )
}

export default Reports
