import React, { useContext, useEffect, useState } from 'react'
import { Check } from '../../contexts/CheckContext'
import Styled from './styles'
import { AuthContext } from '../../contexts/AuthContext'
import { Button, Form } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import NavBar from '../NavBar/NavBar'
import { deleteCheckApi, getCheckApi, OrderBy } from '../../services/apiService'
import Swal from 'sweetalert2'
import EnterCheck from '../EnterCheck/EnterCheck'
import OrderPayment from '../OrderPayment/OrderPayment'
import Spinner from '../../components/Spinner/Spinner'
import { formatCurrency } from '../../librery/helpers'
import { FaTrash } from 'react-icons/fa'

const DashBoard = () => {
    const [checkList, setCheckList] = useState<Check[] | null | undefined>(null)
    const [checkedSelection, setCheckedSelection] = useState<Check[]>([]) // crea un objeto con los elementos seleccionado
    const [orderBy, setOrderBy] = useState<{
        order: OrderBy
        asc: 'ASC' | 'DES'
    } | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [modalShow, setModalShow] = useState(false)
    const [modalOrder, setModalOrder] = useState(false)
    const authContext = useContext(AuthContext)
    const token = authContext && authContext.user?.token
    const isAuthenticated = authContext && authContext.isAuthenticated
    const header = { authorization: `bear ${token}` }
    const onClose = () => {
        setModalShow(false)
    }

    const onCloseOrder = () => {
        setModalOrder(false)
    }
    const handleCheckboxSelection = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name } = e.target
        const numberCheck = name && Number(name)
        const itemCheck = checkList?.filter((check) => check.id === numberCheck)

        if (itemCheck) {
            if (e.target.checked) {
                setCheckedSelection([...checkedSelection, itemCheck[0]])
            } else {
                setCheckedSelection(
                    checkedSelection?.filter(
                        (check) => check.id !== itemCheck[0].id
                    )
                )
            }
        }
    }
    const deleteCheck = async (id: number) => {
        console.log(id)
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar',
        })
        if (result.isConfirmed) {
            const response = await deleteCheckApi(header, id)
            if (response?.statusText === 'ok') {
                Swal.fire('¡Eliminado!')
            }
            setLoading(true)
            getAllCheck()
            setLoading(false)
        }
    }
    const handleDeleteChange = (id: number = 0): void => {
        deleteCheck(id)
    }

    const getAllCheck = async (order?: OrderBy, asc?: 'ASC' | 'DES') => {
        try {
            setLoading(true)
            const response = await getCheckApi(header || '', order, asc)
            const data: Check[] = response?.data
            setCheckList(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const setOrder = (param: OrderBy) => {
        return setOrderBy({
            order: param,
            asc: orderBy?.asc === 'ASC' ? 'DES' : 'ASC',
        })
    }
    useEffect(() => {
        if (isAuthenticated) {
            getAllCheck(orderBy?.order, orderBy?.asc)
        }
    }, [isAuthenticated, orderBy])

    return (
        <div className="">
            {loading && <Spinner />}
            <Styled.Nav>
                <NavBar
                    setModalOrder={setModalOrder}
                    setModalShow={setModalShow}
                    checkSelection={checkedSelection}
                />
                <OrderPayment
                    show={modalOrder}
                    onClose={onCloseOrder}
                    checkSelection={checkedSelection}
                    setCheckedSelection={setCheckedSelection}
                    getAllCheck={getAllCheck}
                    header={header}
                />
            </Styled.Nav>
            <EnterCheck
                show={modalShow}
                onClose={onClose}
                getAllCheck={getAllCheck}
                setCheckList={setCheckList}
                header={header}
            />
            <div>
                <Table striped bordered hover variant="dark" className="">
                    <thead className="text-center">
                        <tr>
                            <th>Sel.</th>
                            <th>
                                <Button
                                    type="button"
                                    className="btn btn-info btn-sm"
                                    onClick={() => setOrder('numero')}
                                >
                                    Número de cheque{' '}
                                </Button>
                            </th>
                            <th>
                                <Button
                                    type="button"
                                    className="btn btn-info btn-sm"
                                    onClick={() => setOrder('cliente')}
                                >
                                    Cliente
                                </Button>
                            </th>
                            <th>
                                <Button
                                    type="button"
                                    className="btn btn-info btn-sm"
                                    onClick={() => setOrder('librador')}
                                >
                                    Librador
                                </Button>
                            </th>
                            <th>
                                <Button
                                    type="button"
                                    className="btn btn-info btn-sm"
                                    onClick={() => setOrder('fechaEntrega')}
                                >
                                    Fecha de Cobro
                                </Button>
                            </th>
                            <th>
                                <Button
                                    type="button"
                                    className="btn btn-info btn-sm"
                                    onClick={() => setOrder('fechaEmision')}
                                >
                                    Fecha de Emisión
                                </Button>
                            </th>
                            <th>
                                <Button
                                    type="button"
                                    className="btn btn-info btn-sm"
                                    onClick={() => setOrder('importe')}
                                >
                                    Importe
                                </Button>
                            </th>
                            <th>
                                <Button
                                    type="button"
                                    className="btn btn-info btn-sm"
                                    onClick={() => setOrder('banco')}
                                >
                                    Banco emisor
                                </Button>
                            </th>
                            <th className="text-danger">Eliminar</th>
                        </tr>
                    </thead>
                    <div></div>
                    <tbody>
                        {checkList ? (
                            checkList.length > 0 ? (
                                checkList?.map((elem: Check) => {
                                    const formattedNumber = elem.numero
                                        .toString()
                                        .padStart(8, '0')
                                    return (
                                        <tr className="text-end" key={elem.id}>
                                            <td>
                                                <Form.Check
                                                    name={`${elem.id}`}
                                                    onChange={
                                                        handleCheckboxSelection
                                                    }
                                                />
                                            </td>
                                            <td className="text-center ps-4">
                                                {' '}
                                                {formattedNumber}{' '}
                                            </td>
                                            <td className="text-start">
                                                {' '}
                                                {elem.cliente}{' '}
                                            </td>
                                            <td className="text-start">
                                                {' '}
                                                {elem.librador}{' '}
                                            </td>
                                            <td className="text-center">
                                                {' '}
                                                {elem.fechaEntrega}{' '}
                                            </td>
                                            <td className="text-center">
                                                {' '}
                                                {elem.fechaEmision}{' '}
                                            </td>
                                            <td className="text-end fs-5">
                                                {' '}
                                                $ {formatCurrency(
                                                    elem.importe
                                                )}{' '}
                                            </td>
                                            <td className="text-start ps-4">
                                                {' '}
                                                {elem.banco}{' '}
                                            </td>
                                            <td className="d-flex -justify-content-center">
                                                <Button
                                                    onClick={() =>
                                                        handleDeleteChange(
                                                            elem.id
                                                        )
                                                    }
                                                    className=""
                                                    variant="danger"
                                                    size="sm"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <div className="text-center">
                                    {' '}
                                    no hay cheques en cartera
                                </div>
                            )
                        ) : (
                            <Spinner />
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default DashBoard
