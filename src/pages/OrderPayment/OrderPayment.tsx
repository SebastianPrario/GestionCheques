import { useState } from 'react'
import { Button, Container, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import * as formik from 'formik'
import * as yup from 'yup'
import { CustomModal } from '../CustomModal/CustomModal'
import { createOrderApi } from '../../services/apiService'
import { Check } from '../../contexts/CheckContext'

interface EnterCheckProps {
    show: boolean
    onClose: () => void
    checkSelection: Check[]
    setCheckedSelection: React.Dispatch<React.SetStateAction<Check[] | []>>
    header: { authorization: string }
    getAllCheck: () => void
}
interface UpdatedState {
    property: string
    number: number
}
interface Values {
    destination: string
    totalAmount: number
    detail: string
    creationDate: string
    chequesId: number[]
    otherPayment: UpdatedState[]
    [key: string]: any // Para otros campos que puedan existir en values
}

export const formatoMoneda = (value: number) => {
    return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
}

export const OrderPayment: React.FC<EnterCheckProps> = ({
    show,
    onClose,
    checkSelection,
    setCheckedSelection,
    header,
    getAllCheck,
}) => {
    const [input, setInput] = useState({
        p0: '',
        p1: '',
        p2: '',
        p3: 0,
        p4: 0,
        p5: 0,
    })
    const { Formik } = formik
    const totalAmount =
        checkSelection.reduce((acc, check) => acc + Number(check.importe), 0) +
        Number(input.p3) +
        Number(input.p4) +
        Number(input.p5)

    const schema = yup.object().shape({
        destination: yup
            .string()
            .required('El destino del pago es obligatorio'),
        detail: yup.string(),
        importe: yup.number(),
    })

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setInput({ ...input, [name]: value })
    }

    const handleSubmit = async (values: Values, { resetForm }: any) => {
        const prop = [
            { property: input.p0, number: Number(input.p3) },
            { property: input.p1, number: Number(input.p4) },
            { property: input.p2, number: Number(input.p5) },
        ]
        values.otherPayment = prop
        values.creationDate = new Date().toISOString()
        const response = await createOrderApi('order', header, values)
        console.log(response)
        resetForm()
        setCheckedSelection([])
        setInput({ p0: '', p1: '', p2: '', p3: 0, p4: 0, p5: 0 })
        setTimeout(() => {
            getAllCheck()
            onClose()
        }, 500)
    }

    return (
        <CustomModal show={show} onClose={onClose}>
            <Modal.Header closeButton onHide={onClose}>
                <Modal.Title>Egreso de cheques</Modal.Title>
            </Modal.Header>
            <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                    totalAmount: totalAmount,
                    destination: '',
                    detail: '',
                    creationDate: '',
                    chequesId:
                        (checkSelection
                            ?.map((check) => check.id)
                            .filter((id) => id !== undefined) as number[]) ||
                        [],
                    otherPayment: [],
                }}
            >
                {({ handleSubmit, handleChange, values, errors }) => (
                    <Container fluid>
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row>
                                <Form.Group
                                    as={Col}
                                    md="12"
                                    controlId="validationFormik101"
                                    className="position-relative"
                                >
                                    <Form.Label>Destino</Form.Label>
                                    <Form.Control
                                        type="string"
                                        name="destination"
                                        value={values.destination}
                                        onChange={handleChange}
                                        isInvalid={!!errors.destination}
                                    />
                                    <Form.Control.Feedback
                                        type="invalid"
                                        tooltip
                                    >
                                        {errors.destination}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                    as={Col}
                                    md="6"
                                    controlId="validationFormik102"
                                    className="position-relative"
                                >
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        type="string"
                                        name="detail"
                                        value={values.detail}
                                        onChange={handleChange}
                                        isInvalid={!!errors.detail}
                                    />
                                    <Form.Control.Feedback
                                        type="invalid"
                                        tooltip
                                    >
                                        {errors.detail}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Col className="my-2">Otros Pagos</Col>
                            </Row>

                            <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationFormik102"
                            >
                                <Row>
                                    <div className="col-6">Detalle</div>
                                    <div className="col-6">Importe</div>
                                </Row>
                                <Row>
                                    <div className="col-6">
                                        {[1, 2, 3].map((input, index) => (
                                            <Form.Group controlId="formInput1">
                                                <Form.Control
                                                    type="text"
                                                    name={`p${index}`}
                                                    value={input[`p${index}`]}
                                                    placeholder="detalle"
                                                    onChange={(event) =>
                                                        handleChangeInput(event)
                                                    }
                                                ></Form.Control>
                                            </Form.Group>
                                        ))}
                                    </div>
                                    <div className="col-6">
                                        {[1, 2, 3].map((input, index) => (
                                            <Form.Group
                                                controlId="formInput1"
                                                key={`${index + 3}`}
                                            >
                                                <Form.Control
                                                    type="number"
                                                    name={`p${index + 3}`}
                                                    value={
                                                        input[`p${index + 3}`]
                                                    }
                                                    placeholder="importe"
                                                    onChange={(event) =>
                                                        handleChangeInput(event)
                                                    }
                                                ></Form.Control>
                                            </Form.Group>
                                        ))}
                                    </div>
                                </Row>
                            </Form.Group>
                            <Row className="mb-3">
                                <Row className="mt-4">
                                    <Col>
                                        {' '}
                                        Total Pago {formatoMoneda(totalAmount)}
                                    </Col>
                                    <Col>
                                        {' '}
                                        Total Cheques{' '}
                                        {checkSelection?.length || 0}
                                    </Col>
                                </Row>
                            </Row>
                            <div className="d-flex justify-content-center">
                                <Button className="col-4 ms-2" type="submit">
                                    Agregar
                                </Button>
                            </div>
                        </Form>
                    </Container>
                )}
            </Formik>
            <></>
        </CustomModal>
    )
}

export default OrderPayment
