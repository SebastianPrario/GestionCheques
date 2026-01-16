import { useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { AuthContext } from '../../../contexts/AuthContext'
import {
    Cliente,
    fetchApi,
} from '../../../services/apiService'
import Swal from 'sweetalert2'
import { BsTrash } from 'react-icons/bs'
import { Col, Row } from 'react-bootstrap'

interface newOption {
    name: string
}
interface SelectProps {
    setCliente: (value: string) => void
    cliente: string
}
function SelectCliente({ setCliente, cliente }: SelectProps) {
    const authContext = useContext(AuthContext)
    const isAuthenticated = authContext && authContext.isAuthenticated
    const [options, setOptions] = useState<Cliente[]>([])
    const [show, setShow] = useState(false)
    const [newOption, setNewOption] = useState<newOption>({ name: '' })

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleAddOption = async () => {
        if (newOption.name) {
            const response = await fetchApi(
                '/cliente',
                'POST',
                newOption)

            if (response?.status === 201) {
                Swal.fire('Cliente Creado!')
                setNewOption({ name: '' })
                setOptions([])
                handleClose()
                const updatedData = await fetchApi('/cliente')
                setOptions(updatedData?.data || [])
                setCliente(newOption.name)
            } else {
                Swal.fire('Error al crear cliente')
            }
        }
    }

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        if (event.target.value === 'add-cliente') {
            handleShow()
        } else {
            setCliente(event.target.value)
        }
    }

    const handleDeleteCliente = () => {
        const selected = options.find((option) => option.name === cliente)
        if (selected) {
            const id = selected?.id
            fetchApi(
                `/cliente/${id}`,
                'DELETE'
            ).then(() => {
                Swal.fire('Cliente Eliminado')
                setCliente('')
                fetchApi('/cliente').then((data) => setOptions(data?.data || []))
            })
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchApi('/cliente').then((data) => setOptions(data?.data || []))
        }
    }, [isAuthenticated])

    return (
        <>
            <Row>
                <Col className="d-flex justify-content-start">
                    <Form.Select
                        onChange={handleSelectChange}
                        className="col-6"
                        value={cliente}
                    >
                        <option value="">Elegir Cliente</option>
                        {options.map((option, index) => (
                            <option key={index} value={option?.name}>
                                {option?.name}
                            </option>
                        ))}
                        <option value="add-cliente">Agregar Cliente</option>
                    </Form.Select>
                    <Button
                        variant="danger"
                        className=" ms-2 d-flex align-items-center justify-content-center"
                        onClick={handleDeleteCliente}
                        disabled={
                            cliente === '' ||
                            cliente === 'Elegir Cliente' ||
                            cliente === 'add-cliente'
                        }
                    >
                        <BsTrash />
                    </Button>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Nombre del Cliente"
                        value={newOption.name}
                        onChange={(e) => setNewOption({ name: e.target.value })}
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

export default SelectCliente
