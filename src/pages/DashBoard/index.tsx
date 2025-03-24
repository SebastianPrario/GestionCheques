import React, { useContext, useState } from 'react'
import { Check } from '../../contexts/CheckContext'
import { AuthContext } from '../../contexts/AuthContext'
import { Button, Form } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import NavBar from '../NavBar/NavBar'
import { deleteCheckApi, OrderBy } from '../../services/apiService'
import Swal from 'sweetalert2'
import EnterCheck from '../EnterCheck/EnterCheck'
import OrderPayment from '../OrderPayment/OrderPayment'
import Spinner from '../../components/Spinner/Spinner'
import { formatCurrency, formatDate } from '../../librery/helpers'
import { FaTrash, FaSort } from 'react-icons/fa'
import useGetAllChecks from '../../hooks/useGetAllCheck'

const DashBoard = () => {
    const { checkList, setOrderBy, orderBy, setCheckList } = useGetAllChecks()
    const [checkedSelection, setCheckedSelection] = useState<Check[]>([]) // crea un objeto con los elementos seleccionado
    const [modalShow, setModalShow] = useState(false)
    const [modalOrder, setModalOrder] = useState(false)
    const authContext = useContext(AuthContext)
    const token = authContext && authContext.user?.token
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
        }
        setCheckList(checkList?.filter((check) => check.id !== id))
    }
    const handleDeleteChange = (id: number = 0): void => {
        deleteCheck(id)
    }

    const setOrder = (param: OrderBy) => {
        setOrderBy({
            order: param,
            asc: orderBy?.asc === 'ASC' ? 'DES' : 'ASC',
        })
    }

    return (
        <>
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
                setOrderBy={setOrderBy}
                orderBy={orderBy}
                header={header}
            />
            <EnterCheck
                show={modalShow}
                onClose={onClose}
                setOrderBy={setOrderBy}
                orderBy={orderBy}
                header={header}
            />

            <Table striped bordered hover variant="dark" responsive>
                <thead  className="text-center" >
                    <tr>
                        <th>Sel.</th>
                        <th
                            onClick={() => setOrder('numero')}
                            className="sortable"
                        >
                            Número <FaSort />
                        </th>
                        <th
                            onClick={() => setOrder('cliente')}
                            className="sortable"
                        >
                            Cliente <FaSort />
                        </th>
                        <th
                            onClick={() => setOrder('librador')}
                            className="sortable"
                        >
                            Librador <FaSort />
                        </th>
                        <th
                            onClick={() => setOrder('fechaEntrega')}
                            className="sortable"
                        >
                            Pago <FaSort />
                        </th>
                        <th
                            onClick={() => setOrder('fechaEmision')}
                            className="sortable"
                        >
                            Emisión <FaSort />
                        </th>
                        <th
                            onClick={() => setOrder('importe')}
                            className="sortable"
                        >
                            Importe <FaSort />
                        </th>
                        <th
                            onClick={() => setOrder('banco')}
                            className="sortable"
                        >
                            Banco emisor <FaSort />
                        </th>
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
                                                type="checkbox"
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
                                            {formatDate(elem.fechaEntrega)}{' '}
                                        </td>
                                        <td className="text-center">
                                            {' '}
                                            {formatDate(elem.fechaEmision)}{' '}
                                        </td>
                                        <td className="text-end fs-6">
                                            {' '}
                                            {formatCurrency(
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
                                                    handleDeleteChange(elem.id)
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
        </>
    )
}

export default DashBoard
