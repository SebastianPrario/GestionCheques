import { Order } from '../../contexts/CheckContext'
import Table from 'react-bootstrap/Table'
import NavBar from '../NavBar/NavBar'
import { Button } from 'react-bootstrap'
import {  fetchApi } from '../../services/apiService'
import PdfOrder from './Pdfview/PdfDown'
import ReactDOM from 'react-dom'
import Spinner from '../../components/Spinner/Spinner'
import Swal from 'sweetalert2'
import { FaTrash, FaEye } from 'react-icons/fa'
import useFetch from '../../hooks/useFetch'
const OrdersView = () => {
  
   
   

    const { 
        data: orders,
        loading,
        refetch,
    } = useFetch<Order[]>(
        'order/allorders',
        'GET',
        undefined,
        undefined   
    )


    const handleDownloadClick = (id: number) => {
        const newWindow = window.open('', '')
        if (newWindow) {
            newWindow.document.write('<div id="pdf-order-root"></div>')
            newWindow.document.title = 'PDF Order'
            newWindow.document.close()
            ReactDOM.render(
                <PdfOrder id={id} />,
                newWindow.document.getElementById('pdf-order-root')
            )
        }
    }

    const handleDelete = async (id: number) => {
        try {
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
                
                
                await fetchApi(
                    `order/${id}`,
                    'DELETE'
                )
                Swal.fire(
                 'Orden Eliminada')
                refetch()
                
            }
        } catch (error) {
            console.log(error)
        }
    }


    const totalAmount = (total: any, otherPayment: any) => {
        let totalAmount = 0
        totalAmount =
            Number(total) +
            otherPayment.reduce(
                (acum: number, elem: any) => acum + elem.number,
                0
            )
        return `$ ${totalAmount}`
    }

    return (
        <>
            <NavBar />

            {loading && <Spinner />}
            <div>
                <Table striped bordered hover variant="dark" responsive="sm">
                    <thead className="text-center">
                        <tr>
                            <th>Número</th>
                            <th>Destino</th>
                            <th>Importe</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <div></div>
                    <tbody>
                        {orders && orders.length > 0 ? (
                            orders?.map((order: Order) => {
                                return (
                                    <tr className="text-end" key={order.id}>
                                        <td className="text-center col-2">
                                            {' '}
                                            {order.id}{' '}
                                        </td>
                                        <td> {order.destination} </td>
                                        <td>
                                            {' '}
                                            {totalAmount(
                                                order.totalAmount,
                                                order.otherPayment
                                            )}{' '}
                                        </td>
                                        <td> {order.creationDate} </td>
                                        <td className="d- justify-content-between">
                                            <div>
                                                <Button
                                                    className="me-2"
                                                    variant="primary"
                                                    onClick={() =>
                                                        order.id &&
                                                        handleDelete(order.id)
                                                    }
                                                >
                                                    <FaTrash />
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                        order.id &&
                                                        handleDownloadClick(
                                                            order.id
                                                        )
                                                    }
                                                >
                                                    <FaEye />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <>No hay ordenes para mostrar</>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default OrdersView
