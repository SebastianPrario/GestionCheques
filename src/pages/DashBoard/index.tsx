import React, { useContext, useState } from 'react'
import { Check } from '../../contexts/CheckContext'
import { AuthContext } from '../../contexts/AuthContext'
import NavBar from '../NavBar/NavBar'
import { fetchApi, OrderBy } from '../../services/apiService'
import Swal from 'sweetalert2'
import EnterCheck from '../EnterCheck/EnterCheck'
import OrderPayment from '../OrderPayment/OrderPayment'
import useGetAllChecks from '../../hooks/useGetAllCheck'
import TableView from '../../components/TableView/TableView'

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
    const handleDeleteCheck = async (id: number = 0) => {
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
        if (result.isDismissed) {
            Swal.fire('No se eliminó el cheque', '', 'info')
            return
        }
        if (result.isConfirmed) {
            const response = await fetchApi(`/cheques/${id}`, 'DELETE')
            if (response?.statusText === 'OK') {
                Swal.fire('¡Eliminado!')
                setCheckList(checkList?.filter((check) => check.id !== id))
            }
        }
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

           <TableView
            setOrder={setOrder}
            checkList={checkList}
            handleCheckboxSelection = {handleCheckboxSelection}
            handleDeleteCheck = { handleDeleteCheck}
            />
        </>
    )
}

export default DashBoard
