import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container, Nav } from 'react-bootstrap'
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check } from '../../contexts/CheckContext'
import { getCheckByNumber } from '../../services/apiService'
import CheckModal from '../CheckModal/CheckModal'
import { Order } from '../../contexts/CheckContext'

interface NavBarProps {
    checkSelection?: Check[] | []
    setModalShow?: React.Dispatch<React.SetStateAction<boolean>>
    setModalOrder?: React.Dispatch<React.SetStateAction<boolean>>
}

export interface CheckData {
    id: number
    numero: number
    importe: number
    cliente: string
    librador: string
    fechaEmision: string
    fechaEntrega: string
    banco: string
    proveedor?: string
    estado?: string
    borrado?: boolean
    user?: string
    order?: Order | null | string
}

const NavBar: React.FC<NavBarProps> = ({
    setModalShow = undefined,
    setModalOrder,
    checkSelection,
}) => {
    const token = localStorage.getItem('token')
    const { signOutUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const signOut = () => {
        signOutUser()
        navigate('/')
    }
    const [searchValue, setSearchValue] = useState('')
    const [modalCheck, setModalCheck] = useState(false)
    const [dataCheck, setDataCheck] = useState<CheckData | null>(null)
    const onCloseCheck = () => {
        setModalCheck(false)
    }
    async function handleClickSearch(): Promise<any> {
        try {
            console.log(searchValue)
            const foundCheck = await getCheckByNumber(
                Number(searchValue),
                token
                    ? { authorization: `bear ${token}` }
                    : { authorization: '' }
            )
            const data = foundCheck?.data
            console.log(data)
            if (data == 'Cheque no encontrado') {
                window.alert('cheque no encontrado')
            } else {
                setDataCheck(data)
                setModalCheck(true)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
    }

    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Cheques 2.0</Navbar.Brand>
                <Nav className="ms-4">
                    <Button className="me-2" onClick={signOut}>
                        Salir
                    </Button>
                    {location.pathname === '/orders' && (
                        <Button onClick={() => navigate('/dashboard')}>
                            Volver
                        </Button>
                    )}
                </Nav>
            </Container>
            {location.pathname !== '/orders' && (
                <Container>
                    <Row>
                        <Col xs="auto">
                            <Button
                                variant="primary"
                                onClick={() => setModalOrder && setModalOrder(true)}
                                disabled={checkSelection && checkSelection.length < 1}
                            >
                                Asignar Cheques
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <Button
                                variant="primary"
                                onClick={() =>  setModalShow && setModalShow(true)}
                            >
                                Agregar Cheques
                            </Button>
                            <CheckModal
                                show={modalCheck}
                                onClose={onCloseCheck}
                                data={dataCheck}
                            />
                        </Col>
                        <Col>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/orders')}
                            >
                                Ordenes
                            </Button>
                        </Col>
                    </Row>
                    <Form className="col-4">
                        <Row className="me-5 pe-1 d-flex justify-content-end">
                            <Col className="d-flex  pe-4">
                                <input
                                    type="number"
                                    name="searchbutton"
                                    className="form-control col-12"
                                    placeholder="N° Cheque"
                                    value={searchValue}
                                    onChange={handleInputChange}
                                />
                                <Button onClick={handleClickSearch}>
                                    Buscar
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            )}
        </Navbar>
    )
}

export default NavBar
