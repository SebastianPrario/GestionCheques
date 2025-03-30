import { FaSort, FaTrash } from 'react-icons/fa'
import { Button, Form ,Table } from 'react-bootstrap'
import { Check } from '../../contexts/CheckContext'
import { formatCurrency , formatDate } from '../../librery/helpers'
import Spinner from '../../components/Spinner/Spinner'

interface TableViewProps {
    setOrder: (param: any) => void;
    checkList: Check[] | undefined | null;
    handleCheckboxSelection: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeleteCheck: (id: number | undefined) => void;
}

const TableView: React.FC<TableViewProps> = ({ setOrder, checkList, handleCheckboxSelection, handleDeleteCheck }) => {
 
  return (
    <Table striped bordered hover variant="dark" responsive>
                <thead className="text-center">
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
                                            {formatCurrency(elem.importe)}{' '}
                                        </td>
                                        <td className="text-start ps-4">
                                            {' '}
                                            {elem.banco}{' '}
                                        </td>
                                        <td className="d-flex -justify-content-center">
                                            <Button
                                                onClick={() =>
                                                    handleDeleteCheck(elem.id)
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
  )
}

export default TableView;