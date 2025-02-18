import { useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { AuthContext } from '../../../contexts/AuthContext'
import { createBank, getBankData } from '../../../services/apiService'
import Swal from 'sweetalert2'

interface newOption {
    bank: string
}
interface SelectProps {
    setBank: React.Dispatch<React.SetStateAction<string>>
}
function SelectBank({ setBank }: SelectProps) {
    const authContext = useContext(AuthContext)
    const token = authContext && authContext.user?.token
    const isAuthenticated = authContext && authContext.isAuthenticated
    const header = { authorization: `bear ${token}` }
    const [options, setOptions] = useState<newOption[]>([])
    const [show, setShow] = useState(false)
    const [newOption, setNewOption] = useState<newOption>({ bank: '' })

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleAddOption = async () => {
        if (newOption) {
            const response = await createBank(header, newOption)
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
            getBankData(header).then((data) => setOptions(data?.data))
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

    useEffect(() => {
        if (isAuthenticated) {
            getBankData(header).then((data) => setOptions(data?.data))
        }
    }, [])
    console.log(options)
    return (
        <>
            <Form.Select onChange={handleSelectChange}>
                <option>Elegir Banco</option>
                {options.map((option, index) => (
                    <option key={index} value={option?.bank}>
                        {option?.bank}
                    </option>
                ))}
                <option value="add-bank">Agregar Banco</option>
            </Form.Select>

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
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleAddOption}>
                        Agregar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SelectBank
