import { useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { AuthContext } from '../../../contexts/AuthContext'
import {
    Bank,
    fetchApi,
} from '../../../services/apiService'
import Swal from 'sweetalert2'
import { BsTrash } from 'react-icons/bs'
import { Col, Row } from 'react-bootstrap'

interface newOption {
    bank: string
}
interface SelectProps {
    setBank: React.Dispatch<React.SetStateAction<string>>
    bank: string
}
function SelectBank({ setBank, bank }: SelectProps) {
    const authContext = useContext(AuthContext)
    const isAuthenticated = authContext && authContext.isAuthenticated
    const [options, setOptions] = useState<Bank[]>([])
    const [show, setShow] = useState(false)
    const [newOption, setNewOption] = useState<newOption>({ bank: '' })

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleAddOption = async () => {
        if (newOption) {
            const response = await fetchApi(
                '/bank',
                'POST',
                newOption)
            if (response?.data === 'BANCO YA EXISTE') {
                Swal.fire('El banco ya existe!')
                setNewOption({ bank: '' })
                setBank('')
                return handleClose()
            }
            setNewOption({ bank: '' })
            setOptions([])
            Swal.fire('Banco Creado!')
            handleClose()
            fetchApi('/bank').then((data) => setOptions(data?.data))
        }
    }

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        if (event.target.value === 'add-bank') {
            handleShow()
        }
        setBank(event.target.value)
    }

    const handleDeleteBank = () => {
        const seletedBank = options.find((option) => option.bank === bank)
        if (seletedBank) {
            const id = seletedBank?.id
            fetchApi(
                `/bank/${id}`,
                'DELETE'
            ).then(() => {
                Swal.fire('Banco Eliminado')
                fetchApi('/bank').then((data) => setOptions(data?.data))
            })
        }
    }
    useEffect(() => {
        if (isAuthenticated) {
            fetchApi('/bank').then((data) => setOptions(data?.data))
        }
    }, [])

    return (
        <>
            <Row>
                <Col className="d-flex justify-content-start">
                    <Form.Select
                        onChange={handleSelectChange}
                        className="col-6"
                    >
                        <option>Elegir Banco</option>
                        {options.map((option, index) => (
                            <option key={index} value={option?.bank}>
                                {option?.bank}
                            </option>
                        ))}
                        <option value="add-bank">Agregar Banco</option>
                    </Form.Select>
                    <Button
                        variant="danger"
                        className=" ms-2 d-flex align-items-center justify-content-center"
                        onClick={handleDeleteBank}
                        disabled={
                            bank === '' ||
                            bank === 'Elegir Banco' ||
                            bank === 'add-bank'
                        }
                    >
                        <BsTrash />
                    </Button>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Banco</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Banco"
                        value={newOption.bank}
                        onChange={(e) => setNewOption({ bank: e.target.value })}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Cerrar</Button>
                    <Button variant="primary" onClick={handleAddOption}>
                        Agregar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SelectBank
