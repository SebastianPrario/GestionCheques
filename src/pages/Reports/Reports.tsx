import { Modal } from 'react-bootstrap'
import { CustomModal } from '../CustomModal/CustomModal'

interface EnterCheckProps {
    show: boolean
    onClose: () => void
}

export const Reports: React.FC<EnterCheckProps> = ({ show, onClose }) => {
    return (
        <CustomModal show={show} onClose={onClose}>
            <Modal.Header closeButton onHide={onClose}>
                <Modal.Title>Informes</Modal.Title>
            </Modal.Header>
            <Modal.Body>Cheques en Cartera</Modal.Body>
        </CustomModal>
    )
}

export default Reports
