import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import * as formik from 'formik'
import { CustomModal } from '../CustomModal/CustomModal'
import { format } from 'date-fns'
import {
    fetchApi,
    getCuitInfo,
    OrderBy,
} from '../../services/apiService'
import SelectBank from './Bank/Bank'
import Swal from 'sweetalert2'
import schema from './validationSchema'
import { AxiosResponse } from 'axios'
import ReactDOM from 'react-dom'
import PdfCheq from './PdfCheq/PdfCheq'

interface EnterCheckProps {
    show: boolean
    onClose: () => void
    setOrderBy: Dispatch<
        SetStateAction<{ order: OrderBy; asc: 'ASC' | 'DES' } | null>
    >
    orderBy: { order: OrderBy; asc: 'ASC' | 'DES' } | null
}

interface Info {
    situation: number
    cheques: boolean
    chequesInfo?: any[]
}
interface ChequesInfo {
    nroCheque: number
    fechaRechazo: string
    monto: number
    fechaPago: string
    fechaPagoMulta: string
    causal: string
}
export const EnterCheck: React.FC<EnterCheckProps> = ({
    show,
    onClose,
    setOrderBy,
    orderBy,
}) => {
    const [bank, setBank] = useState<string>('')
    const [submitAction, setSubmitAction] = useState<string>('')
    const [info, setInfo] = useState<Info>({
        situation: 1,
        cheques: false,
        chequesInfo: [],
    })
    const { Formik } = formik

    const stateInfo = async (
        event: string | any[],
        response: AxiosResponse<any, any> | undefined,
        chequesInfo: any[] = []
    ) => {
        console.log(response)
        const cheques: ChequesInfo[] = []
        const situation = (situation: []): number => {
            if (situation.length === 0) return 1
            const maxSituation = Math.max(...situation)
            if (maxSituation !== 1) {
                return maxSituation
            }
            return 1
        }
        if (event.length === 11) {
            const situationInfo: number = situation(response?.data[0].situacion)
            chequesInfo?.forEach((causal: any) => {
                causal.entidades.forEach((entidades: { detalle: any[] }) => {
                    entidades.detalle.forEach((cheque) => {
                        cheques.push({
                            nroCheque: cheque.nroCheque || 0,
                            fechaRechazo: cheque.fechaRechazo || 0,
                            monto: cheque.monto || 'sin monto',
                            fechaPago: cheque.fechaDePago || 'impago',
                            fechaPagoMulta: cheque.fechaDePagoMulta || 'impaga',
                            causal: causal.causal,
                        })
                    })
                })
                setInfo({ ...info, chequesInfo: cheques })
            })

            if (chequesInfo.length !== 0 && response) {
                return setInfo({
                    situation: situationInfo,
                    cheques: true,
                    chequesInfo: cheques,
                })
            } else if (chequesInfo.length !== 0) {
                return setInfo({ ...info, cheques: true })
            } else if (chequesInfo) {
                return setInfo({
                    situation: situationInfo,
                    cheques: false,
                    chequesInfo: cheques,
                })
            }
        }
    }

    const handleCheques = () => {
        const newWindow = window.open('', '')
        if (newWindow) {
            newWindow.document.write('<div id="Cheques-root"></div>')
            newWindow.document.title = 'Cheques Rechazados'
            newWindow.document.close()
            ReactDOM.render(
                <PdfCheq chequesInfo={info.chequesInfo} />,
                newWindow.document.getElementById('Cheques-root')
            )
        }
    }

    const handleChangeCuit = async (e: string) => {
        let response = null
        let chequesInfo = null
        setInfo({
            situation: 1,
            cheques: false,
            chequesInfo: [],
        })
        if (e.length === 11) {
            response = await getCuitInfo(
                '/emisor/info',
                { cuit: e}
            )
            chequesInfo = await getCuitInfo(
                '/emisor/cheques',
                {cuit:e}
            )
            if (chequesInfo !== null && response !== null) {
            stateInfo(e, response ,chequesInfo?.data)
        }
      
        return response?.data[0].denominacion
        }
    }
    useEffect(() => {
        setInfo({
            situation: 1,
            cheques: false,
            chequesInfo: [],
        })
    }, [show])

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
                        const response = await fetchApi(
                            'cheques',
                            'POST',
                            values
                        )
                        if (response?.status === 201) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Cheque Agregado',
                                showConfirmButton: false,
                                timer: 1500,
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al agregar cheque',
                                text: response?.data.message,
                            })
                        }
                        resetForm()
                        setBank('')
                        setInfo({
                            situation: 1,
                            cheques: false,
                        })
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
                    cuit: '',
                }}
            >
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                    setFieldValue,
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row className="my-2  px-2">
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
                        <Row className="my-1 py-2 px-2">
                            <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationFormik103"
                                className="position-relative"
                            >
                                <Form.Label>Cuit Emisor</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cuit"
                                    value={values.cuit}
                                    maxLength={11}
                                    minLength={11}
                                    onChange={async (e) => {
                                        handleChange(e)
                                        const denominacion =
                                            await handleChangeCuit(
                                                e.target.value
                                            )
                                        if (denominacion) {
                                            setFieldValue(
                                                'librador',
                                                denominacion
                                            )
                                        }
                                    }}
                                    isInvalid={!!errors.cuit}
                                />

                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.librador}
                                </Form.Control.Feedback>
                                <Form.Label className="mt-2">
                                    Emisor del Cheque
                                </Form.Label>
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
                        <Row className="d-flex text-start align-items-start">
                            <Col className="col-8  text-center">
                                <div style={{ minHeight: '40px' }}>
                                    {info.cheques && (
                                        <p className="fs-6 bg-danger px-1 me-4 d-inline-block">
                                            cuit con cheques rechazados
                                        </p>
                                    )}
                                    {info.situation !== 1 && (
                                        <p className="bg-danger px-1 d-inline-block">
                                            cuit en situacion {info.situation}
                                        </p>
                                    )}
                                </div>
                            </Col>
                            <Col>
                                {info.cheques && (
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={handleCheques}
                                    >
                                        ver cheques
                                    </Button>
                                )}
                            </Col>
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
