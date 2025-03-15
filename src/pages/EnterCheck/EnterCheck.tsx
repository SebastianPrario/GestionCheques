import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import * as formik from 'formik'
import { CustomModal } from '../CustomModal/CustomModal'
import { format } from 'date-fns'
import { OrderBy, postCheckApi } from '../../services/apiService'
import SelectBank from './Bank/Bank'
import Swal from 'sweetalert2'
import schema from './validationSchema'

interface EnterCheckProps {
    show: boolean
    onClose: () => void
    header: { authorization: string }
    setOrderBy: Dispatch<
        SetStateAction<{ order: OrderBy; asc: 'ASC' | 'DES' } | null>
    >
    orderBy: { order: OrderBy; asc: 'ASC' | 'DES' } | null
}

export const EnterCheck: React.FC<EnterCheckProps> = ({
    show,
    onClose,
    header,
    setOrderBy,
    orderBy,
}) => {
    const [bank, setBank] = useState<string>('')
    const [submitAction, setSubmitAction] = useState<string>('')
    const { Formik } = formik

    return (
        <CustomModal show={show} onClose={onClose}>
            <Modal.Header closeButton onHide={onClose}>
                <Modal.Title>Ingresar Cheque</Modal.Title>
            </Modal.Header>
            <Formik
                validationSchema={schema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={async (values, { resetForm }) => {
                    console.log('entra')
                    values.fechaEmision = format(
                        values.fechaEmision,
                        'yyyy/MM/dd'
                    )
                    values.fechaEntrega = format(
                        values.fechaEntrega,
                        'yyyy/MM/dd'
                    )
                    values.banco = bank
                    try {
                        if (
                            values.banco === 'Elegir Banco' ||
                            values.banco === ''
                        ) {
                            return Swal.fire('falta elegir banco')
                        }
                        await postCheckApi('cheques', header, values)
                        resetForm()
                        setBank('')

                        setOrderBy({
                            order: orderBy?.order || 'numero',
                            asc: orderBy?.asc === 'ASC' ? 'DES' : 'ASC',
                        })

                        if (submitAction === 'close') return onClose()
                    } catch (error: unknown) {
                        console.log(error)
                    }
                }}
                initialValues={{
                    numero: 0,
                    importe: 0.0,
                    cliente: '',
                    librador: '',
                    fechaEmision: '',
                    fechaEntrega: '',
                    banco: '',
                }}
            >
                {({ handleSubmit, handleChange, values, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row className="my-2 py-3 px-2">
                            <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationFormik101"
                                className="position-relative"
                            >
                                <Form.Label>Número de Cheque</Form.Label>
                                <Form.Control
                                    type="string"
                                    name="numero"
                                    maxLength={8}
                                    value={values.numero}
                                    onChange={handleChange}
                                    isInvalid={!!errors.numero}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.numero}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationFormik102"
                                className="position-relative"
                            >
                                <Form.Label>Importe</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="importe"
                                    value={values.importe}
                                    onChange={handleChange}
                                    isInvalid={!!errors.importe}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.importe}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="my-2 py-3 px-2">
                            <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationFormikUsername2"
                            >
                                <Form.Label>Cliente</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="text"
                                        aria-describedby="inputGroupPrepend"
                                        name="cliente"
                                        value={values.cliente}
                                        onChange={handleChange}
                                        isInvalid={!!errors.cliente}
                                    />
                                    <Form.Control.Feedback
                                        type="invalid"
                                        tooltip
                                    >
                                        {errors.cliente}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Row className="my-2 py-2 px-2">
                            <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationFormik103"
                                className="position-relative"
                            >
                                <Form.Label>Emisor del Cheque</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="librador"
                                    value={values.librador}
                                    onChange={handleChange}
                                    isInvalid={!!errors.librador}
                                />

                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.librador}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                                as={Col}
                                md="3"
                                controlId="validationFormik104"
                                className="position-relative "
                            >
                                <Form.Label>Fecha Emisión</Form.Label>
                                <Form.Control
                                    type="Date"
                                    placeholder="aaaa/mm/dd"
                                    name="fechaEmision"
                                    value={values.fechaEmision}
                                    onChange={handleChange}
                                    isInvalid={!!errors.fechaEmision}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.fechaEmision}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                                as={Col}
                                md="3"
                                controlId="validationFormik105"
                                className="position-relative"
                            >
                                <Form.Label>Fecha Pago</Form.Label>
                                <Form.Control
                                    type="Date"
                                    placeholder="aaaa/mm/dd"
                                    name="fechaEntrega"
                                    value={values.fechaEntrega}
                                    onChange={handleChange}
                                    isInvalid={!!errors.fechaEntrega}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.fechaEntrega}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="position-relative py-3">
                                <Form.Label column="sm">
                                    Banco Emisor
                                </Form.Label>
                                <SelectBank setBank={setBank} bank={bank} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <div className="d-flex justify-content-center">
                                    <Button
                                        type="submit"
                                        name="add"
                                        onClick={() => setSubmitAction('add')}
                                    >
                                        Agregar
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>
        </CustomModal>
    )
}

export default EnterCheck
