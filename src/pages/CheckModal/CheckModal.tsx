import { Modal, Table } from 'react-bootstrap'

interface CheckModalProps {
    show: boolean
    onClose: () => void
    data: any | null
}

const CheckModal = ({ show, onClose, data }: CheckModalProps) => {
    return (
        <Modal show={show} onHide={onClose} size="lg" className="modal">
            <Modal.Header closeButton>
                <Modal.Title>Cheques Encontrado</Modal.Title>
            </Modal.Header>
            {data ? (
                data.length > 0 ? (
                    <div>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Estado</th>
                                    <th>Número</th>
                                    <th>Importe</th>
                                    <th>Cliente</th>
                                    <th>Librador</th>
                                    <th>Fecha Emisión</th>
                                    <th>Fecha Entrega</th>
                                    <th>Banco</th>
                                    <th>Orden</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((elem: any) => {
                                    const formattedNumber = elem.numero
                                        .toString()
                                        .padStart(8, '0')
                                    return (
                                        <tr key={elem.numero}>
                                            <td>{elem.estado}</td>
                                            <td>{formattedNumber}</td>
                                            <td>${elem.importe}</td>
                                            <td>{elem.cliente}</td>
                                            <td>{elem.librador}</td>
                                            <td>{elem.fechaEmision}</td>
                                            <td>{elem.fechaEntrega}</td>
                                            <td>{elem.banco}</td>
                                            <td>
                                                {elem.order
                                                    ? elem.order.id
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-center fs-4 text-primary">
                        Cheque no encontrado
                    </p>
                )
            ) : (
                <></>
            )}
        </Modal>
    )
}

export default CheckModal
