import {  useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Check } from '../../contexts/CheckContext'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import * as formik from 'formik'
import * as yup from 'yup'
import { CustomModal } from '../CustomModal/CustomModal'
import { differenceInDays, format, isAfter, isEqual } from 'date-fns'
import { postCheckApi } from '../../services/apiService'

interface EnterCheckProps {
    show: boolean
    onClose: () => void
    getAllCheck: () => void
    setCheckList: React.Dispatch<
        React.SetStateAction<Check[] | null | undefined>
    >
    header: { authorization: string }
}

export const EnterCheck: React.FC<EnterCheckProps> = ({
    show,
    onClose,
    getAllCheck,
    header,
}) => {
    const { Formik } = formik
    const schema = yup.object().shape({
        numero: yup
            .string()
            .matches(
                /^\d{8}$/,
                'El número debe tener exactamente 8 dígitos numéricos'
            )
            .required('El número es obligatorio'),
        importe: yup
            .number()
            .positive('El importe debe ser un valor positivo')
            .required('El importe es obligatorio'),
        cliente: yup.string().required('El nombre del cliente es requerido'),
        librador: yup.string().required('Nombre del Emisor requerido'),
        fechaEmision: yup
            .date()
            .default(() => new Date())
            .test(
                'is-valid-format',
                'El formato debe ser aaaa/mm/dd',
                function (value) {
                    const formattedDate = format(value, 'yyyy/MM/dd')
                    return /^\d{4}\/\d{2}\/\d{2}$/.test(formattedDate)
                }
            )
            .required('La fecha es obligatoria'),
        fechaEntrega: yup
            .date()
            .default(() => new Date())
            .test(
                'is-before',
                'La fecha de pago debe ser posterior o igual a la fecha de emisión',
                function (value) {
                    const { fechaEmision } = this.parent
                    return (
                        isEqual(value, fechaEmision) ||
                        isAfter(value, fechaEmision)
                    )
                }
            )
            .test(
                'max-difference',
                'La diferencia entre la fecha de emisión y la fecha de pago no puede ser mayor a 360 días',
                function (value) {
                    const { fechaEmision } = this.parent
                    return differenceInDays(value, fechaEmision) <= 360
                }
            )
            .test(
                'is-valid-format',
                'El formato debe ser aaaa/mm/dd',
                function (value) {
                    const formattedDate = format(value, 'yyyy/MM/dd')
                    return /^\d{4}\/\d{2}\/\d{2}$/.test(formattedDate)
                }
            )
            .required('La fecha es obligatoria'),

        banco: yup.string().required('banco es requerido'),
    })
    const [buttonName, setButtonName] = useState('');
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setButtonName(event.currentTarget.name);
      };
    
    return (
        <CustomModal show={show} onClose={onClose}>
            <Modal.Header closeButton onHide={onClose}>
                <Modal.Title>Ingresar Cheque</Modal.Title>
            </Modal.Header>
            <Formik
                validationSchema={schema}
                onSubmit={async (values, { resetForm }) => {
                    values.fechaEmision = format(
                        values.fechaEmision,
                        'yyyy/MM/dd'
                    )
                    values.fechaEntrega = format(
                        values.fechaEntrega,
                        'yyyy/MM/dd'
                    )
                    try {
                        await postCheckApi('cheques', header, values)
                        resetForm()
                        getAllCheck()
                    } catch (error: unknown) {
                        console.log(error)
                    } finally {
                        if (buttonName === 'close'){
                            onClose()
                        }
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
                        <Row className="mb-3">
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
                            <Form.Group
                                as={Col}
                                md="4"
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
                        <Row className="mb-3">
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
                                className="position-relative"
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
                        <Form.Group className="position-relative mb-3">
                            <Form.Label>Banco Emisor</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                name="banco"
                                value={values.banco}
                                onChange={handleChange}
                                isInvalid={!!errors.banco}
                            />
                            <Form.Control.Feedback type="invalid" tooltip>
                                {errors.banco}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <div className="d-flex justify-content-center">
                                    <Button
                                        className="col-12 me-2"
                                        type="submit"
                                    >
                                        Agregar
                                    </Button>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <Button
                                        className="col-12 ms-2"
                                        type="submit"
                                        name="close"
                                        onClick={handleButtonClick}
                                    >
                                        Agregar y cerrar
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
