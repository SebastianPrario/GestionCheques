import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Container, Nav } from 'react-bootstrap'
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check } from '../../contexts/CheckContext'
import { getCheckByNumber } from '../../services/apiService'
import CheckModal from '../CheckModal/CheckModal'
import { Order } from '../../contexts/CheckContext'
import Reports from '../Reports/Reports'
import { FaSignOutAlt, FaArrowLeft,  FaSearch, FaFileAlt, FaPlus, FaClipboardList } from 'react-icons/fa';
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
    const token = useAuth().user?.token
    const { signOutUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const signOut = () => {
        signOutUser()
        navigate('/')
    }
    const [searchValue, setSearchValue] = useState('')
    const [modalCheck, setModalCheck] = useState(false)
    const [modalReports, setModalReports] = useState(false)
    const [dataCheck, setDataCheck] = useState<CheckData | null>(null)

    const onCloseReports = () => {
        setModalReports(false)
    }
    const onCloseCheck = () => {
        setModalCheck(false)
    }
    async function handleClickSearch(): Promise<any> {
        try {
            const foundCheck = await getCheckByNumber(
                Number(searchValue),
                token
                    ? { authorization: `bear ${token}` }
                    : { authorization: '' }
            )
            const data = foundCheck?.data
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
        <Navbar  bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/dashboard">Cheques 2.0</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-5">
                        <Nav.Link className="me-3" onClick={signOut}>
                            <FaSignOutAlt /> Salir
                        </Nav.Link>
                        {location.pathname === '/orders' && (
                            <Nav.Link className="me-3" onClick={() => navigate('/dashboard')}>
                                <FaArrowLeft /> Volver
                            </Nav.Link>
                        )}
                        </Nav>
                
                   
                    <Nav className="ms-auto d-lg-flex">
                        <Nav.Link onClick={() => setModalReports && setModalReports(true)}>
                            <FaFileAlt /> Informes
                        </Nav.Link>
                       
                        <Nav.Link
                            onClick={() => setModalOrder && setModalOrder(true)}
                            disabled={checkSelection && checkSelection.length < 1}
                        >
                            <FaClipboardList /> Asignar Cheques
                        </Nav.Link>
                        <Nav.Link onClick={() => setModalShow && setModalShow(true)}>
                            <FaPlus /> Agregar Cheques
                        </Nav.Link>
                            <CheckModal
                                show={modalCheck}
                                onClose={onCloseCheck}
                                data={dataCheck}
                            />
                             <Reports
                                show={modalReports}
                                onClose={onCloseReports}
                            />
                        <Nav.Link
                               
                                onClick={() => navigate('/orders')}
                        >
                                  <FaFileAlt /> Ordenes
                            </Nav.Link>
                            </Nav>
                           
                </Navbar.Collapse>
                <Form className="d-flex ms-3">
                        <Form.Control
                            type="text"
                            maxLength={8}
                            placeholder="N° Cheque"
                            className="ps-4 me-3  col-6"
                            value={searchValue}
                            onChange={handleInputChange}
                        />
                        <Button variant="outline-success" onClick={handleClickSearch}>
                            <FaSearch />
                        </Button>
                    </Form>
              
           
             </Container>
        </Navbar> 
       
    )
}

export default NavBar
