import { Col, Form, Row } from 'react-bootstrap'

export default function ReportByClient({ inputValue, handleInputValue  ,type}: any) {
  return (
     <>
                                        <Row className="d-flex mt-2">
                                            <Col className="col-8">
                                                <Form.Label
                                                    htmlFor={`input-${type}`}
                                                >
                                                    Cliente
                                                </Form.Label>
                                                <Form.Control
                                                    className="col-4"
                                                    type="text"
                                                    name="cliente"
                                                    aria-describedby={`detailsHelpBlock-${type}`}
                                                    value={inputValue.cliente}
                                                    onChange={(e) =>
                                                        handleInputValue(e)
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="d-flex mt-2">
                                            <Col className="col-6">
                                                <Form.Label
                                                    htmlFor={`input-${type}`}
                                                >
                                                    desde
                                                </Form.Label>
                                                <Form.Control
                                                    className="col-6"
                                                    type="date"
                                                    name="desde"
                                                    aria-describedby={`detailsHelpBlock-${type}`}
                                                    value={inputValue.desde}
                                                    onChange={(e) =>
                                                        handleInputValue(e)
                                                    }
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Label
                                                    htmlFor={`input-${type}`}
                                                >
                                                    hasta
                                                </Form.Label>
                                                <Form.Control
                                                    className="col-6"
                                                    type="date"
                                                    name="hasta"
                                                    aria-describedby={`detailsHelpBlock-${type}`}
                                                    value={inputValue.hasta}
                                                    onChange={(e) =>
                                                        handleInputValue(e)
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </>
  )
}
